# 🔧 SOLUCIÓN: Error auth/configuration-not-found

## ❌ Error Completo
```
FirebaseError: Firebase: Error (auth/configuration-not-found)
```

Este error significa que **Firebase Authentication NO está habilitado** en tu proyecto de Firebase.

---

## ✅ SOLUCIÓN PASO A PASO

### 📍 Paso 1: Ir a Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **kidiquo**

---

### 📍 Paso 2: Habilitar Authentication

1. En el menú lateral izquierdo, busca **"Authentication"** (con icono de llave 🔑)
2. Haz clic en **"Authentication"**

3. **Si es la primera vez:**
   - Verás un botón grande que dice **"Comenzar"** o **"Get Started"**
   - Presiona ese botón

4. **Habilitar Email/Password:**
   - Haz clic en la pestaña **"Sign-in method"** (Método de inicio de sesión)
   - Busca **"Correo electrónico/Contraseña"** o **"Email/Password"**
   - Haz clic en el proveedor
   - **Activa** el interruptor que dice "Habilitar"
   - Haz clic en **"Guardar"**

---

### 📍 Paso 3: Verificar que esté Habilitado

Después de habilitar, deberías ver:

✅ **Email/Password** - Estado: **Habilitado** (en verde)

---

### 📍 Paso 4: Probar el Registro

1. **Vuelve a tu app**
2. **Reinicia si es necesario:**
   ```bash
   # Detener servidor (Ctrl+C)
   npm start
   ```

3. **Ve a la pantalla de Registro**
4. **Llena el formulario:**
   - Nombre: Test User
   - Email: test@ejemplo.com
   - Contraseña: 123456
   - Rol: Alumno o Maestro

5. **Presiona "REGISTRARSE"**
6. **Debería funcionar sin errores**

---

## 📸 Guía Visual

### Paso 2.1: Buscar Authentication
```
Firebase Console
├── Descripción general
├── 🔑 Authentication  ← HAZ CLIC AQUÍ
├── Firestore Database
├── Storage
└── ...
```

### Paso 2.2: Habilitar Email/Password
```
Authentication
├── Users (Usuarios)
└── Sign-in method (Método de inicio de sesión)  ← Ve a esta pestaña
    ├── Proveedores nativos:
    │   ├── [✓] Email/Password  ← HABILITA ESTE
    │   ├── [ ] Teléfono
    │   └── ...
```

---

## 🔍 Verificación Completa

### Checklist de Firebase Console:

- [ ] Proyecto **kidiquo** abierto
- [ ] **Authentication** visible en menú lateral
- [ ] Pestaña **"Sign-in method"** seleccionada
- [ ] **Email/Password** habilitado (interruptor en verde)
- [ ] Guardado correctamente

### Checklist en la App:

- [ ] App reiniciada
- [ ] Formulario de registro llenado
- [ ] Botón "REGISTRARSE" presionado
- [ ] ✅ Usuario creado sin errores
- [ ] Navegación a la pantalla principal

---

## 🆘 Otros Errores Posibles

### Error: "Missing or insufficient permissions"

**Solución:** Configura las reglas de Firestore (ver `CONFIGURAR_FIREBASE_REGLAS.md`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

### Error: "Email already in use"

**Causa:** Ya registraste ese correo antes

**Solución:**
1. Usa otro correo: test2@ejemplo.com
2. O elimina el usuario en Firebase Console > Authentication > Users

---

### Error: "Weak password"

**Causa:** Contraseña muy corta

**Solución:** Usa al menos 6 caracteres

---

## 📋 Resumen Rápido

```bash
# 1. Firebase Console
#    - Ir a Authentication
#    - Habilitar Email/Password
#    - Guardar

# 2. Reiniciar app
Ctrl + C  # Detener
npm start # Iniciar

# 3. Probar registro
#    - Llenar formulario
#    - Registrarse
#    - ✅ Éxito
```

---

## 🎯 Estado Esperado

### Firebase Console - Authentication:
```
Sign-in method
✅ Email/Password - Habilitado
```

### Tu App - Registro:
```
1. Usuario llena formulario
2. Presiona "REGISTRARSE"
3. ✅ Usuario creado en Firebase Auth
4. ✅ Datos guardados en Firestore
5. ✅ Navegación a /(tabs)
```

---

## 📞 Siguiente Paso

Una vez habilitado Authentication:

1. ✅ Probar registro de usuario
2. ✅ Verificar usuario en Firebase Console > Authentication > Users
3. ✅ Verificar datos en Firestore Database > users

---

**¿Ya habilitaste Authentication en Firebase Console?** 

Si sigues viendo errores después de habilitarlo, comparte el nuevo mensaje de error. 🚀
