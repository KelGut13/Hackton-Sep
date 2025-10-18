# 🎭 Sistema de Roles - EduPlay

## 📋 Descripción General

El sistema de roles de EduPlay permite gestionar diferentes tipos de usuarios con permisos específicos. Los roles se almacenan en Firebase Firestore y están relacionados con los usuarios mediante un campo `roleId`.

---

## 🏗️ Estructura de Datos

### Colección: `roles`

```typescript
interface Role {
  id: string;              // ID único del rol (generado por Firebase)
  name: string;            // Nombre del rol (ej: "Alumno", "Maestro")
  value: string;           // Valor interno (ej: "student", "teacher")
  description: string;     // Descripción del rol
  permissions: string[];   // Lista de permisos del rol
  createdAt: Date;        // Fecha de creación
}
```

### Colección: `users`

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;         // ⭐ Referencia al ID del rol
  createdAt: Date;
  progress: number;
  accessibilityPreferences: {...};
}
```

---

## 🎯 Roles Por Defecto

### 1. Alumno (student)
- **Nombre**: Alumno
- **Value**: student
- **Descripción**: Usuario que realiza actividades y aprende
- **Permisos**:
  - `view_lessons` - Ver lecciones
  - `complete_activities` - Completar actividades
  - `view_progress` - Ver su propio progreso

### 2. Maestro (teacher)
- **Nombre**: Maestro
- **Value**: teacher
- **Descripción**: Usuario que crea y gestiona lecciones
- **Permisos**:
  - `view_lessons` - Ver lecciones
  - `create_lessons` - Crear lecciones
  - `edit_lessons` - Editar lecciones
  - `view_student_progress` - Ver progreso de alumnos

---

## 🚀 Inicialización

### Opción 1: Desde la App (Recomendado)

1. Importa el componente `InitRoles`:
```tsx
import InitRoles from '@/components/InitRoles';

// Usa el componente en una pantalla temporal
export default function SetupScreen() {
  return <InitRoles />;
}
```

2. Ejecuta la app y presiona el botón "Inicializar Roles"
3. Los roles se crearán automáticamente en Firebase

### Opción 2: Script de Node.js

```bash
# Ejecutar el script una sola vez
npx tsx scripts/init-roles.ts
```

---

## 💻 Uso en el Código

### Obtener todos los roles

```typescript
import { getRoles } from '@/services/database';

