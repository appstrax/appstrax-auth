export interface LoginDto {
  email: string;
  password: string;
  /* 
    set this to 'false' if you would not like the user token to auto refresh
  */
  remember?: boolean;
}

export interface RegisterDto {
  email: string;
  password: string;
  data: any;
  emailTemplate?: string;
}

export interface TokensDto {
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
  emailTemplate?: string;
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