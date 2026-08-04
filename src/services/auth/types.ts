export type UserRole = 'owner' | 'caretaker' | 'renter' | 'admin' | 'user';

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  role: UserRole;
  avatar?: string;
  properties?: string[];
  createdAt?: string;
  updatedAt?: string;
}
