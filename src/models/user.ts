import { Model } from './model';

export enum TwoFactorAuthStatus {
  disabled = 'disabled',
  enabled = 'enabled',
  pending = 'pending',
}

export interface TwoFactorAuth {
  type: string;
  status: TwoFactorAuthStatus;
}

export class User extends Model {
  email = '';
  roles: string[] = [];
  verified: boolean = false;
  twoFactorAuth: TwoFactorAuth = {
    type: '',
    status: TwoFactorAuthStatus.disabled,
  };
  data: any = {};
}
