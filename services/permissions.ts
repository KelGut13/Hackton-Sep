import { getRole, getUser } from './database';

/**
 * Servicio para verificar permisos de usuarios basados en roles
 */

/**
 * Verifica si un usuario tiene un permiso específico
 * @param userId - ID del usuario a verificar
 * @param permission - Permiso a verificar (ej: 'create_lessons')
 * @returns true si el usuario tiene el permiso, false en caso contrario
 */
export const hasPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  try {
    // Obtener el usuario
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return false;
    }

    // Obtener el rol del usuario
    const role = await getRole(user.roleId);
    if (!role || !role.permissions) {
      return false;
    }

    // Verificar si el rol tiene el permiso
    return role.permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Verifica si un usuario tiene cualquiera de los permisos especificados
 * @param userId - ID del usuario a verificar
 * @param permissions - Array de permisos a verificar
 * @returns true si el usuario tiene al menos uno de los permisos
 */
export const hasAnyPermission = async (
  userId: string,
  permissions: string[]
): Promise<boolean> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return false;
    }

    const role = await getRole(user.roleId);
    if (!role || !role.permissions) {
      return false;
    }

    return permissions.some(permission => role.permissions!.includes(permission));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Verifica si un usuario tiene todos los permisos especificados
 * @param userId - ID del usuario a verificar
 * @param permissions - Array de permisos a verificar
 * @returns true si el usuario tiene todos los permisos
 */
export const hasAllPermissions = async (
  userId: string,
  permissions: string[]
): Promise<boolean> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return false;
    }

    const role = await getRole(user.roleId);
    if (!role || !role.permissions) {
      return false;
    }

    return permissions.every(permission => role.permissions!.includes(permission));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Obtiene todos los permisos de un usuario
 * @param userId - ID del usuario
 * @returns Array de permisos o array vacío si no se encuentran
 */
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return [];
    }

    const role = await getRole(user.roleId);
    if (!role || !role.permissions) {
      return [];
    }

    return role.permissions;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};

/**
 * Verifica si un usuario tiene un rol específico
 * @param userId - ID del usuario a verificar
 * @param roleValue - Valor del rol a verificar (ej: 'teacher', 'student')
 * @returns true si el usuario tiene ese rol
 */
export const hasRole = async (userId: string, roleValue: string): Promise<boolean> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return false;
    }

    const role = await getRole(user.roleId);
    if (!role) {
      return false;
    }

    return role.value === roleValue;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

/**
 * Obtiene el nombre del rol de un usuario
 * @param userId - ID del usuario
 * @returns Nombre del rol o null
 */
export const getUserRoleName = async (userId: string): Promise<string | null> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      return null;
    }

    const role = await getRole(user.roleId);
    return role ? role.name : null;
  } catch (error) {
    console.error('Error getting user role name:', error);
    return null;
  }
};

// Constantes de permisos para facilitar el uso
export const PERMISSIONS = {
  VIEW_LESSONS: 'view_lessons',
  CREATE_LESSONS: 'create_lessons',
  EDIT_LESSONS: 'edit_lessons',
  DELETE_LESSONS: 'delete_lessons',
  COMPLETE_ACTIVITIES: 'complete_activities',
  VIEW_PROGRESS: 'view_progress',
  VIEW_STUDENT_PROGRESS: 'view_student_progress',
  MANAGE_USERS: 'manage_users',
} as const;

// Constantes de roles
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const;
