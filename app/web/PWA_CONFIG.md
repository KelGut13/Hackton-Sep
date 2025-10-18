# Configuración PWA - Web App Manifest

Para convertir tu aplicación en una PWA (Progressive Web App), crea este archivo en el directorio público:

## public/manifest.json

```json
{
  "name": "EduPlay - Aplicación Educativa",
  "short_name": "EduPlay",
  "description": "Aplicación educativa interactiva para niños",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "kids", "learning"],
  "lang": "es-ES",
  "screenshots": [
    {
      "src": "/screenshot1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshot2.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## Configuración adicional en app.json

Añade estas propiedades a tu app.json para mejorar la experiencia web:

```json
{
  "expo": {
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro",
      "output": "static",
      "lang": "es",
      "name": "EduPlay",
      "shortName": "EduPlay",
      "description": "Aplicación educativa interactiva",
      "startUrl": "/",
      "display": "standalone",
      "orientation": "portrait",
      "themeColor": "#6366f1",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## Service Worker (para funcionalidad offline)

Expo automáticamente genera un service worker básico cuando compilas para web.
Para personalización avanzada, puedes crear un archivo `sw.js` personalizado.