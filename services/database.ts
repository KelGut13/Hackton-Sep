import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Tipos de ejemplo para tu base de datos
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  progress?: number;
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
 * Crear un nuevo usuario
 */
export const createUser = async (userData: Omit<User, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: new Date()
    });
    return docRef.id;
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