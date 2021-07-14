export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  data: any;
}

export interface AuthTokensDto {
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  password: string;
}

export interface ChangePasswordDto {
  password: string;
  newPassword: string;
}

export interface MessageDto {
  message: string;
}