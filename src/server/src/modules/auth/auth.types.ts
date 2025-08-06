import { ROLE } from "@prisma/client";

export interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
  role?: ROLE;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: ROLE;
    avatar: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
