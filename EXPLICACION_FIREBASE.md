# 📚 Explicación: Firebase Authentication vs Firestore Database

## 🔐 Firebase Authentication

**¿Qué es?**
- Sistema de autenticación de usuarios
- Maneja el **login y registro** de forma segura
- Guarda contraseñas encriptadas

**¿Qué guarda?**
```javascript
{
  uid: "F06dnPedOpUjT0CMfVmr8wy...",  // ID único del usuario
  email: "alexis@gmail.com",
  emailVerified: false,
  // Contraseña (encriptada, no la ves)
}
```

**¿Para qué sirve?**
- ✅ Verificar que el usuario ingrese el email y contraseña correctos
- ✅ Generar un UID único para cada usuario
- ✅ Manejar sesiones (quién está logueado)
- ❌ **NO** guarda información adicional (nombre, rol, progreso, etc.)

---

## 📊 Firestore Database

**¿Qué es?**
- Base de datos NoSQL (como MongoDB)
- Guarda **toda la información** de tu aplicación
- Organizada en **colecciones** y **documentos**

**Estructura en tu app:**
```
firestore/
├── users/                    (Colección de usuarios)
│   ├── F06dnPedOpUjT0CMfVmr... (Documento con UID de Authentication)
│   │   ├── nombre: "Gustavo Nava"
│   │   ├── email: "gustavo@correo.com"
│   │   ├── roleId: "SL1eExqj8tab..."  ← ID del documento en 'roles'
│   │   ├── progress: 0
│   │   └── accessibilityPreferences: {...}
│   │
│   └── otro-uid-de-usuario/
│       └── ...
│
├── roles/                    (Colección de roles)
│   ├── SL1eExqj8tab...      (Documento de rol Alumno)
│   │   ├── nombre: "Alumno"
│   │   ├── descripcion: "Estudiante"
│   │   └── permissions: [...]
│   │
│   └── otro-id-de-rol/
│       └── ...
│
├── lessons/                  (Colección de lecciones)
│   └── ...
│
└── progress/                 (Colección de progreso)
    └── ...
```

**¿Para qué sirve?**
- ✅ Guardar información del usuario (nombre, rol, progreso)
- ✅ Guardar lecciones, actividades, etc.
- ✅ Relacionar usuarios con roles usando `roleId`
- ✅ Consultar y filtrar datos

---

## 🔗 Cómo se Relacionan

### Flujo de Registro:

```javascript
// 1. Crear usuario en Authentication
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const userId = userCredential.user.uid;  // ← UID único generado

// 2. Guardar información adicional en Firestore
await setDoc(doc(db, 'users', userId), {  // ← Usar el UID como ID del documento
  name: "Gustavo Nava",
  email: "gustavo@correo.com",
  roleId: "SL1eExqj8tab...",  // ← ID del documento de rol en la colección 'roles'
  progress: 0
});
```

**Resultado:**

**En Authentication:**
```
UID: F06dnPedOpUjT0CMfVmr8wy...
Email: gustavo@correo.com
Password: ••••••• (encriptada)
```

**En Firestore - Colección `users`:**
```javascript
// Documento con ID = F06dnPedOpUjT0CMfVmr8wy...
{
  nombre: "Gustavo Nava",
  email: "gustavo@correo.com",
  roleId: "SL1eExqj8tab...",  // ← Apunta al documento en 'roles'
  progreso: {
    actividadesCompletadas: 0,
    nivelActual: "Inicial",
    promedioGeneral: 0
  },
  rol: "alumno"  // ← Este campo NO debería existir (es redundante)
}
```

**En Firestore - Colección `roles`:**
```javascript
// Documento con ID = SL1eExqj8tab...
{
  nombre: "Alumno",
  descripcion: "Estudiante",
  value: "student",
  permissions: ["view_lessons", "complete_activities"]
}
```

---

## ❌ Error Común que Tenías

### Antes (Incorrecto):
```javascript
{
  nombre: "Gustavo Nava",
  rol: "alumno"  // ❌ Guardando el valor del rol directamente
}
```

