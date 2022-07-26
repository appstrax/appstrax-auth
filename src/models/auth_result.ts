import { User } from './user';

export enum AuthStatus {
  authenticated = 'authenticated',
  pendingTwoFactorAuthCode = 'pendingTwoFactorAuthCode',
  notAuthenticated = 'notAuthenticated'
}

export enum AuthErrors {
  // registration errors
  emailAddressAlreadyExists = 'emailAddressAlreadyExists',
  badlyFormattedEmailAddress = 'badlyFormattedEmailAddress',
  noPasswordSupplied = 'noPasswordSupplied',

  // login errors
  invalidEmailOrPassword = 'invalidEmailOrPassword',
  userBlocked = 'userBlocked',
  invalidTwoFactorAuthCode = 'invalidTwoFactorAuthCode',

  // forgot/reset password errors
  emailAddressDoesNotExist = 'emailAddressDoesNotExist',
  invalidResetCode = 'invalidResetCode',

  // unknown errors
  unexpectedError = 'unexpectedError',
}

export class AuthResult {
  status: AuthStatus;
  user?: User;

  static authenticated(user: User) {
    return new AuthResult({
      status: AuthStatus.authenticated,
      user,
    });
  }

  static requireTwoFactorAuthCode() {
    return new AuthResult({
      status: AuthStatus.pendingTwoFactorAuthCode,
    });
  }

  constructor({
    status,
    user,
  }: AuthResult) {
    this.status = status;
    this.user = user;
  }
}