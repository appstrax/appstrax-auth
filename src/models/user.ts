import { Model } from './model';

export class User extends Model {
    email: string = '';
    password: string = '';
    admin: boolean = false;
    data: any = {};
}
