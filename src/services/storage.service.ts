import { TokensDto } from '../dtos/auth-dtos';

export class StorageService {

  private authTokenKey = 'APPSTRAX_AUTH_TOKEN';
  private refreshTokenKey = 'APPSTRAX_REFRESH_TOKEN';
  private canRefreshTokenKey = 'APPSTRAX_CAN_REFRESH_TOKEN';

  private getItem(key: string): string {
    try {
      return localStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  private setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // TODO handle err
    }
  }

  public clear() {
    try {
      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.canRefreshTokenKey);
    } catch (e) {
      // TODO handle err
    }
  }

  public getTokens(): TokensDto {
    const token = this.getItem(this.authTokenKey);
    const refreshToken = this.getItem(this.refreshTokenKey);
    if (!token || !refreshToken) { return null; }
    return { token, refreshToken };
  }

  public setTokens(auth: TokensDto) {
    if (!auth || !auth.token || !auth.refreshToken) {
      this.clear();
    } else {
      this.setItem(this.authTokenKey, auth.token);
      this.setItem(this.refreshTokenKey, auth.refreshToken);
    }
  }

  public canRefreshToken(): boolean {
    const value = this.getItem(this.canRefreshTokenKey);
    return value !== 'false';
  }

  public setCanRefreshToken(value: boolean) {
    this.setItem(this.canRefreshTokenKey, value + '');
  }
}
