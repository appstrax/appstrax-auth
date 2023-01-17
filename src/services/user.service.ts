import { Services } from './services';
import { Utils } from './utils';
import { HttpService } from './http.service';

import { User } from '../models/user';
import { FindResultDto } from '../dtos';
import { Where, Order } from '..';

export interface FetchQuery {
  where?: Where;
  order?: Order;
  offset?: number;
  limit?: number;
}

export class UserService {

  constructor(
    private utils: Utils,
    private http: HttpService
  ) {}

  private getUrl(extension: string): string {
    const base = Services.instance().getBaseUrl();
    return this.utils.pathJoin(base, 'api/user', extension);
  }

  public async find(query?: FetchQuery): Promise<FindResultDto<User>> {
    const queryParams: any = {};
    if (query?.where) {
      queryParams.where = JSON.stringify(query.where);
    }
    if (query?.order) {
      queryParams.order = JSON.stringify(query.order);
    }
    if (query?.offset || query?.limit) {
      queryParams.offset = query.offset;
      queryParams.limit = query.limit;
    }

    const params = new URLSearchParams(queryParams);

    return this.http.get(this.getUrl('?' + params));
  }
}
