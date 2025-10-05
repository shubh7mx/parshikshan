import { loginUser, logoutUser, getCurrentUser } from './auth-actions';
import type { User, UserRole, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export const authService = {
  login: loginUser,
  logout: logoutUser,
  getCurrentUser: getCurrentUser,
};

// Role-based redirect helper
export function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'faculty':
      return '/faculty/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'industry_partner':
      return '/company/dashboard';
    default:
      return '/';
  }
}
