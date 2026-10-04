export interface User {
  email: string;
  username: string;
}

export interface PasswordResetRequest {
  user_id: string;
  expires_at: string;
  created_at: string;
}