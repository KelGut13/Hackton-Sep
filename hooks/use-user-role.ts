import { auth } from '@/config/firebase';
import { getRole, getUser, type Role } from '@/services/database';
import { useEffect, useState } from 'react';

/**
 * Hook personalizado para obtener información del rol del usuario actual
 * @returns Objeto con información del rol, permisos y funciones de verificación
 */
export function useUserRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUser = auth.currentUser;
        if (!currentUser) {
          setRole(null);
          return;
        }

        const user = await getUser(currentUser.uid);
        if (!user || !user.roleId) {
          setRole(null);
          return;
        }

        const userRole = await getRole(user.roleId);
        setRole(userRole);
      } catch (err) {
        console.error('Error loading user role:', err);
        setError(err as Error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();

    // Recargar rol cuando cambie el usuario autenticado
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadUserRole();
    });

    return () => unsubscribe();
  }, []);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: string): boolean => {
    if (!role || !role.permissions) {
      return false;
    }
    return role.permissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene cualquiera de los permisos especificados
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!role || !role.permissions) {
      return false;
    }
    return permissions.some(permission => role.permissions!.includes(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!role || !role.permissions) {
      return false;
    }
    return permissions.every(permission => role.permissions!.includes(permission));
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (roleValue: string): boolean => {
    return role?.value === roleValue;
  };

  return {
    role,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isStudent: role?.value === 'student',
    isTeacher: role?.value === 'teacher',
    permissions: role?.permissions || [],
  };
}
