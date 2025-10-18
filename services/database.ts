import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Tipos de ejemplo para tu base de datos
export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt: Date;
  progress?: number;
  roleId?: string; // ID del rol en la colección 'roles'
  accessibilityPreferences?: {
    highContrast?: boolean;
    colorBlindMode?: boolean;
    fontSize?: string;
    screenReaderEnabled?: boolean;
  };
}

export interface Role {
  id?: string;
  name: string;        // Nombre del rol (ej: 'Alumno', 'Maestro')
  value: string;       // Valor interno (ej: 'student', 'teacher')
  description?: string; // Descripción opcional del rol
  permissions?: string[]; // Permisos asociados al rol
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

// ==================== USUARIOS ====================

/**
 * Obtener un usuario por ID
 */
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Crear un nuevo usuario con UID específico
 */
export const createUser = async (userId: string, userData: Omit<User, 'id'>): Promise<string> => {
  try {
    // Usar el UID de Authentication como ID del documento en Firestore
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date()
    });
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Actualizar un usuario
 */
export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ==================== LECCIONES ====================

/**
 * Obtener todas las lecciones
 */
export const getLessons = async (): Promise<Lesson[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'lessons'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lesson[];
  } catch (error) {
    console.error('Error getting lessons:', error);
    throw error;
  }
};

/**
 * Obtener una lección por ID
 */
export const getLesson = async (lessonId: string): Promise<Lesson | null> => {
  try {
    const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
    if (lessonDoc.exists()) {
      return { id: lessonDoc.id, ...lessonDoc.data() } as Lesson;
    }
    return null;
  } catch (error) {
    console.error('Error getting lesson:', error);
    throw error;
  }
};

/**
 * Crear una nueva lección
 */
export const createLesson = async (lessonData: Omit<Lesson, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'lessons'), {
      ...lessonData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

/**
 * Obtener lecciones por dificultad
 */
export const getLessonsByDifficulty = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<Lesson[]> => {
  try {
    const q = query(
      collection(db, 'lessons'),
      where('difficulty', '==', difficulty),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lesson[];
  } catch (error) {
    console.error('Error getting lessons by difficulty:', error);
    throw error;
  }
};

// ==================== PROGRESO ====================

/**
 * Guardar progreso del usuario
 */
export const saveProgress = async (userId: string, lessonId: string, progress: number): Promise<void> => {
  try {
    await addDoc(collection(db, 'progress'), {
      userId,
      lessonId,
      progress,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

/**
 * Obtener progreso del usuario
 */
export const getUserProgress = async (userId: string): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'progress'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

// ==================== ROLES ====================

/**
 * Obtener todos los roles disponibles
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'roles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Role[];
  } catch (error) {
    console.error('Error getting roles:', error);
    throw error;
  }
};

/**
 * Obtener un rol por ID
 */
export const getRole = async (roleId: string): Promise<Role | null> => {
  try {
    const roleDoc = await getDoc(doc(db, 'roles', roleId));
    if (roleDoc.exists()) {
      return { id: roleDoc.id, ...roleDoc.data() } as Role;
    }
    return null;
  } catch (error) {
    console.error('Error getting role:', error);
    throw error;
  }
};

/**
 * Crear un nuevo rol (solo para administradores)
 */
export const createRole = async (roleData: Omit<Role, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'roles'), {
      ...roleData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Inicializar roles por defecto (ejecutar una sola vez)
 */
export const initializeDefaultRoles = async (): Promise<void> => {
  try {
    // Verificar si ya existen roles
    const existingRoles = await getRoles();
    if (existingRoles.length > 0) {
      console.log('Los roles ya están inicializados');
      return;
    }

    // Crear roles por defecto
    const defaultRoles = [
      {
        name: 'Alumno',
        value: 'student',
        description: 'Usuario que realiza actividades y aprende',
        permissions: ['view_lessons', 'complete_activities', 'view_progress'],
        createdAt: new Date()
      },
      {
        name: 'Maestro',
        value: 'teacher',
        description: 'Usuario que crea y gestiona lecciones',
        permissions: ['view_lessons', 'create_lessons', 'edit_lessons', 'view_student_progress'],
        createdAt: new Date()
      }
    ];

    for (const role of defaultRoles) {
      await createRole(role);
    }

    console.log('Roles inicializados correctamente');
  } catch (error) {
    console.error('Error initializing default roles:', error);
    throw error;
  }
};