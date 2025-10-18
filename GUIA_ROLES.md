# 🚀 Guía Rápida: Integración de Roles con Firebase

## ✅ ¿Qué se ha implementado?

Se ha creado un **sistema completo de roles** que relaciona la tabla de roles de Firebase con el registro de usuarios.

### Cambios Realizados:

1. ✅ **Nueva colección `roles` en Firestore**
2. ✅ **Interface `Role` en `services/database.ts`**
3. ✅ **Funciones CRUD para roles**
4. ✅ **Campo `roleId` en usuarios** (reemplaza `role: string`)
5. ✅ **Registro actualizado** para cargar roles desde Firebase
6. ✅ **Componente de inicialización de roles**
7. ✅ **Servicio de permisos**
8. ✅ **Hook personalizado `useUserRole`**

---

## 📝 Pasos para Usar el Sistema

### **Paso 1: Inicializar Roles en Firebase** 🔧

Antes de poder registrar usuarios, debes crear los roles en Firebase. Tienes 2 opciones:

#### **Opción A: Desde la App (Más Fácil)**

1. Abre el archivo que quieras usar temporalmente (ej: `app/(tabs)/explore.tsx`)

2. Importa y usa el componente `InitRoles`:

```tsx
import InitRoles from '@/components/InitRoles';

export default function ExploreScreen() {
  return <InitRoles />;
}
```

3. Inicia la app:
```bash
npm start
```

4. Ve a la pantalla donde pusiste el componente

5. Presiona el botón **"Inicializar Roles"**

6. Verás un mensaje de éxito: ✅ Roles inicializados

7. **¡Listo!** Ahora puedes eliminar el componente `InitRoles` del código

#### **Opción B: Verificar en Firebase Console**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **kidiquo**
3. Ve a **Firestore Database**
4. Deberías ver la colección **`roles`** con 2 documentos:
   - **Alumno** (value: student)
   - **Maestro** (value: teacher)

---

### **Paso 2: Probar el Registro** 📱

Una vez inicializados los roles:

1. Inicia la app:
```bash
npm start
```

2. Ve a la pantalla de registro: `/(auth)/register`

3. Llena el formulario:
   - **Nombre**: Juan Pérez
   - **Email**: juan@prueba.com
   - **Contraseña**: 123456

4. **Toca el selector de rol**:
   - Verás un modal con los roles disponibles
   - Cada rol muestra su **nombre** y **descripción**
   - Selecciona "Alumno" o "Maestro"

5. Presiona **"REGISTRARSE"**

6. El usuario se creará con el `roleId` correspondiente

---

### **Paso 3: Verificar en Firebase** ✅

1. Ve a **Firebase Console** > **Firestore Database**

2. Busca la colección **`users`**

3. Encuentra el usuario que acabas de crear

4. Verifica que tenga el campo **`roleId`** con el ID del rol seleccionado

5. Copia el `roleId` y búscalo en la colección **`roles`** para confirmar que coincide

---

## 💻 Uso en el Código

### **Opción 1: Hook `useUserRole` (Recomendado para Componentes)**

```tsx
import { useUserRole } from '@/hooks/use-user-role';
import { PERMISSIONS } from '@/services/permissions';

export default function LessonScreen() {
  const { role, loading, hasPermission, isTeacher } = useUserRole();

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View>
      <Text>Tu rol: {role?.name}</Text>
      
      {hasPermission(PERMISSIONS.CREATE_LESSONS) && (
        <Button title="Crear Lección" onPress={createLesson} />
      )}
      
      {isTeacher && (
        <Text>Funcionalidades para maestros</Text>
      )}
    </View>
  );
}
```

### **Opción 2: Servicio de Permisos (Para Lógica Asíncrona)**

```tsx
import { hasPermission, hasRole, PERMISSIONS, ROLES } from '@/services/permissions';
import { auth } from '@/config/firebase';

// Verificar permiso
const checkIfCanCreate = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  
  const canCreate = await hasPermission(userId, PERMISSIONS.CREATE_LESSONS);
  if (canCreate) {
    console.log('Usuario puede crear lecciones');
  }
};

// Verificar rol
const checkIfTeacher = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  
  const isTeacher = await hasRole(userId, ROLES.TEACHER);
  if (isTeacher) {
    console.log('Usuario es maestro');
  }
};
```

### **Opción 3: Obtener Información del Rol**

```tsx
import { getUser, getRole } from '@/services/database';
import { auth } from '@/config/firebase';

const showUserInfo = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  
  const user = await getUser(userId);
  if (user && user.roleId) {
    const role = await getRole(user.roleId);
    console.log('Rol:', role?.name);
    console.log('Permisos:', role?.permissions);
  }
};
```

