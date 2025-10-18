# 🔍 DIAGNÓSTICO: Roles no aparecen en el selector

## ✅ Estado Actual Confirmado

Según la captura de Firebase Console:
- ✅ **La colección `roles` EXISTE**
- ✅ **Hay al menos 1 rol visible: "Alumno"**
- ✅ **Probablemente hay 2 roles totales**

## ❓ Problema

Los roles **NO aparecen** en el selector de la pantalla de Registro a pesar de existir en Firebase.

---

## 🔍 Posibles Causas

### 1️⃣ **Error de Permisos de Firestore**

**Síntoma:**
- Firebase tiene los roles
- La app no puede leerlos
- Error: `permission-denied`

**Solución:**
```javascript
// Firebase Console > Firestore Database > Reglas
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ← Permitir lectura temporalmente
    }
  }
}
```

**Cómo verificar:**
- Busca en los logs: `🔴 Código de error: permission-denied`

---

### 2️⃣ **Los Roles se Cargan pero NO se Muestran**

**Síntoma:**
- `getRoles()` devuelve los roles correctamente
- `roles.length > 0`
- Pero el selector está vacío

**Posible causa:**
- El estado `roles` no se actualiza en el componente
- Problema de renderizado del modal

**Cómo verificar en logs:**
```
✅ API getRoles(): Respuesta de Firebase recibida
📊 Cantidad de documentos encontrados: 2
📦 API getRoles(): Total de roles procesados: 2

// Pero luego:
👆 Click en selector de rol
📊 Estado actual: { rolesCount: 0 }  ← ⚠️ Esto es el problema
```

**Solución:**
- Verificar que `setRoles(fetchedRoles)` se ejecute
- Agregar log después de `setRoles()`

---

### 3️⃣ **Se Usan Roles Temporales en vez de Firebase**

**Síntoma:**
- Firebase tiene 2 roles
- La app usa roles temporales (temp-student, temp-teacher)
- El código ignora los roles de Firebase

**Cómo verificar:**
```
🔄 Configurando roles temporales: [...]
✅ Roles temporales configurados. Total: 2
```

**Causa:**
- `fetchedRoles` está vacío o es `null`
- Se ejecuta la rama `else` que llama `setRolesTemporales()`

---

### 4️⃣ **Problema con el Tipo de Dato `createdAt`**

**Síntoma:**
- Firebase devuelve `createdAt` como `Timestamp`
- TypeScript espera `Date`
- Error al procesar los roles

**Solución:**
```typescript
const roles = querySnapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date()  // ← Convertir Timestamp
  };
}) as Role[];
```

---

### 5️⃣ **El Modal NO se Abre**

**Síntoma:**
- Roles cargados correctamente
- Al hacer click en el selector, nada pasa
- `showRoleModal` no cambia a `true`

**Cómo verificar:**
```
👆 Click en selector de rol
📊 Estado actual: { rolesCount: 2 }  ← Roles sí están
// Pero el modal no se abre
```

---

## 🧪 Plan de Diagnóstico

### Paso 1: Ver los Logs de la Terminal

Después de abrir la app y ir a Registro, deberías ver:

```bash
# ¿Qué ves?
🌐 API getRoles(): Iniciando llamada a Firebase Firestore...

# Opción A: Éxito
✅ API getRoles(): Respuesta de Firebase recibida
📊 Cantidad de documentos encontrados: 2

# Opción B: Error de permisos
❌ API getRoles(): ERROR al obtener roles
🔴 Código de error: permission-denied

# Opción C: Colección vacía (pero sabemos que no lo está)
📊 Cantidad de documentos encontrados: 0
```

### Paso 2: Hacer Click en el Selector

Al tocar "Seleccionar rol", deberías ver:

```bash
👆 Click en selector de rol
📊 Estado actual: {
  loadingRoles: false,
  rolesCount: ?,  # ← ¿Qué número aparece?
  roles: [...],
  selectedRole: null
}
```

### Paso 3: Verificar Firebase Console

1. **Ve a Firestore Database > rules**
2. **Copia las reglas actuales** y pégalas aquí
3. **Ve a Firestore Database > Data > roles**
4. **Expande AMBOS documentos** y verifica:
   - Primer documento: nombre, value, description
   - Segundo documento: nombre, value, description

---

## 📋 Checklist de Verificación

Marca lo que YA HICISTE:

- [x] Los roles existen en Firebase (confirmado en captura)
- [ ] Las reglas de Firestore permiten lectura
- [ ] Los logs muestran "✅ Respuesta de Firebase recibida"
- [ ] Los logs muestran "📊 Cantidad de documentos: 2"
- [ ] Al hacer click, `rolesCount` es mayor que 0
- [ ] El modal se abre al hacer click
- [ ] El modal muestra los roles

---

## 🎯 Siguiente Paso INMEDIATO

**Por favor, comparte:**

1. **Los logs de la terminal** cuando abres la pantalla de Registro
2. **Los logs cuando haces click** en "Seleccionar rol"
3. **Captura de las reglas** de Firestore (Firebase Console > Firestore > Reglas)

Con esa información sabré EXACTAMENTE cuál es el problema. 🔍

---

## 💡 Solución Rápida (Mientras Espero los Logs)

Si quieres probar algo YA, haz esto:

### Opción 1: Verificar Reglas de Firestore

```javascript
// Firebase Console > Firestore Database > Reglas
// Cambiar a esto TEMPORALMENTE:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

// Presiona "Publicar"
```

### Opción 2: Forzar Recarga

En la app:
1. Cierra completamente la app
2. En la terminal: `Ctrl + C` para detener el servidor
3. `npm start` para reiniciar
4. Abre la app de nuevo
5. Ve a Registro

---

**¿Puedes compartir los logs y las reglas de Firestore?** 🚀
