export interface User {
  _id?: string;
  name?: string;
  email: string;
  token: string;
}

// Alternative: You can also export as type
export type UserType = User;