import { Model } from './model';

interface TwoFactorAuth {
  type: string;
  enabled: boolean;
}

export class User extends Model {
  email = '';
  roles: string[] = [];
  verified: boolean = false;
  twoFactorAuth: TwoFactorAuth = {
    type: '',
    enabled: false,
  };
  data: any = {};
}
