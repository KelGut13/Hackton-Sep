# 🔥 Configuración de Firebase para EduPlay

## 📋 Pasos para configurar Firebase

### 1. Obtener tu configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (o créalo si no existe)
3. Click en el ícono de configuración ⚙️ > **Project settings**
4. En la sección **Your apps**, selecciona tu app web (⚛️ símbolo)
5. Si no tienes una app web, haz click en **Add app** > Web
6. Copia el objeto `firebaseConfig` que aparece

### 2. Configurar las credenciales

Abre el archivo `config/firebase.ts` y reemplaza con tus credenciales:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...", // Tu API Key
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXX" // Opcional
};
```

### 3. Habilitar servicios en Firebase Console

#### Firestore Database:
1. En Firebase Console, ve a **Build** > **Firestore Database**
2. Click en **Create database**
3. Elige **Start in test mode** (para desarrollo)
4. Selecciona la región más cercana
5. Click en **Enable**

#### Authentication:
1. Ve a **Build** > **Authentication**
2. Click en **Get started**
3. En la pestaña **Sign-in method**, habilita:
   - **Email/Password**
   - Cualquier otro método que desees (Google, Facebook, etc.)

#### Storage (opcional):
1. Ve a **Build** > **Storage**
2. Click en **Get started**
3. Acepta las reglas de seguridad
4. Click en **Done**

### 4. Configurar reglas de seguridad

#### Reglas de Firestore (`firestore.rules`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo el dueño puede leer/escribir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lecciones: todos pueden leer, solo admins pueden escribir
    match /lessons/{lessonId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Progreso: solo el dueño puede ver su progreso
    match /progress/{progressId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Reglas de Storage (`storage.rules`):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Uso en tu aplicación

### Importar servicios:
```typescript
import { db, auth, storage } from './config/firebase';
import { getUser, createUser, getLessons } from './services/database';
import { registerUser, loginUser, logoutUser } from './services/auth';
import { useAuth } from './hooks/use-auth';
```

### Ejemplos de uso:

#### 1. Autenticación:
```typescript
// Registrar usuario
const handleRegister = async () => {
  try {
    await registerUser('user@example.com', 'password123', 'Juan Pérez');
    console.log('Usuario registrado exitosamente');
  } catch (error) {
    console.error(error);
  }
};

// Login
const handleLogin = async () => {
  try {
    await loginUser('user@example.com', 'password123');
    console.log('Sesión iniciada');
  } catch (error) {
    console.error(error);
  }
};
```

#### 2. Usar el hook de autenticación:
```typescript
const MyComponent = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return <Text>Cargando...</Text>;
  
  return (
    <View>
      {isAuthenticated ? (
        <Text>Bienvenido, {user?.email}</Text>
      ) : (
        <Text>Por favor inicia sesión</Text>
      )}
    </View>
  );
};
```

#### 3. Obtener datos de Firestore:
```typescript
// Obtener lecciones
const loadLessons = async () => {
  try {
    const lessons = await getLessons();
    console.log(lessons);
  } catch (error) {
    console.error(error);
  }
};

// Crear nueva lección
const addLesson = async () => {
  try {
    const lessonId = await createLesson({
      title: 'Matemáticas Básicas',
      description: 'Aprende sumas y restas',
      content: 'Contenido de la lección...',
      difficulty: 'easy',
      createdAt: new Date()
    });
    console.log('Lección creada:', lessonId);
  } catch (error) {
    console.error(error);
  }
};
```

#### 4. Usar el componente de ejemplo:
```typescript
import { LessonsListExample } from './components/LessonsListExample';

// En tu pantalla:
<LessonsListExample />
```

## 🔐 Seguridad

**IMPORTANTE:** Nunca subas tus credenciales de Firebase a GitHub.

### Opción 1: Usar variables de entorno

1. Instala `expo-constants`:
```bash
npx expo install expo-constants
```

2. Crea un archivo `app.config.js`:
```javascript
export default {
  expo: {
    // ... tu configuración actual
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      // ... otras variables
    }
  }
};
```

3. Usa las variables en `config/firebase.ts`:
```typescript
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  // ...
};
```

### Opción 2: Archivo local no versionado

1. Crea `config/firebase.local.ts` con tus credenciales
2. Añade a `.gitignore`:
```
config/firebase.local.ts
```

3. Importa desde el archivo local en desarrollo

## 📊 Estructura de base de datos sugerida

```
firestore/
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       ├── createdAt: timestamp
│       └── progress: number
│
├── lessons/
│   └── {lessonId}/
│       ├── title: string
│       ├── description: string
│       ├── content: string
│       ├── difficulty: 'easy' | 'medium' | 'hard'
│       └── createdAt: timestamp
│
└── progress/
    └── {progressId}/
        ├── userId: string
        ├── lessonId: string
        ├── progress: number (0-100)
        └── updatedAt: timestamp
```

## 🚀 Próximos pasos

1. Configura tus credenciales en `config/firebase.ts`
2. Prueba la autenticación creando un usuario
3. Crea algunas lecciones de prueba en Firestore
4. Usa el componente `LessonsListExample` para ver los datos
5. Personaliza los servicios según tus necesidades

## 📚 Recursos adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase con React Native](https://rnfirebase.io/)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)

---

¿Necesitas ayuda? Revisa los archivos de ejemplo en:
- `services/database.ts` - Operaciones de base de datos
- `services/auth.ts` - Autenticación
- `components/LessonsListExample.tsx` - Ejemplo de uso