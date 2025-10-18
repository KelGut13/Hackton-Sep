# 🧰 Guía de Desarrollo EduPlay

## Scripts Útiles para Tu Proyecto

### 🌐 Desarrollo Web
```bash
# Iniciar en web (recomendado para desarrollo web)
npm run web

# Iniciar servidor general y elegir plataforma
npm start
# Luego presiona 'w' para web
```

### 📱 Desarrollo Móvil
```bash
# Android
npm run android

# iOS (solo en Mac)
npm run ios

# O usar el QR code con:
npm start
```

### 🏗️ Compilación y Deploy

#### Web (PWA)
```bash
# Compilar para web
npm run build:web

# Exportar archivos estáticos
npm run export:web

# Previsualizar build local
npm run preview
```

#### Móvil
```bash
# Android APK
expo build:android --type apk

# iOS (requiere cuenta developer)
expo build:ios

# Usando EAS Build (recomendado)
npx eas build --platform android
npx eas build --platform ios
```

## 🎯 Próximos Pasos Recomendados

### 1. Probar la Versión Web
```bash
npm run web
```
Se abrirá en `http://localhost:8081`

### 2. Personalizar el Diseño
- Editar `app/(tabs)/index.tsx` para la página principal
- Modificar `app/(tabs)/explore.tsx` para la página de exploración
- Personalizar colores en `constants/theme.ts`

### 3. Añadir Contenido Educativo
- Crear nuevas pantallas en `app/screens/`
- Añadir componentes educativos en `components/`
- Implementar juegos y actividades

### 4. Optimizar para Web
- El proyecto ya incluye configuración responsiva
- Usar el hook `usePlatform()` para detectar la plataforma
- Componente `WebLayout` para estructura web específica

### 5. Deploy Web Rápido

#### Netlify:
1. `npm run build:web`
2. Arrastrar carpeta `dist/` a Netlify
3. ¡Listo!

#### Vercel:
1. Conectar repositorio GitHub
2. Vercel detecta automáticamente Expo
3. Deploy automático en cada push

### 6. Generar APK para Android
```bash
# APK para testing
expo build:android --type apk

# AAB para Google Play Store
expo build:android --type app-bundle
```

## 🔧 Comandos de Mantenimiento

```bash
# Limpiar cache
expo r -c

# Actualizar dependencias
npm update

# Verificar problemas
npm run lint

# Reinstalar node_modules
rm -rf node_modules && npm install
```

## 📊 Monitoreo y Analytics

Para añadir analytics a tu app (opcional):

```bash
# Expo Analytics
npx expo install expo-analytics-amplitude

# Firebase Analytics
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

## 🎨 Personalización Rápida

### Cambiar Colores Principales
Edita `constants/theme.ts`:
```typescript
export const theme = {
  primary: '#6366f1',    // Tu color principal
  secondary: '#ec4899',  // Color secundario
  // ...
};
```

### Cambiar Iconos y Splash
- Reemplaza archivos en `assets/images/`
- Ejecuta `npx expo run:android` o `npx expo run:ios` para regenerar

### Añadir Fuentes
```bash
npx expo install expo-font @expo-google-fonts/inter
```

## 🚀 Tips de Rendimiento

1. **Usa imágenes optimizadas** (WebP para web, PNG para móvil)
2. **Lazy loading** para listas largas
3. **Code splitting** automático con Expo Router
4. **Compresión de assets** incluida en build de producción

## 🔗 Enlaces Útiles

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)

---

¡Tu proyecto EduPlay está listo para desarrollar contenido educativo increíble! 🎓✨