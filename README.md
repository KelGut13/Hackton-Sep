# 🎓 EduPlay - Aplicación Educativa

**EduPlay** es una aplicación educativa interactiva desarrollada con **Expo** y **React Native** que funciona en **móvil**, **tablet** y **web**.

## 🚀 Características

- ✅ **Multiplataforma**: iOS, Android y Web
- ✅ **Responsive Design**: Adaptado para móvil, tablet y desktop
- ✅ **PWA Ready**: Instalable como app web
- ✅ **TypeScript**: Tipado fuerte para mejor desarrollo
- ✅ **Expo Router**: Navegación basada en archivos
- ✅ **Arquitectura modular**: Código compartido entre plataformas

## 🛠️ Tecnologías

- **Framework**: Expo 54 / React Native
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **UI**: React Native Components
- **Desarrollo**: Metro Bundler
- **Web**: React Native Web

## 📦 Instalación y Desarrollo

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar desarrollo

```bash
# Servidor de desarrollo (QR para móvil)
npm start

# Directamente en web
npm run web

# Directamente en Android
npm run android

# Directamente en iOS
npm run ios
```

### 3. Compilar para producción

```bash
# Compilar versión web (PWA)
npm run build:web

# Compilar para Android
npm run build:android

# Compilar para iOS
npm run build:ios
```

## 🌐 Compatibilidad Web

Esta aplicación incluye soporte completo para web:

- **React Native Web** preconfigurado
- **PWA** (Progressive Web App) lista
- **Responsive design** para desktop/tablet/móvil
- **SEO optimizado** para motores de búsqueda

### Comandos específicos para web:

```bash
# Iniciar en modo web
npm run web

# Compilar versión web estática
npm run export:web

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
/
├── app/                    # Rutas principales (Expo Router)
│   ├── (tabs)/            # Navegación por pestañas
│   ├── screens/           # Pantallas individuales
│   ├── web/               # Componentes específicos de web
│   └── mobile/            # Componentes específicos de móvil
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de interfaz
├── hooks/                # Hooks personalizados
├── constants/            # Constantes y configuración
└── assets/              # Imágenes, iconos, fuentes
```

## 🎯 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run web` | Inicia específicamente para web |
| `npm run android` | Inicia específicamente para Android |
| `npm run ios` | Inicia específicamente para iOS |
| `npm run build:web` | Compila versión web para producción |
| `npm run export:web` | Exporta archivos estáticos web |
| `npm run lint` | Ejecuta el linter |
| `npm run reset-project` | Reinicia el proyecto |

## 🌍 Deploy Web

### Netlify / Vercel

1. Compilar la versión web:
```bash
npm run build:web
```

2. Subir la carpeta `dist/` generada

### GitHub Pages

1. Compilar y exportar:
```bash
npm run export:web
```

2. Subir contenido de `web-build/` a tu repositorio de GitHub Pages

## 📱 Compilación Móvil

### Android

```bash
# Para desarrollo
expo build:android

# Para producción (APK)
expo build:android --type apk

# Para Google Play Store (AAB)
expo build:android --type app-bundle
```

### iOS

```bash
# Para desarrollo
expo build:ios

# Para App Store
expo build:ios --type archive
```

## 🔧 Desarrollo Avanzado

### Estructura Compartida

El código está organizado para **compartir el 90%** entre plataformas:

- **Componentes**: Reutilizables en móvil y web
- **Hooks**: Lógica de negocio compartida
- **Estilos**: Responsive design automático
- **Navegación**: Misma estructura en todas las plataformas

### Detección de Plataforma

```typescript
import { usePlatform } from './hooks/use-platform';

const { isWeb, isMobile, isDesktop } = usePlatform();
```

### Componente Web Layout

```typescript
import WebLayout from './app/web/WebLayout';

// Automáticamente añade header/footer solo en web
<WebLayout title="Mi Página">
  <MiContenido />
</WebLayout>
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🎓 Recursos de Aprendizaje

- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de React Native](https://reactnative.dev/docs/getting-started)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

**Desarrollado con ❤️ usando Expo y React Native**
