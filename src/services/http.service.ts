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

    // check if the token expired, refresh the token and try again
    if (response.status === 401) {
      const err = await response.text();
      if (err === 'Token Expired') {
        await Services.instance().authService.getRefreshedToken();
        response = await this.tryFetch(url, headers, method, body);
      }
    }

    return this.handleResponse(response);
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

  private async handleResponse(response: Response): Promise<any> {
    if (this.isSuccessful(response)) {
      return this.getContent(response);
    } else {
      return this.throwError(response);
    }
  }

  private isSuccessful(response: Response): boolean {
    return response.status >= 200 && response.status <= 299;
  }

  private responseHasContent(response: Response): boolean {
    return response.headers.get("Content-Length") != '0';
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

  private async throwError(response: Response): Promise<void> {

    try {
      const content = await this.getContent(response);
      if (content) {
        throw new HttpError(content, response.status)
      }
    } catch (err) {
      //
    }

    const err = `Something went wrong, 
    please try again or contact your system administrator`;
    throw new HttpError(err, response.status);
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
