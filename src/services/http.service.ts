export class HttpService {

  public async post(url: string, body: any, token: string = null): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...this.getAuthHeader(token)
      },
      body: JSON.stringify(body)
    });

    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw new HttpError(await response.text(), response.status);
    }
  }

  private getAuthHeader(token: string): any {
    if (!token) { return {}; }
    return { 'Authorization': 'Bearer ' + token };
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