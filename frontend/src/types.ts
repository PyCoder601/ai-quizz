export interface LoginType {
  username: string;
  password: string;
}

export interface SignupType extends LoginType {
  email: string;
}
