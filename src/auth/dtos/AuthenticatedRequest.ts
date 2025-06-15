export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}
