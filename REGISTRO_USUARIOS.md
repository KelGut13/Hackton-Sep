# 📝 Sistema de Registro de Usuarios - EduPlay

## ✅ Integración Completa con Firebase

El sistema de registro ahora está **completamente integrado con Firebase** y guarda los datos en Firestore.

---

## 🎯 Funcionalidades Implementadas

### 1. **Validación de Campos**
- ✅ Nombre requerido
- ✅ Email requerido y válido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Rol requerido (Alumno/Maestro)

### 2. **Integración Firebase**
- ✅ Crear usuario en Firebase Authentication
- ✅ Guardar datos adicionales en Firestore
- ✅ Guardar preferencias de accesibilidad

### 3. **Experiencia de Usuario**
- ✅ Indicador de carga durante el registro
- ✅ Mensajes de error personalizados
- ✅ Soporte para lector de pantalla
- ✅ Navegación automática después del registro

---

## 📊 Datos que se Guardan

### En Firebase Authentication:
- Email
- Contraseña (encriptada por Firebase)
- UID único del usuario

### En Firestore (colección `users`):
```typescript
{
  name: string,              // Nombre completo
  email: string,             // Correo electrónico
  createdAt: Date,           // Fecha de registro
  progress: number,          // Progreso inicial (0)
  role: string,              // 'student' o 'teacher'
  accessibilityPreferences: {
    highContrast: boolean,      // Alto contraste
    colorBlindMode: boolean,    // Modo daltónico
    fontSize: string,           // Tamaño de fuente
    screenReaderEnabled: boolean // Lector de pantalla
  }
}
```

---

## 🧪 Cómo Probar

### 1. Ejecutar la App
```bash
npm start
```

### 2. Navegar al Registro
- La ruta debería ser: `/(auth)/register`
- O crea un link desde otra pantalla

### 3. Llenar el Formulario
- **Nombre**: Juan Pérez
- **Email**: juan@ejemplo.com
- **Contraseña**: 123456
- **Rol**: Seleccionar Alumno o Maestro

### 4. Presionar "REGISTRARSE"
- Verás el indicador de carga
- Si todo está bien, serás redirigido a `/(tabs)`
- Si hay error, verás un mensaje descriptivo

### 5. Verificar en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto **kidiquo**
3. Ve a **Authentication** > **Users**
4. Verás el nuevo usuario registrado
5. Ve a **Firestore Database** > **users**
6. Verás los datos adicionales del usuario

---

## 🔒 Mensajes de Error

El sistema maneja estos errores automáticamente:

| Código Error | Mensaje al Usuario |
|-------------|-------------------|
| `auth/email-already-in-use` | Este correo ya está registrado |
| `auth/invalid-email` | El correo electrónico no es válido |
| `auth/weak-password` | La contraseña es muy débil |
| `auth/network-request-failed` | Error de conexión. Verifica tu internet |
| Campo vacío | Por favor ingresa [campo] |
| Contraseña corta | La contraseña debe tener al menos 6 caracteres |

---

## 🎨 Características de Accesibilidad

Las preferencias de accesibilidad del usuario se guardan automáticamente:

- ✅ **Alto Contraste**: Mejora visibilidad
- ✅ **Modo Daltónico**: Colores adaptados
- ✅ **Tamaño de Fuente**: Small, Normal, Large
- ✅ **Lector de Pantalla**: Narración de voz

Estas preferencias se pueden usar más tarde para personalizar la experiencia del usuario.

---

## 💻 Código de Ejemplo

### Verificar si el usuario está autenticado:

```typescript
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuario autenticado:', user.email);
      console.log('UID:', user.uid);
    } else {
      console.log('No hay usuario autenticado');
    }
  });

  return () => unsubscribe();
}, []);
```

### Obtener datos del usuario desde Firestore:

```typescript
import { getUser } from '@/services/database';

const loadUserData = async (userId: string) => {
  try {
    const userData = await getUser(userId);
    console.log('Datos del usuario:', userData);
    console.log('Rol:', userData.role);
    console.log('Progreso:', userData.progress);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Cerrar sesión:

```typescript
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

const logout = async () => {
  try {
    await signOut(auth);
    console.log('Sesión cerrada');
    router.replace('/(auth)/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
```

---

## 🔐 Reglas de Seguridad Recomendadas

Actualiza las reglas de Firestore en Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir su propio documento
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lecciones: todos pueden leer, solo maestros pueden escribir
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Progreso: solo el propio usuario puede ver/editar
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🚀 Próximos Pasos

1. **Crear pantalla de Login** para usuarios existentes
2. **Implementar "Olvidé mi contraseña"**
3. **Añadir verificación de email**
4. **Crear perfil de usuario** editable
5. **Implementar roles y permisos**

---

## 📱 Flujo Completo del Usuario

```
1. Usuario llena formulario de registro
   ↓
2. App valida los campos
   ↓
3. Si válido, crea usuario en Firebase Auth
   ↓
4. Guarda datos adicionales en Firestore
   ↓
5. Usuario es redirigido a la app principal
   ↓
6. Usuario puede usar todas las funcionalidades
```

---

## 🆘 Solución de Problemas

### Error: "Cannot find module '@/config/firebase'"
**Solución**: Asegúrate de que el archivo `config/firebase.ts` existe con las credenciales correctas.

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solución**: Verifica que Firebase Authentication esté habilitado en Firebase Console.

### Error: "Missing or insufficient permissions"
**Solución**: Actualiza las reglas de seguridad en Firestore Console.

### Usuario no aparece en Firestore
**Solución**: Verifica que la función `createUser` se esté llamando correctamente después de crear el usuario en Auth.

---

**¡El sistema de registro está listo y funcional!** 🎉

Ahora los usuarios pueden registrarse y sus datos se guardarán automáticamente en Firebase.