# 🔥 Firebase - Guía Completa de Uso

## ✅ Estado de la Integración

Firebase está **completamente configurado** y listo para usar en tu aplicación EduPlay.

### 📊 Configuración Actual

- **Proyecto**: kidiquo
- **Base de datos**: Firestore
- **Autenticación**: Firebase Auth
- **Storage**: Firebase Storage
- **Estado**: ✅ Conectado y funcionando

---

## 🧪 Probar la Conexión

### Método 1: Usar la pestaña Firebase en la App

1. **Abre la aplicación** (web o móvil)
2. **Ve a la pestaña "Firebase"** (última pestaña)
3. **Presiona "Crear Lección de Prueba"**
4. **Verás las lecciones** cargadas desde Firestore

### Método 2: Verificar en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto **kidiquo**
3. Ve a **Firestore Database**
4. Verás las colecciones creadas: `users`, `lessons`, `progress`

---

## 📚 Colecciones Disponibles

### 1. **users** - Usuarios de la aplicación

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  progress?: number;
}
```

**Funciones disponibles:**
- `getUser(userId)` - Obtener usuario por ID
- `createUser(userData)` - Crear nuevo usuario
- `updateUser(userId, userData)` - Actualizar usuario

### 2. **lessons** - Lecciones educativas

```typescript
interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}
```

**Funciones disponibles:**
- `getLessons()` - Obtener todas las lecciones
- `getLesson(lessonId)` - Obtener lección por ID
- `createLesson(lessonData)` - Crear nueva lección
- `getLessonsByDifficulty(difficulty)` - Filtrar por dificultad

### 3. **progress** - Progreso de usuarios

```typescript
interface Progress {
  userId: string;
  lessonId: string;
  progress: number;
  updatedAt: Date;
}
```

**Funciones disponibles:**
- `saveProgress(userId, lessonId, progress)` - Guardar progreso
- `getUserProgress(userId)` - Obtener progreso del usuario

---

## 💻 Ejemplos de Uso

### Crear una lección

```typescript
import { createLesson } from '@/services/database';

const nuevaLeccion = {
  title: "Matemáticas Básicas",
  description: "Aprende a sumar y restar",
  content: "Contenido de la lección...",
  difficulty: "easy" as const,
  createdAt: new Date()
};

const lessonId = await createLesson(nuevaLeccion);
console.log('Lección creada con ID:', lessonId);
```

### Obtener todas las lecciones

```typescript
import { getLessons } from '@/services/database';

const lecciones = await getLessons();
console.log('Total de lecciones:', lecciones.length);
```

### Crear un usuario

```typescript
import { createUser } from '@/services/database';

const nuevoUsuario = {
  name: "Juan Pérez",
  email: "juan@example.com",
  createdAt: new Date(),
  progress: 0
};

const userId = await createUser(nuevoUsuario);
```

### Guardar progreso

```typescript
import { saveProgress } from '@/services/database';

await saveProgress(userId, lessonId, 75); // 75% completado
```

### Obtener lecciones por dificultad

```typescript
import { getLessonsByDifficulty } from '@/services/database';

const leccionesFaciles = await getLessonsByDifficulty('easy');
const leccionesMedias = await getLessonsByDifficulty('medium');
const leccionesDificiles = await getLessonsByDifficulty('hard');
```

---

## 🎨 Usar en un Componente React

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getLessons, Lesson } from '@/services/database';

export default function LessonsList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await getLessons();
      setLessons(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <FlatList
      data={lessons}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

---

## 🔒 Configurar Autenticación (Opcional)

Si quieres añadir login de usuarios:

```typescript
import { auth } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// Registrar usuario
const signup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Iniciar sesión
const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Cerrar sesión
const logout = async () => {
  await signOut(auth);
};
```

---

## 📱 Reglas de Seguridad de Firestore

Actualmente tu base de datos está en modo de prueba. Para producción, configura reglas en Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos
    match /lessons/{lesson} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Solo usuarios autenticados pueden ver su progreso
    match /progress/{progress} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // Solo usuarios pueden ver/editar su propio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Próximos Pasos

1. **Crear más lecciones** desde la app o Firebase Console
2. **Implementar sistema de usuarios** con autenticación
3. **Añadir imágenes** usando Firebase Storage
4. **Crear dashboard** de estadísticas
5. **Implementar notificaciones** push

---

## 🆘 Solución de Problemas

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Solución:** Asegúrate de que `config/firebase.ts` se importa antes de usar cualquier servicio.

### Error: "Missing or insufficient permissions"

**Solución:** Ve a Firebase Console > Firestore > Rules y configura permisos de lectura/escritura.

### Error de red / timeout

**Solución:** Verifica tu conexión a internet y que el proyecto Firebase esté activo.

---

## 📖 Recursos Adicionales

- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [React Native Firebase](https://rnfirebase.io/)

---

**¿Necesitas ayuda?** Revisa los ejemplos en `components/FirebaseTest.tsx` o consulta la documentación oficial de Firebase.

✅ **Firebase está listo para usar en tu aplicación EduPlay!** 🎉