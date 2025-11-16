export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}
