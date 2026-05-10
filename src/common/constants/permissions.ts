import { RoleName } from '../../../generated/prisma/client';

export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  VIEW_USERS = 'view_users',

  // Role Management
  MANAGE_ROLES = 'manage_roles',

  // Profile Management
  VIEW_PROFILES = 'view_profiles',
  UPDATE_PROFILE = 'update_profile',
}

// Cấu hình các quyền cho từng Role
export const RolePermissions: Record<RoleName, Permission[]> = {
  [RoleName.ADMIN]: Object.values(Permission), // Admin có tất cả các quyền
  
  [RoleName.TEACHER]: [
    Permission.VIEW_USERS,
    Permission.VIEW_PROFILES,
    Permission.UPDATE_PROFILE,
  ],
  
  [RoleName.USER]: [
    Permission.VIEW_PROFILES,
    Permission.UPDATE_PROFILE,
  ],
};
