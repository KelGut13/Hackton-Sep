# ⚠️ SOLUCIÓN AL ERROR: Missing or insufficient permissions

## 🎯 Problema
Al intentar registrar un usuario, aparece el error:
```
FirebaseError: Missing or insufficient permissions
```

---

## ✅ SOLUCIÓN PASO A PASO

### 📍 Paso 1: Configurar Reglas de Firestore (5 minutos)

1. **Abrir Firebase Console**
   - Ve a: https://console.firebase.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Seleccionar tu proyecto**
   - Busca y selecciona el proyecto: **kidiquo**

3. **Ir a Firestore Database**
   - En el menú lateral izquierdo, haz clic en **"Firestore Database"**
   - Si no existe, haz clic en **"Crear base de datos"** y selecciona **"Modo de prueba"**

4. **Abrir las Reglas**
   - Haz clic en la pestaña **"Reglas"** (en la parte superior)

5. **Pegar las Reglas de Desarrollo**
   
   Borra todo el contenido y pega esto:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // SOLO PARA DESARROLLO - Permitir todo
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

6. **Publicar las Reglas**
   - Haz clic en el botón **"Publicar"** (arriba a la derecha)
   - Espera el mensaje de confirmación

---

### 📍 Paso 2: Inicializar Roles en Firebase (2 minutos)

1. **Abrir la App**
   ```bash
   npm start
   ```

2. **Ir a la pestaña Firebase**
   - En la app, navega a la pestaña **"Firebase"** (última pestaña)

3. **Ver el Diagnóstico**
   - Automáticamente verás el diagnóstico de conexión
   - Debería mostrar ✅ en "Configuración Firebase" y "Conexión Firestore"
   - Probablemente mostrará ⚠️ en "Colección Roles" (está vacía)

4. **Cambiar a la pestaña "Inicializar Roles"**
   - Presiona la pestaña **"🔧 Inicializar Roles"**

5. **Presionar el botón**
   - Presiona **"Inicializar Roles"**
   - Espera unos segundos
   - Deberías ver: ✅ Roles inicializados

---

### 📍 Paso 3: Verificar que Funcionó

1. **Volver a Diagnóstico**
   - Presiona la pestaña **"🔍 Diagnóstico"**
   - Presiona **"🔄 Ejecutar Diagnóstico"**
   - Ahora debería mostrar: ✅ 2 rol(es) encontrado(s): Alumno, Maestro

2. **Probar el Registro**
   - Ve a la pantalla de **Registro**
   - Llena el formulario
   - Presiona el selector de **"ROL"**
   - Deberías ver **"Alumno"** y **"Maestro"**
   - Selecciona uno y registra el usuario

---

## 🔍 ¿Cómo Verificar la Comunicación con Firebase?

### Opción 1: Componente de Diagnóstico (En la App)

1. Ve a la pestaña **Firebase** en la app
2. Mira los resultados del diagnóstico:
   - ✅ **Verde** = Todo bien
   - ⚠️ **Naranja** = Advertencia (no crítico)
   - ❌ **Rojo** = Error que debes solucionar

### Opción 2: Firebase Console (En el Navegador)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto **kidiquo**
3. Ve a **Firestore Database** > **Datos**
4. Deberías ver:
   - Colección **`roles`** con 2 documentos
   - Colección **`users`** (se crea al registrar el primer usuario)

### Opción 3: Logs de la App

Abre las **Developer Tools** en tu navegador o terminal y busca:

**✅ Conexión exitosa:**
```
✅ Firebase inicializado correctamente
✅ Conexión establecida con Firestore
✅ 2 rol(es) encontrado(s)
```

**❌ Error de permisos:**
```
❌ Error cargando roles: FirebaseError: Missing or insufficient permissions
```

---

## 🆘 Troubleshooting

### El error persiste después de cambiar las reglas

**Causa:** Las reglas tardan en propagarse

**Solución:**
1. Espera 1-2 minutos
2. Cierra la app completamente
3. Detén el servidor: `Ctrl + C` en la terminal
4. Reinicia: `npm start`
5. Vuelve a probar

---

### No veo la pestaña "Firebase" en la app

**Solución:**
1. Verifica que estés en el branch correcto: `git branch`
2. Debería mostrar: `* test`
3. Si no, ejecuta: `git checkout test`
4. Reinicia la app

---

### No puedo publicar las reglas en Firebase Console

**Causa:** Problemas de permisos en Firebase

**Solución:**
1. Verifica que seas **Owner** o **Editor** del proyecto
2. Ve a **Configuración del proyecto** > **Usuarios y permisos**
3. Tu cuenta debe tener rol de **Propietario** o **Editor**

---

### El selector de roles sigue sin mostrar opciones

**Causa:** Los roles no están inicializados en Firestore

**Solución:**
1. Ve a la pestaña **Firebase** > **Inicializar Roles**
2. Presiona el botón
3. Espera el mensaje de confirmación
4. Vuelve al registro y prueba de nuevo

---

## 📋 Checklist de Verificación

Marca cada paso que completes:

- [ ] Firebase Console abierto
- [ ] Proyecto **kidiquo** seleccionado
- [ ] Firestore Database habilitado
- [ ] Reglas de desarrollo configuradas:
  ```javascript
  allow read, write: if true;
  ```
- [ ] Reglas publicadas
- [ ] App reiniciada (`npm start`)
- [ ] Diagnóstico ejecutado (pestaña Firebase)
- [ ] ✅ Configuración Firebase: success
- [ ] ✅ Conexión Firestore: success
- [ ] Roles inicializados
- [ ] ✅ Colección Roles: 2 rol(es) encontrado(s)
- [ ] Registro probado exitosamente

---

## 🎯 Resultado Esperado

Una vez completados todos los pasos:

1. **Diagnóstico Firebase:** Todo en ✅ verde
2. **Selector de Roles:** Muestra "Alumno" y "Maestro" con descripciones
3. **Registro:** Se completa sin errores
4. **Firestore:** Usuario creado con campo `roleId`

---

## 📞 ¿Sigues Teniendo Problemas?

Si después de seguir todos los pasos sigues viendo errores:

1. **Captura de pantalla** del error completo
2. **Captura de pantalla** del diagnóstico Firebase
3. **Captura de pantalla** de las reglas en Firebase Console
4. Comparte las capturas para diagnóstico específico

---

**IMPORTANTE:** Las reglas actuales (`allow read, write: if true`) son **SOLO PARA DESARROLLO**. Antes de lanzar a producción, debes cambiarlas por reglas más seguras (ver `CONFIGURAR_FIREBASE_REGLAS.md`).
