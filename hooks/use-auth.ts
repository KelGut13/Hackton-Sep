import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { onAuthChange } from '../services/auth';

/**
 * Hook para manejar el estado de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};