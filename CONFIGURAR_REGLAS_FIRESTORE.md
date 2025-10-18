# 🔒 REGLAS DE SEGURIDAD DE FIRESTORE - EDUPLAY

## ⚠️ IMPORTANTE

Firebase te muestra esta advertencia:
> "Tus reglas de seguridad están definidas como públicas, por lo que cualquiera puede robar, modificar o borrar información de tu base de datos"

**Esto es normal durante desarrollo**, pero necesitas reglas de seguridad adecuadas para producción.

---

## 🚀 Reglas para DESARROLLO (Temporales)

Usa estas reglas mientras desarrollas y pruebas la app:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ DESARROLLO: Permite todo temporalmente
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**✅ Ventajas:**
- Fácil de probar
- No te bloquea mientras desarrollas

**❌ Desventajas:**
- Cualquiera con tu API key puede acceder
- NO usar en producción

---

## 🔒 Reglas para PRODUCCIÓN (Seguras)

Usa estas reglas cuando publiques tu app:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==================== USUARIOS ====================
    match /users/{userId} {
      // Leer: Solo el mismo usuario puede leer su información
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Crear: Solo usuarios autenticados pueden crear su propio documento
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Actualizar: Solo el mismo usuario puede actualizar su información
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Eliminar: Solo el mismo usuario puede eliminar su información
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // ==================== ROLES ====================
    match /roles/{roleId} {
      // Leer: Todos los usuarios autenticados pueden leer roles
      allow read: if request.auth != null;
      
      // Crear/Actualizar/Eliminar: Solo administradores (agregar lógica de admin)
      allow write: if false; // Por ahora, solo desde Firebase Console
    }
    
    // ==================== LECCIONES ====================
    match /lessons/{lessonId} {
      // Leer: Todos los usuarios autenticados
      allow read: if request.auth != null;
      
      // Crear/Actualizar: Solo maestros (necesitas verificar rol)
      allow create, update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roleId in [
          'maestro-role-id'  // Reemplazar con ID real del rol maestro
        ];
      
      // Eliminar: Solo el creador de la lección
      allow delete: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
    }
    
    // ==================== PROGRESO ====================
    match /progress/{progressId} {
      // Leer: Solo el usuario dueño del progreso
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      // Crear: Solo el usuario puede crear su propio progreso
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      
      // Actualizar: Solo el usuario dueño
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      // Eliminar: Solo el usuario dueño
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🎯 Reglas INTERMEDIAS (Recomendadas para ti AHORA)

Estas reglas son más seguras pero aún permiten desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==================== USUARIOS ====================
    match /users/{userId} {
      // Leer: Solo usuarios autenticados pueden leer cualquier usuario
      allow read: if request.auth != null;
      
      // Escribir: Solo el mismo usuario o al crear cuenta
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // ==================== ROLES ====================
    match /roles/{roleId} {
      // IMPORTANTE: Todos pueden LEER roles (necesario para el registro)
      allow read: if true;  // ← Esto permite que el registro funcione
      
      // Solo crear/modificar desde Firebase Console
      allow write: if false;
    }
    
    // ==================== LECCIONES ====================
    match /lessons/{lessonId} {
      // Todos los autenticados pueden leer
      allow read: if request.auth != null;
      
      // Todos los autenticados pueden crear/actualizar (por ahora)
      allow write: if request.auth != null;
    }
    
    // ==================== PROGRESO ====================
    match /progress/{progressId} {
      // Leer/Escribir solo si está autenticado
      allow read, write: if request.auth != null;
    }
  }
}
```

**📌 Esta es mi recomendación para ti AHORA**

---

## 🛠️ Cómo Aplicar las Reglas

### Paso 1: Ir a Firebase Console
1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto: **kidiquo**

### Paso 2: Abrir Firestore Rules
1. En el menú lateral: **Firestore Database**
2. Pestaña: **Reglas** (Rules)

### Paso 3: Copiar las Reglas
- Copia las **Reglas INTERMEDIAS** (las recomendadas)
- Pega en el editor de Firebase

### Paso 4: Publicar
1. Presiona **"Publicar"** (Publish)
2. Espera confirmación

---

## 🧪 Probar que Funcionan

Después de publicar las reglas:

1. **Reinicia tu app** (Ctrl+C y `npm start`)
2. **Ve a Registro**
3. **Los logs deberían mostrar:**
   ```
   ✅ API getRoles(): Respuesta de Firebase recibida
   📊 Cantidad de documentos encontrados: 2
   ```

4. **El selector de roles debería mostrar:**
   - Alumno
   - Maestro

---

## 🔍 Solución de Problemas

### Si los roles AÚN no aparecen después de cambiar reglas:

```bash
# 1. Detener el servidor
Ctrl + C

# 2. Limpiar caché
npx expo start --clear

# 3. Abrir la app de nuevo
```

### Si ves error de permisos:

```
❌ API getRoles(): ERROR al obtener roles
🔴 Código de error: permission-denied
```

**Solución:** Verifica que las reglas de `roles` tengan:
```javascript
match /roles/{roleId} {
  allow read: if true;  // ← Debe ser "if true" para el registro
}
```

---

## 📝 Notas Importantes

1. **Las reglas NO afectan Firebase Console**
   - Siempre podrás leer/escribir desde Console
   - Solo afectan tu app

2. **Cambios instantáneos**
   - Las nuevas reglas se aplican inmediatamente
   - No necesitas esperar

3. **Debugging de reglas**
   - Firebase Console > Firestore > **Reglas**
   - Pestaña **"Simulador de reglas"** para probar

---

## ✅ Checklist

- [ ] Copiar reglas INTERMEDIAS
- [ ] Pegar en Firebase Console > Firestore > Reglas
- [ ] Presionar "Publicar"
- [ ] Reiniciar app (`npm start`)
- [ ] Ver logs en terminal
- [ ] Verificar que roles aparezcan en selector

---

## 🎯 Siguiente Paso

**Por favor:**

1. **Copia las Reglas INTERMEDIAS** de este documento
2. **Pégalas en Firebase Console**
3. **Presiona "Publicar"**
4. **Reinicia la app**
5. **Comparte los logs** que aparezcan en la terminal

Con eso, los roles **DEBERÍAN aparecer** 🚀

---

## 🆘 Si Aún No Funciona

Si después de cambiar las reglas los roles SIGUEN sin aparecer, el problema puede ser:

1. **Caché del navegador/app** → Limpia con `npx expo start --clear`
2. **Firebase no actualizado** → Espera 30 segundos
3. **Error en el código** → Los logs te dirán cuál es

**¡Prueba esto y cuéntame qué pasa!** 🔍
