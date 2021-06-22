import { Services } from './services';
import { Utils } from './utils';
import { StorageService } from './storage.service';
import { HttpService } from './http.service';

import {
  ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto
} from '../dtos/auth-dtos';
import { User } from '../models/user';

export class AuthService {

  private user: User = null;

  constructor(
    private utils: Utils,
    private storageService: StorageService,
    private http: HttpService
  ) {
    this.onAuthStateChanged(this.storageService.getAuthToken());
  }

  private async onAuthStateChanged(token: string) {
    if (!token || this.utils.isTokenExpired(token)) {
      this.user = null;
    } else {
      this.user = this.utils.decodeToken(token);
    }

    this.storageService.setAuthToken(token);
  }

  private baseUrl(): string {
    return Services.instance().getBaseUrl();
  }

  public async register(registerDto: RegisterDto): Promise<User> {
    try {
      const token = await this.http.post(this.baseUrl() + '/register', registerDto);
      this.onAuthStateChanged(token);
      return this.user;
    } catch (err) {
      this.logout();
      throw err;
    }
  }

  public async login(loginDto: LoginDto): Promise<User> {
    try {
      const token = await this.http.post(this.baseUrl() + '/login', loginDto);
      this.onAuthStateChanged(token);
      return this.user;
    } catch (err) {
      this.logout();
      throw err;
    }
  }

  public forgotPassword(forgotDto: ForgotPasswordDto): Promise<string> {
    return this.http.post(this.baseUrl() + '/forgot-password', forgotDto);
  }

  public resetPassword(resetDto: ResetPasswordDto): Promise<string> {
    return this.http.post(this.baseUrl() + '/reset-password', resetDto);
  }

  public isAuthenticated(): boolean {
    return this.user != null;
  }

  public getUser(): User {
    return this.user;
  }

  public logout() {
    this.onAuthStateChanged(null);
  }

  public init(baseUrl: string) {
    Services.instance().setBaseUrl(baseUrl);
  };
}
