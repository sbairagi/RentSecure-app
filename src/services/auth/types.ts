export type UserRole = 'owner' | 'caretaker' | 'renter' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  properties?: string[];
  createdAt: string;
  updatedAt: string;
}