const loadRoles = async () => {
  try {
    const roles = await getRoles();
    console.log('Roles disponibles:', roles);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Obtener un rol específico

```typescript
import { getRole } from '@/services/database';

const getUserRole = async (roleId: string) => {
  try {
    const role = await getRole(roleId);
    if (role) {
      console.log('Rol:', role.name);
      console.log('Permisos:', role.permissions);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Verificar permisos de un usuario

```typescript
import { getUser, getRole } from '@/services/database';

const checkUserPermission = async (userId: string, permission: string): Promise<boolean> => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) return false;
    
    const role = await getRole(user.roleId);
    if (!role) return false;
    
    return role.permissions?.includes(permission) || false;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// Uso:
const canCreateLessons = await checkUserPermission(userId, 'create_lessons');
```

### Obtener información completa del usuario con rol

```typescript
import { getUser, getRole } from '@/services/database';

const getUserWithRole = async (userId: string) => {
  try {
    const user = await getUser(userId);
    if (!user || !user.roleId) {
      throw new Error('Usuario no encontrado');
    }
    
    const role = await getRole(user.roleId);
    
    return {
      ...user,
      role: role
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## 🔐 Registro de Usuarios

El formulario de registro ahora:

1. **Carga los roles desde Firebase** al iniciar
2. **Muestra los roles disponibles** en un modal
3. **Guarda el roleId** cuando el usuario se registra

### Flujo de Registro:

```
1. Usuario llena el formulario
   ↓
2. Usuario selecciona un rol del modal
   ↓
3. Se crea el usuario en Firebase Auth
   ↓
4. Se guarda el usuario en Firestore con el roleId
   ↓
5. Usuario ingresa a la app con su rol asignado
```

---

## 📱 Componentes Actualizados

### `app/(auth)/register.tsx`

**Cambios principales:**
- Importa `getRoles` y tipo `Role` desde `@/services/database`
- Estado `selectedRole: Role | null` en lugar de `role: string`
- Estado `roles: Role[]` cargado desde Firebase
- Estado `loadingRoles` para mostrar carga de roles
- `useEffect` que carga roles al montar el componente
- Modal actualizado para mostrar nombre y descripción del rol
- Indicador visual del rol seleccionado

---

## 🔧 Funciones Disponibles

### En `services/database.ts`:

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `getRoles()` | Obtiene todos los roles | `Promise<Role[]>` |
| `getRole(roleId)` | Obtiene un rol por ID | `Promise<Role \| null>` |
| `createRole(roleData)` | Crea un nuevo rol | `Promise<string>` |
| `initializeDefaultRoles()` | Inicializa roles por defecto | `Promise<void>` |

---

## 🎨 Interfaz de Usuario

### Modal de Selección de Roles

- Muestra **nombre del rol** en grande
- Muestra **descripción** del rol debajo
- **Resalta el rol seleccionado** con color verde
- **Indicador de carga** mientras se obtienen los roles
- **Mensaje de error** si no hay roles disponibles

### Selector de Rol

- Muestra el **nombre del rol seleccionado**
- **ActivityIndicator** mientras cargan los roles
- **Deshabilitado** hasta que los roles se carguen
- **Accesibilidad** completa con hints y labels

---

## 🔄 Migración de Datos Existentes

Si ya tienes usuarios con el campo `role: string`, necesitas migrarlos:

```typescript
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getRoles } from '@/services/database';

const migrateUsersToRoleId = async () => {
  try {
    // 1. Obtener todos los roles
    const roles = await getRoles();
    const studentRole = roles.find(r => r.value === 'student');
    const teacherRole = roles.find(r => r.value === 'teacher');
    
    if (!studentRole || !teacherRole) {
      throw new Error('Roles no inicializados');
    }
    
    // 2. Obtener todos los usuarios
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    // 3. Actualizar cada usuario
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      let roleId = studentRole.id; // Por defecto alumno
      
      if (userData.role === 'teacher') {
        roleId = teacherRole.id!;
      }
      
      await updateDoc(doc(db, 'users', userDoc.id), {
        roleId: roleId,
        // Opcionalmente eliminar el campo viejo
        // role: deleteField()
      });
    }
    
    console.log('✅ Migración completada');
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
};
```

---

## 🛡️ Reglas de Seguridad Firestore

Actualiza las reglas para proteger la colección de roles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Roles: todos pueden leer, solo admins pueden escribir
    match /roles/{roleId} {
      allow read: if request.auth != null;
      allow write: if false; // Solo crear/editar manualmente o por Cloud Functions
    }
    
    // Usuarios
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      // No permitir que el usuario cambie su propio roleId
                      request.resource.data.roleId == resource.data.roleId;
    }
    
    // Lecciones: verificar permisos por rol
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      hasPermission('create_lessons', request.auth.uid);
    }
  }
}

// Función helper (necesita Cloud Functions para funcionar correctamente)
function hasPermission(permission, userId) {
  let user = get(/databases/$(database)/documents/users/$(userId));
  let role = get(/databases/$(database)/documents/roles/$(user.data.roleId));
  return permission in role.data.permissions;
}
```

---

## ✅ Ventajas del Sistema

1. **Escalabilidad**: Fácil agregar nuevos roles sin cambiar código
2. **Flexibilidad**: Permisos granulares por rol
3. **Mantenibilidad**: Cambios en roles afectan a todos los usuarios
4. **Seguridad**: Roles protegidos en Firestore
5. **UX**: Descripción clara de cada rol para el usuario

---

## 📝 Próximos Pasos

1. ✅ Crear roles por defecto en Firebase
2. ✅ Probar el registro con selección de roles
3. ⏳ Implementar verificación de permisos en la app
4. ⏳ Crear pantalla de perfil que muestre el rol
5. ⏳ Implementar funcionalidades específicas por rol
6. ⏳ Agregar más roles (administrador, padre, etc.)

---

## 🆘 Troubleshooting

### Error: "No hay roles disponibles"
**Solución**: Ejecuta el script de inicialización o usa el componente `InitRoles`

### Error: "Cannot read property 'id' of null"
**Solución**: Asegúrate de que los roles estén inicializados antes de registrar usuarios

### Usuarios no pueden cambiar de rol
**Solución**: Esto es intencional. Solo administradores deberían poder cambiar roles (implementar en Cloud Functions)

---

**¡El sistema de roles está listo para usar!** 🎉

Ahora los usuarios se registran con un rol seleccionado desde Firebase, y puedes verificar permisos basados en roles.