import { Services } from './services/services';

import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  MessageDto,
} from './dtos/auth-dtos';

import { User } from './models/user';

const services = Services.instance();
const auth = services.authService;
const http = services.httpService;
const users = services.userService;

export * from './models/query';

export {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  MessageDto,
  User,
  auth,
  users,
  http,
}
