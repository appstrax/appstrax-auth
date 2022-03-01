import { Services } from './services';

export class Utils {

  public isTokenExpired(token: string, offsetSeconds = 0): boolean {
    const expirationDate = this.getJWTExpirationDate(token);
    if (!expirationDate) {
      return false;
    }

    return !(expirationDate.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }

  public decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT Token, expecting 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return this.deepFreeze(JSON.parse(decoded));
  }

  private deepFreeze(obj) {
    Object.keys(obj).forEach(prop => {
      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        this.deepFreeze(obj[prop]);
      }
    });
    return Object.freeze(obj);
  }

  private urlBase64Decode(input: string) {
    let output = input.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;

      case 2:
        output += '==';
        break;

      case 3:
        output += '=';
        break;

      default: throw new Error('Illegal base64url string!');
    }
    return window.decodeURIComponent(escape(window.atob(output)));
  }

  private getJWTExpirationDate(token: string) {
    const decoded = this.decodeToken(token);

    if (typeof decoded.exp === 'undefined') {
      return null;
    }

    const expirationDate = new Date(0); // 0 as param sets the date to the epoch
    expirationDate.setUTCSeconds(decoded.exp);

    return expirationDate;
  }

  pathJoin(...parts) {
    const separator = '/';
    const replace = new RegExp(separator + '{1,}', 'g');
    return parts.join(separator)
      .replace(replace, separator)
      .replace('http:/', 'http://')
      .replace('https:/', 'https://');
  }

  public getAuthUrl(extension: string): string {
    const base = Services.instance().getBaseUrl();
    return this.pathJoin(base, 'api/auth', extension);
  }

  public getUserUrl(extension: string): string {
    const base = Services.instance().getBaseUrl();
    return this.pathJoin(base, 'api/user', extension);
  }

  public sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
