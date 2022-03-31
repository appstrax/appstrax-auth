import { FetchService, HttpVerb } from './fetch.service';
import { Services } from './services';
import { Utils } from './utils';
import { StorageService } from './storage.service';

import {
  TokensDto, ForgotPasswordDto, LoginDto, RegisterDto,
  ResetPasswordDto, MessageDto, ChangePasswordDto
} from '../dtos/auth-dtos';
import { User } from '../models/user';

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
      if (this.utils.isTokenExpired(this.tokens.refreshToken)) {
        await this.logout();
      } else {
        if (this.storageService.canRefreshToken()) {
          await this.refreshTokens();
        } else {
          await this.logout();
        }
      }
    }
    this.loading = false;
  }

  private onAuthStateChanged(tokens: TokensDto) {
    this.tokens = tokens;
    this.user = tokens ? this.utils.decodeToken(tokens.token) : null;
    this.storageService.setTokens(tokens);
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


  public async register(registerDto: RegisterDto): Promise<User> {
    try {
      if (await this.isAuthenticated()) { await this.logout(); }

      const url = this.utils.getAuthUrl('register');
      const tokens: TokensDto = await this.post(url, registerDto);
      await this.onAuthStateChanged(tokens);
      return this.user;
    } catch (err) {
      await this.logout();
      throw err;
    }
  }

  public async login(loginDto: LoginDto): Promise<User> {
    try {
      if (await this.isAuthenticated()) { await this.logout(); }

      const url = this.utils.getAuthUrl('login');
      const tokens: TokensDto = await this.post(url, loginDto);
      this.storageService.setCanRefreshToken(loginDto.remember ?? true);
      await this.onAuthStateChanged(tokens);
      return this.user;
    } catch (err) {
      await this.logout();
      throw err;
    }
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
      throw new Error('Please login before changing password');
    }

    const url = this.utils.getUserUrl('change-password');
    return await this.post(url, changePasswordDto, false);
  }

  public async saveUserData(data: any): Promise<User> {
    if (!await this.isAuthenticated()) {
      throw new Error('Please login before saving user data');
    }

    const url = this.utils.getUserUrl('data');
    const tokens: TokensDto = await this.post(url, data, false);
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
