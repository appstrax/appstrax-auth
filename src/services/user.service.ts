import { Services } from './services';
import { Utils } from './utils';
import { HttpService } from './http.service';

import { User } from '../models/user';

export class UserService {

  constructor(
    private utils: Utils,
    private http: HttpService
  ) {}

  private getUrl(extension: string): string {
    const base = Services.instance().getBaseUrl();
    return this.utils.pathJoin(base, 'api/user', extension);
  }

  public async find(where?: any): Promise<User[]> {
    let queryParam = '';

    if (where) {
      queryParam = '?';
      const keys = Object.keys(where);
      for (const key of keys) {
        const value = where[key];
        queryParam += `${key}=${value}&`;
      }
    }

    return this.http.get(this.getUrl(queryParam));
  }
}
