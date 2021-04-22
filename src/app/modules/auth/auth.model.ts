


export interface User {
  user_id: string;
  user_type: string;
  email: string;
  password: string;
  state: boolean;
}

export interface LogIn {
  email: string;
  password: string;
}
