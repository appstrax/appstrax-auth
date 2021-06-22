import { Services } from './services/services';

import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dtos/auth-dtos';

const services = Services.instance();
const auth = services.authService;
const init = (baseUrl: string) => {
  services.setBaseUrl(baseUrl);
};

export {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  auth,
  init
}