---

## 🎯 Permisos Disponibles

### Alumno (student):
- ✅ `view_lessons` - Ver lecciones
- ✅ `complete_activities` - Completar actividades
- ✅ `view_progress` - Ver su progreso

### Maestro (teacher):
- ✅ `view_lessons` - Ver lecciones
- ✅ `create_lessons` - Crear lecciones
- ✅ `edit_lessons` - Editar lecciones
- ✅ `view_student_progress` - Ver progreso de alumnos

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos:
- ✅ `services/permissions.ts` - Servicio de verificación de permisos
- ✅ `hooks/use-user-role.ts` - Hook para usar roles en componentes
- ✅ `components/InitRoles.tsx` - Componente para inicializar roles
- ✅ `scripts/init-roles.ts` - Script para inicializar roles
- ✅ `SISTEMA_ROLES.md` - Documentación completa del sistema

### Archivos Modificados:
- ✅ `services/database.ts`:
  - Interface `User` ahora tiene `roleId?: string`
  - Nueva interface `Role`
  - Funciones: `getRoles()`, `getRole()`, `createRole()`, `initializeDefaultRoles()`

- ✅ `app/(auth)/register.tsx`:
  - Carga roles desde Firebase
  - Estado `selectedRole: Role | null`
  - Modal actualizado con descripción de roles
  - Guarda `roleId` en lugar de `role: string`

---

## 🔄 Flujo Completo

```
1. Inicializar roles (UNA SOLA VEZ)
   ├─ Usar componente InitRoles
   └─ O ejecutar script init-roles.ts
   ↓
2. Usuario se registra
   ├─ Llena formulario
   ├─ Selecciona rol del modal
   └─ roleId se guarda en Firestore
   ↓
3. Usuario usa la app
   ├─ useUserRole() obtiene su rol
   ├─ Componentes verifican permisos
   └─ Funcionalidades se muestran según rol
```

---

## 🎨 Ejemplo Completo: Pantalla Condicional por Rol

```tsx
import { useUserRole } from '@/hooks/use-user-role';
import { View, Text, Button, ActivityIndicator } from 'react-native';

export default function DashboardScreen() {
  const { role, loading, isStudent, isTeacher, hasPermission } = useUserRole();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando tu perfil...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Bienvenido, {role?.name}
      </Text>

      {/* Sección para Alumnos */}
      {isStudent && (
        <View>
          <Text>📚 Mis Lecciones</Text>
          <Button title="Ver Mi Progreso" onPress={() => {}} />
          <Button title="Actividades Pendientes" onPress={() => {}} />
        </View>
      )}

      {/* Sección para Maestros */}
      {isTeacher && (
        <View>
          <Text>👨‍🏫 Panel de Maestro</Text>
          <Button title="Crear Nueva Lección" onPress={() => {}} />
          <Button title="Ver Progreso de Alumnos" onPress={() => {}} />
          <Button title="Gestionar Lecciones" onPress={() => {}} />
        </View>
      )}

      {/* Funcionalidad condicional por permiso */}
      {hasPermission('edit_lessons') && (
        <Button title="Editar Lecciones" onPress={() => {}} />
      )}
    </View>
  );
}
```

---

## ⚠️ Notas Importantes

1. **Inicializa los roles ANTES** de registrar el primer usuario
2. **Los roles solo se crean UNA VEZ** (la función verifica si ya existen)
3. **El roleId es requerido** para el registro (el formulario lo valida)
4. **No puedes cambiar tu propio rol** (por seguridad)
5. **Los permisos se verifican en el cliente**, pero debes también verificarlos en el servidor

---

## 🔐 Próximos Pasos Recomendados

1. ✅ **Actualizar Reglas de Firestore** (ver `SISTEMA_ROLES.md`)
2. ⏳ Implementar pantalla de **Login**
3. ⏳ Crear **Dashboard** diferente por rol
4. ⏳ Añadir más roles (administrador, padre)
5. ⏳ Implementar **Cloud Functions** para gestión de roles

---

## 📞 Resumen Rápido

```bash
# 1. Inicializar roles
npm start
# Ir a pantalla con InitRoles y presionar el botón

# 2. Registrar usuario
# Llenar formulario > Seleccionar rol > Registrarse

# 3. Usar en código
import { useUserRole } from '@/hooks/use-user-role';
const { role, hasPermission, isTeacher } = useUserRole();
```

---

**¡El sistema de roles está completamente funcional!** 🎉

Los datos del formulario de registro ahora se relacionan correctamente con la tabla de roles en Firebase.