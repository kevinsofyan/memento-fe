export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  avatar: string;
  createdAt: string;
}


export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

