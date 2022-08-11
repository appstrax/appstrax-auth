import { FetchService, HttpVerb } from './fetch.service';
import { Services } from './services';
import { Utils } from './utils';
import { StorageService } from './storage.service';

import {
  TokensDto, ForgotPasswordDto, LoginDto, RegisterDto,
  ResetPasswordDto, MessageDto, ChangePasswordDto, TwoFactorAuthDto
} from '../dtos/auth-dtos';
import { User } from '../models/user';
import { AuthResult, AuthStatus } from './../models/auth_result';

export class AuthService {
  private user: User = null;
  private tokens: TokensDto = null;
  private loading = false;

  constructor(
    private utils: Utils,
    private storageService: StorageService,
  ) { }

  public async init(baseUrl: string): Promise<void> {
    Services.instance().setBaseUrl(baseUrl);

    const tokens = this.storageService.getTokens();
    if (tokens) {
      this.tokens = tokens;
      await this.validateTokens();
      this.onAuthStateChanged(this.tokens);
    }
  }

  private async validateTokens(): Promise<void> {
    while (this.loading) { await this.utils.sleep(50); }

    if (!this.tokens) { return; }

    this.loading = true;
    if (this.utils.isTokenExpired(this.tokens.token)) {

      if (this.canRefreshTokens()) {
        await this.refreshTokens();
      } else {
        await this.logout();
      }

    }
    this.loading = false;
  }

  private async canRefreshTokens() {
    return this.storageService.canRefreshToken() &&
      this.tokens.refreshToken &&
      !this.utils.isTokenExpired(this.tokens.refreshToken);
  }

  private onAuthStateChanged(tokens: TokensDto) {
    this.tokens = tokens;
    this.storageService.setTokens(tokens);
    if (tokens) {
      const decoded = this.utils.decodeToken(tokens.token);
      // only set the user if we have an id in the token.
      // IE. we have a user
      if (decoded.id) {
        this.user = decoded;
      } else {
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  private async refreshTokens(): Promise<void> {
    try {
      const refreshToken = this.tokens.refreshToken;
      const url = this.utils.getAuthUrl('refresh-token');

      const tokens: TokensDto = await this.post(url, { refreshToken });

      this.onAuthStateChanged(tokens);
    } catch (err) {
      await this.logout();
    }
  }


  public async register(registerDto: RegisterDto): Promise<AuthResult> {
    try {
      if (await this.isAuthenticated()) { await this.logout(); }

      const url = this.utils.getAuthUrl('register');
      const tokens: TokensDto = await this.post(url, registerDto);

      await this.onAuthStateChanged(tokens);

      return AuthResult.authenticated(this.user);
    } catch (err) {
      await this.logout();
      throw err;
    }
  }

  public async login(loginDto: LoginDto): Promise<AuthResult> {
    try {
      if (await this.isAuthenticated()) { await this.logout(); }

      const url = this.utils.getAuthUrl('login');
      const tokens: TokensDto = await this.post(url, loginDto);

      this.storageService.setCanRefreshToken(loginDto.remember ?? true);
      await this.onAuthStateChanged(tokens);

      if (this.user) {
        return AuthResult.authenticated(this.user);
      } else if (this.tokens) {
        return AuthResult.requireTwoFactorAuthCode();
      }
    } catch (err) {
      await this.logout();
      throw err;
    }
  }

  public async verifyTwoFactorAuthCode(code: string): Promise<User> {
    if (this.utils.isTokenExpired(this.tokens.token)) {
      await this.logout();
      throw new Error('Your token has expired');
    }
    if (this.tokens && this.user) {
      throw new Error('User already authenticated');
    }

    const url = this.utils.getAuthUrl('verify-2fa');
    const tokens: TokensDto = await this.post(url, { code }, false);
    await this.onAuthStateChanged(tokens);
    return this.user as User;
  }

  public forgotPassword(forgotDto: ForgotPasswordDto): Promise<MessageDto> {
    return this.post(this.utils.getAuthUrl('forgot-password'), forgotDto);
  }

  public resetPassword(resetDto: ResetPasswordDto): Promise<MessageDto> {
    return this.post(this.utils.getAuthUrl('reset-password'), resetDto);
  }

  public async changePassword(
    changePasswordDto: ChangePasswordDto
  ): Promise<MessageDto> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('change-password');
    return await this.post(url, changePasswordDto, false);
  }

  public async saveUserData(data: any): Promise<User> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('data');
    const tokens: TokensDto = await this.post(url, data, false);
    this.onAuthStateChanged(tokens);
    return this.user;
  }

  public async sendEmailVerificationCode(): Promise<void> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('send-verification-email');
    await this.post(url, {}, false);
  }

  public async verifyEmailAddress(code: string): Promise<User> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('verify-email');
    const tokens: TokensDto = await this.post(url, { code }, false);
    this.onAuthStateChanged(tokens);
    return this.user;
  }

  public async generateTwoFactorAuthSecret(): Promise<{
    secret: string,
    qrCode: string,
  }> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('generate-2fa-secret');
    const response: TwoFactorAuthDto = await this.post(url, {}, false);

    this.onAuthStateChanged(response.tokens);

    return {
      secret: response.secret,
      qrCode: response.qr,
    };
  }

  public async enableTwoFactorAuth(code: string): Promise<User> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('enable-2fa');
    const tokens: TokensDto = await this.post(url, { code }, false);
    this.onAuthStateChanged(tokens);

    return this.user;
  }

  public async disableTwoFactorAuthentication(): Promise<User> {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const url = this.utils.getUserUrl('disable-2fa');
    const tokens: TokensDto = await this.post(url, {}, false);
    this.onAuthStateChanged(tokens);
    return this.user;
  }


  public async isAuthenticated(): Promise<boolean> {
    await this.validateTokens();
    return this.user != null;
  }

  public async getAuthToken(): Promise<string> {
    await this.validateTokens();
    return this.tokens ? this.tokens.token : null;
  }

  public async getUser(): Promise<User> {
    await this.validateTokens();
    return this.user;
  }

  public async getAuthStatus(): Promise<AuthStatus> {
    await this.validateTokens();
    if (this.user) { return AuthStatus.authenticated; }
    if (this.tokens && !this.user) { return AuthStatus.pendingTwoFactorAuthCode; }
    return AuthStatus.notAuthenticated;
  }

  public async logout(): Promise<void> {
    await this.post(this.utils.getAuthUrl('logout'), {});
    this.onAuthStateChanged(null);
  }

  private post(
    url: string,
    body: any = {},
    ignoreToken = true,
  ): Promise<any> {
    return FetchService.fetch({
      url,
      method: HttpVerb.POST,
      body: body,
      ignoreExpiredToken: ignoreToken,
    });
  }
}
