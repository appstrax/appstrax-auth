import { Services } from './services';

export class HttpService {

  public get(url: string, headers: any = {}): Promise<any> {
    return this.doFetch(url, headers, 'GET');
  }

  public post(url: string, body: any, headers: any = {}): Promise<any> {
    return this.doFetch(url, headers, 'POST', body);
  }

  public patch(url: string, body: any, headers: any = {}): Promise<any> {
    return this.doFetch(url, headers, 'PATCH', body);
  }

  public put(url: string, body: any, headers: any = {}): Promise<any> {
    return this.doFetch(url, headers, 'PUT', body);
  }

  public delete(url: string, headers: any = {}): Promise<any> {
    return this.doFetch(url, headers, 'DELETE');
  }

  private async doFetch(
    url: string,
    headers: any,
    method: string,
    body: any = null
  ): Promise<any> {

    const response = await fetch(url, {
      method,
      headers: this.getHeaders(headers),
      body: body ? JSON.stringify(body) : null
    });

    return this.handleResponse(response);
  }

  private async handleResponse(response: Response): Promise<any> {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw new HttpError(await response.text(), response.status);
    }
  }

  private getHeaders(additional: any): any {
    const token = Services.instance().authService.getAuthToken();
    let authHeaders = {};
    if (token) { authHeaders = { 'Authorization': 'Bearer ' + token }; }

    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...authHeaders, ...additional
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
