import { Services } from './services';

export class HttpService {

  public get(url: string, headers: any = {}): Promise<any> {
    return this.performFetch(url, headers, 'GET');
  }

  public post(url: string, body: any, headers: any = {}): Promise<any> {
    return this.performFetch(url, headers, 'POST', body);
  }

  public patch(url: string, body: any, headers: any = {}): Promise<any> {
    return this.performFetch(url, headers, 'PATCH', body);
  }

  public put(url: string, body: any, headers: any = {}): Promise<any> {
    return this.performFetch(url, headers, 'PUT', body);
  }

  public delete(url: string, headers: any = {}): Promise<any> {
    return this.performFetch(url, headers, 'DELETE');
  }

  private async performFetch(
    url: string, headers: any, method: string, body: any = null
  ): Promise<any> {

    let response = await this.tryFetch(url, headers, method, body);

    let status = response.status;
    let content = await this.getContent(response);

    // check if the token expired, refresh the token and try again
    if (status === 401 && content === 'Token Expired') {
      await Services.instance().authService.getRefreshedToken();
      response = await this.tryFetch(url, headers, method, body);

      status = response.status;
      content = await this.getContent(response);
    }

    if (this.isSuccessful(status)) {
      return content;
    } else {
      return this.throwError(content, status);
    }
  }

  private async tryFetch(
    url: string, headers: any, method: string, body: any = null
  ): Promise<Response> {
    return fetch(url, {
      method,
      headers: this.getHeaders(headers),
      body: body ? JSON.stringify(body) : null
    });
  }

  private async getContent(response: Response): Promise<any> {
    if (!this.responseHasContent(response)) {
      return null;
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  }

  private responseHasContent(response: Response): boolean {
    // tslint:disable-next-line: triple-equals
    return response.headers.get('Content-Length') != '0';
  }

  private isSuccessful(status: number): boolean {
    return status >= 200 && status <= 299;
  }

  private throwError(content: any, status: number): Promise<void> {
    if (content) {
      throw new HttpError(content, status)
    }

    const err = `Something went wrong, 
    please try again or contact your system administrator`;
    throw new HttpError(err, status);
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
