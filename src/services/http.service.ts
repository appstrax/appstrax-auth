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
    return response.json();
  }

  private getAuthHeader(token: string): any {
    if (!token) { return {}; }
    return { 'Authorization': 'Bearer ' + token };
  }
}
