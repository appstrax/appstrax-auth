import { Services } from './services';

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface FetchPayload {
  url: string;
  method: HttpVerb;
  body?: any;
  headers?: any;
  ignoreExpiredToken?: boolean;
}

export class FetchService {

  public static async fetch(payload: FetchPayload): Promise<any> {

    const response = await this.doFetch(payload);

    const content = await this.getContent(response);
    const status = response.status;

    if (this.isSuccessful(status)) {
      return content;
    } else {
      return this.throwError(content, status);
    }
  }

  private static async doFetch(payload: FetchPayload): Promise<Response> {
    const url = payload.url;
    const method = payload.method;
    const body = payload.body || null;

    return fetch(url, {
      method,
      headers: await this.getHeaders(payload),
      body: body ? JSON.stringify(body) : null
    });
  }

  private static async getContent(response: Response): Promise<any> {
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

  private static responseHasContent(response: Response): boolean {
    // tslint:disable-next-line: triple-equals
    return response.headers.get('Content-Length') != '0';
  }

  private static isSuccessful(status: number): boolean {
    return status >= 200 && status <= 299;
  }

  private static throwError(content: any, status: number): Promise<void> {
    if (content) {
      throw new HttpError(content, status)
    }

    const err = `Something went wrong, 
    please try again or contact your system administrator`;
    throw new HttpError(err, status);
  }

  private static async getHeaders(payload: FetchPayload): Promise<any> {
    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    headers = Object.assign(headers, payload.headers || {});

    let token: string;
    if (payload.ignoreExpiredToken) {
      const tokens = Services.instance().storageService.getTokens();
      if (tokens) { token = tokens.token; }
    } else {
      // this call returns a refreshed the token if expired
      token = await Services.instance().authService.getAuthToken();
    }

    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }

    return headers;
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
