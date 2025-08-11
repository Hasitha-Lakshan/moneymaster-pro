export interface User {
  id: string;
  email: string;
  // add other required app-specific fields here
}

export interface AuthState {
  user: User | null;
}