**Problema:**
- No puedes obtener el nombre del rol ("Alumno") desde "alumno"
- No puedes obtener los permisos del rol
- Si cambias el nombre del rol en la colección `roles`, no se actualiza aquí

### Ahora (Correcto):
```javascript
{
  nombre: "Gustavo Nava",
  roleId: "SL1eExqj8tab..."  // ✅ Guardando el ID del documento en 'roles'
}
```

**Ventajas:**
- Puedes hacer una consulta a `roles/SL1eExqj8tab...` para obtener toda la info del rol
- Si actualizas el rol en la colección `roles`, todos los usuarios se actualizan automáticamente
- Puedes obtener: nombre ("Alumno"), descripción, permisos, etc.

---

## 📝 Cómo Obtener el Nombre del Rol

### Código para obtener el usuario completo con su rol:

```javascript
import { getUser } from '@/services/database';
import { getRole } from '@/services/database';

// 1. Obtener datos del usuario
const userId = auth.currentUser.uid;
const userData = await getUser(userId);

console.log('Usuario:', userData.name);  // "Gustavo Nava"
console.log('Role ID:', userData.roleId); // "SL1eExqj8tab..."

// 2. Obtener datos del rol
const roleData = await getRole(userData.roleId);

console.log('Nombre del rol:', roleData.name);  // "Alumno"
console.log('Descripción:', roleData.description);  // "Estudiante"
console.log('Permisos:', roleData.permissions);  // ["view_lessons", ...]
```

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Authentication                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UID: F06dnPedOpUjT0CMfVmr8wy...                     │  │
│  │  Email: gustavo@correo.com                           │  │
│  │  Password: ••••••• (encriptada)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                                                    │
│         │ (Genera UID único)                                │
│         ▼                                                    │
└─────────────────────────────────────────────────────────────┘
         │
         │ (Usamos el UID como ID del documento)
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firestore Database                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Colección: users                                    │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Documento ID: F06dnPedOpUjT0CMfVmr8wy...       │ │  │
│  │  │                                                 │ │  │
│  │  │  nombre: "Gustavo Nava"                        │ │  │
│  │  │  email: "gustavo@correo.com"                   │ │  │
│  │  │  roleId: "SL1eExqj8tab..." ──────┐            │ │  │
│  │  │  progress: 0                      │            │ │  │
│  │  └───────────────────────────────────┼────────────┘ │  │
│  └────────────────────────────────────┼──────────────┘  │
│                                        │                 │
│  ┌────────────────────────────────────┼──────────────┐  │
│  │  Colección: roles                  │              │  │
│  │  ┌────────────────────────────────▼──────────┐   │  │
│  │  │ Documento ID: SL1eExqj8tab...            │   │  │
│  │  │                                           │   │  │
│  │  │  nombre: "Alumno"                        │   │  │
│  │  │  descripcion: "Estudiante"               │   │  │
│  │  │  permissions: ["view_lessons", ...]      │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de lo Corregido

- [x] **createUser ahora usa el UID como ID del documento**
  - Antes: Auto-generaba un ID diferente
  - Ahora: Usa el mismo UID de Authentication

- [x] **Se guarda el `roleId` correctamente**
  - Antes: Podía guardar "alumno" (string)
  - Ahora: Guarda "SL1eExqj8tab..." (ID del documento)

- [x] **El nombre del rol se muestra en el selector**
  - selectedRole?.name muestra "Alumno" o "Maestro"

- [x] **Logs para depuración**
  - Ver en consola qué roleId se está guardando

---

## 🧪 Cómo Verificar

1. **Registra un nuevo usuario**
2. **Ve a Firebase Console > Authentication**
   - Verás el usuario con su UID y email
3. **Ve a Firebase Console > Firestore Database > users**
   - Busca el documento con el **mismo UID**
   - Verifica que tenga `roleId: "SL1eExqj8tab..."`
4. **Ve a Firestore Database > roles**
   - Busca el documento con ID `SL1eExqj8tab...`
   - Verifica que tenga `nombre: "Alumno"`

---

**¿Quedó más claro?** 🚀
