import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Utils } from './utils';

export class Services {

  private static _instance: Services;

  public utils: Utils;
  public storageService: StorageService;
  public httpService: HttpService;
  public authService: AuthService;

  private baseUrl: string = '';

  public static instance(): Services {
    if (!this._instance) { this._instance = new this(); }
    return this._instance;
  }

  constructor() {
    this.utils = new Utils();
    this.storageService = new StorageService();
    this.httpService = new HttpService();
    this.authService = new AuthService(this.utils, this.storageService, this.httpService);
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    if (!this.baseUrl) { throw new Error('Please initialize auth'); }
    return this.baseUrl;
  }
}
