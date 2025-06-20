export interface LoginType {
  username: string;
  password: string;
}

export interface SignupType extends LoginType {
  email: string;
}

export interface UserType {
  id?: string;
  username: string;
  email: string;
}

export interface QuizType {
  id?: string;
  title: string;
  result: string | null;
  created_at: string;
  elements: QuizElements[];
}

export interface QuizElements {
  id?: string;
  question: string;
  options: string | string[];
  correct_option: number;
  explanation: string;
  point: number;
}

export interface QuotaType {
  quota_remaining: number;
  last_reset: string;
}
