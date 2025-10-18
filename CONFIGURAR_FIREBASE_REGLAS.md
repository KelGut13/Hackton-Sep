# 🔧 Configurar Reglas de Seguridad en Firebase

## ⚠️ ERROR: Missing or insufficient permissions

Si ves este error, significa que las **reglas de seguridad de Firestore** están bloqueando el acceso.

---

## 🚀 Solución Rápida (Desarrollo)

### Paso 1: Ir a Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **kidiquo**
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Reglas** (Rules)

### Paso 2: Configurar Reglas de Desarrollo

**⚠️ IMPORTANTE: Estas reglas son SOLO para desarrollo. NO usar en producción.**

Copia y pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // REGLAS DE DESARROLLO - Permitir todo mientras desarrollamos
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 3: Publicar las Reglas

1. Haz clic en el botón **"Publicar"** o **"Publish"**
2. Espera unos segundos
3. Deberías ver un mensaje de éxito

### Paso 4: Probar la App

1. Reinicia tu app (detener y volver a ejecutar `npm start`)
2. Ve a la pestaña **Firebase** en la app
3. Presiona **"Inicializar Roles"**
4. Deberías ver: ✅ Roles inicializados correctamente

---

## 🔒 Reglas de Seguridad para Producción

Una vez que termines el desarrollo, **DEBES cambiar** las reglas por estas más seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==================== ROLES ====================
    // Todos pueden leer roles (necesario para el registro)
    // Solo administradores pueden escribir (implementar con Cloud Functions)
    match /roles/{roleId} {
      allow read: if true;  // Cualquiera puede ver los roles disponibles
      allow write: if false; // Solo Cloud Functions pueden crear/editar roles
    }
    
    // ==================== USUARIOS ====================
    // Los usuarios pueden leer/escribir solo su propio documento
    match /users/{userId} {
      // Leer: solo el propio usuario
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Crear: cualquier usuario autenticado puede crear su perfil
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Actualizar: solo el propio usuario, pero NO puede cambiar su roleId
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.roleId == resource.data.roleId;
      
      // Eliminar: no permitido
      allow delete: if false;
    }
    
    // ==================== LECCIONES ====================
    match /lessons/{lessonId} {
      // Todos los usuarios autenticados pueden leer lecciones
      allow read: if request.auth != null;
      
      // Solo maestros pueden crear/editar lecciones
      allow create, update: if request.auth != null && 
                              hasTeacherRole(request.auth.uid);
      
      // Solo el creador puede eliminar
      allow delete: if request.auth != null && 
                      resource.data.createdBy == request.auth.uid;
    }
    
    // ==================== PROGRESO ====================
    match /progress/{progressId} {
      // Solo el propio usuario puede ver/editar su progreso
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // ==================== FUNCIONES HELPER ====================
    function hasTeacherRole(userId) {
      let userDoc = get(/databases/$(database)/documents/users/$(userId));
      let roleDoc = get(/databases/$(database)/documents/roles/$(userDoc.data.roleId));
      return roleDoc.data.value == 'teacher';
    }
  }
}
```

---

## 📊 Verificar que Funcionó

### Método 1: En la App

1. Ve a la pestaña **Firebase**
2. Presiona **"Inicializar Roles"**
3. Debería mostrar: ✅ Roles inicializados correctamente

### Método 2: En Firebase Console

1. Ve a **Firestore Database** > **Datos** (Data)
2. Deberías ver la colección **`roles`** con 2 documentos:
   - Alumno (value: student)
   - Maestro (value: teacher)

### Método 3: Registrar un Usuario

1. Ve a la pantalla de **Registro**
2. El selector de roles debería cargar sin errores
3. Deberías poder seleccionar "Alumno" o "Maestro"
4. Al registrarte, el usuario se crea en Firestore

---

## 🔍 Explicación del Error

```
FirebaseError: Missing or insufficient permissions
```

**¿Por qué ocurre?**

Por defecto, Firestore bloquea TODA lectura/escritura por seguridad. Necesitas configurar reglas que especifiquen:
- **Quién** puede acceder a los datos
- **Qué** datos puede leer/escribir
- **Cuándo** puede hacerlo

---

## 🛠️ Troubleshooting

### Error persiste después de cambiar reglas

**Solución:**
1. Espera 1-2 minutos (las reglas tardan en propagarse)
2. Cierra completamente la app
3. Detén el servidor: `Ctrl + C`
4. Reinicia: `npm start`

### No puedo ver la pestaña "Reglas" en Firebase

**Solución:**
1. Ve a **Firestore Database** en el menú lateral
2. Si no existe, haz clic en **"Crear base de datos"**
3. Selecciona **"Modo de prueba"** (Test mode)
4. Elige una ubicación (ej: southamerica-east1)
5. Haz clic en **"Habilitar"**

### Error: "Cannot read property 'id' of null"

**Solución:**
Esto significa que los roles aún no están inicializados:
1. Ve a la pestaña **Firebase** en la app
2. Presiona **"Inicializar Roles"**
3. Espera el mensaje de confirmación
4. Vuelve a intentar el registro

---

## ✅ Checklist de Configuración

- [ ] Firebase Console abierta
- [ ] Proyecto "kidiquo" seleccionado
- [ ] Firestore Database habilitado
- [ ] Reglas de desarrollo configuradas
- [ ] Reglas publicadas
- [ ] App reiniciada
- [ ] Roles inicializados
- [ ] Prueba de registro exitosa

---

## 📝 Pasos Completos (Resumen)

```bash
# 1. Configurar reglas en Firebase Console
#    - Ir a Firestore Database > Reglas
#    - Pegar reglas de desarrollo
#    - Publicar

# 2. Reiniciar la app
Ctrl + C  # Detener servidor
npm start # Iniciar de nuevo

# 3. Inicializar roles
#    - Abrir app
#    - Ir a pestaña "Firebase"
#    - Presionar "Inicializar Roles"

# 4. Probar registro
#    - Ir a pantalla de registro
#    - Seleccionar un rol
#    - Registrarse
```

---

## 🎯 Siguiente Paso

Una vez que las reglas estén configuradas y los roles inicializados:

1. ✅ Probar el registro con ambos roles (Alumno y Maestro)
2. ✅ Verificar en Firestore que los usuarios se crean con `roleId`
3. ✅ Implementar la pantalla de Login
4. ✅ Crear funcionalidades específicas por rol

---

**¿Sigues teniendo problemas?**

Comparte el error exacto y te ayudo a resolverlo paso a paso. 🚀
