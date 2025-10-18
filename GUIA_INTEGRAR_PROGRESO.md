# 📊 Guía para Integrar Sistema de Progreso en Actividades

## 🎯 Objetivo
Esta guía explica cómo integrar el sistema de progreso en cualquier actividad/juego para que se registre automáticamente en la cuenta del usuario.

## 📁 Archivos Importantes

### 1. `services/database.ts`
Contiene todas las funciones para manejar el progreso:
- `saveActivityProgress()` - Guardar/actualizar progreso de actividad
- `getUserActivityProgress()` - Obtener progreso del usuario
- `getUserStats()` - Obtener estadísticas completas

### 2. `app/(tabs)/index.tsx`
Muestra el progreso general y lista de actividades

---

## 🚀 Cómo Integrar en Tu Juego

### Paso 1: Importar las Funciones Necesarias

```typescript
import { auth } from '@/config/firebase';
import { saveActivityProgress } from '@/services/database';
```

### Paso 2: Al Completar una Actividad

Cuando el usuario complete exitosamente tu juego/actividad, llama a esta función:

```typescript
const handleActivityComplete = async (score: number) => {
  try {
    const user = auth.currentUser;
    
    if (user) {
      await saveActivityProgress(
        user.uid,              // ID del usuario actual
        'geosopa',             // ID único de tu actividad
        'Geo Sopa de Letras',  // Nombre de tu actividad
        true,                  // true = completada
        score                  // Puntuación (opcional)
      );
      
      Alert.alert('¡Felicidades!', '¡Has completado la actividad!');
      
      // Opcional: Regresar a la pantalla principal
      router.back();
    }
  } catch (error) {
    console.error('Error al guardar progreso:', error);
  }
};
```

### Paso 3: IDs de Actividades Disponibles

Usa estos IDs según tu actividad:

| ID | Nombre | Icono |
|----|--------|-------|
| `geosopa` | Geo Sopa de Letras | 🌍 |
| `puntogo` | PuntoGo | 🎯 |
| `matematico` | P.Matemático | 🔢 |
| `activity4` | Actividad 4 | 📚 |
| `activity5` | Actividad 5 | 🎨 |
| `activity6` | Actividad 6 | 🔬 |
| `activity7` | Actividad 7 | 🎵 |
| `activity8` | Actividad 8 | ⚽ |
| `activity9` | Actividad 9 | 🌳 |
| `activity10` | Actividad 10 | 💡 |
| `activity11` | Actividad 11 | 🚀 |
| `activity12` | Actividad 12 | 🏆 |

---

## 📋 Ejemplo Completo: Sopa de Letras

```typescript
import { auth } from '@/config/firebase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, View } from 'react-native';
import { saveActivityProgress } from '@/services/database';

export default function GeoSopaGame() {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Cuando el jugador encuentre todas las palabras
  const onGameComplete = async () => {
    setGameCompleted(true);
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para guardar tu progreso');
        return;
      }

      // Guardar progreso en Firebase
      await saveActivityProgress(
        user.uid,
        'geosopa',
        'Geo Sopa de Letras',
        true,
        score
      );

      // Mostrar mensaje de felicitación
      Alert.alert(
        '¡Felicidades! 🎉',
        `Has completado la actividad con ${score} puntos`,
        [
          {
            text: 'Ver mi progreso',
            onPress: () => router.push('/(tabs)')
          },
          {
            text: 'Jugar de nuevo',
            onPress: () => resetGame()
          }
        ]
      );

    } catch (error) {
      console.error('Error al guardar progreso:', error);
      Alert.alert('Error', 'No se pudo guardar tu progreso');
    }
  };

  const resetGame = () => {
    setGameCompleted(false);
    setScore(0);
    // Tu lógica para reiniciar el juego
  };

  return (
    <View>
      {/* Tu juego aquí */}
      {gameCompleted && (
        <Button title="Continuar" onPress={() => router.back()} />
      )}
    </View>
  );
}
```

---

## 🔄 Actualización Automática

### La barra de progreso se actualiza automáticamente:

1. ✅ Cuando guardas un progreso con `saveActivityProgress()`
2. ✅ Se actualiza el porcentaje en la colección `users`
3. ✅ Se muestra en la pantalla principal al regresar
4. ✅ Se guarda el historial en `activityProgress`

### Datos que se guardan:

```typescript
{
  userId: "ABC123...",
  activityId: "geosopa",
  activityName: "Geo Sopa de Letras",
  completed: true,
  score: 95,
  attempts: 3,
  completedAt: "2025-10-18T...",
  updatedAt: "2025-10-18T..."
}
```

---

## 🎨 Características del Sistema

### ✅ Lo que hace automáticamente:

- **Actualiza el porcentaje de progreso** (0-100%)
- **Marca actividades como completadas** (palomita verde)
- **Registra la puntuación** del usuario
- **Cuenta los intentos** de cada actividad
- **Guarda fecha de finalización**
- **Permite reintentos** (se guarda el mejor puntaje)

### 🔐 Seguridad:

- Solo el usuario autenticado puede ver su progreso
- Cada progreso está vinculado al UID del usuario
- Firebase Firestore maneja la persistencia

---

## 🐛 Troubleshooting

### Error: "No hay usuario autenticado"
```typescript
// Solución: Verificar siempre que haya usuario
const user = auth.currentUser;
if (!user) {
  Alert.alert('Error', 'Debes iniciar sesión');
  router.push('/(auth)/login');
  return;
}
```

### Error: "Permission denied"
- Verifica las reglas de Firestore
- El usuario debe estar autenticado
- La colección `activityProgress` debe permitir escritura

### El progreso no se actualiza en pantalla
```typescript
// Solución: La pantalla principal se actualiza al cargar
// Solo asegúrate de que el usuario regrese con router.back()
router.back(); // Regresa y recarga automáticamente
```

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo guardar progreso sin completar la actividad?**
```typescript
// Sí, solo pon completed: false
await saveActivityProgress(user.uid, 'geosopa', 'Geo Sopa', false, score);
```

**P: ¿Cómo obtener el progreso actual del usuario?**
```typescript
import { getUserStats } from '@/services/database';

const stats = await getUserStats(user.uid);
console.log(stats.completedActivities); // 3
console.log(stats.progress); // 25 (porcentaje)
```

**P: ¿Qué pasa si el usuario juega varias veces?**
- Se actualiza el registro existente
- Se incrementa el contador de `attempts`
- Se guarda el puntaje más reciente

---

## ✅ Checklist de Integración

- [ ] Importar `auth` y `saveActivityProgress`
- [ ] Asignar un ID único a tu actividad
- [ ] Llamar `saveActivityProgress()` al completar
- [ ] Verificar que haya usuario autenticado
- [ ] Mostrar mensaje de éxito al usuario
- [ ] Opcional: Regresar a pantalla principal

---

## 🎯 Resultado Final

Una vez integrado, verás:

1. **En la pantalla principal:**
   - Barra de progreso actualizada (ej: 3/12)
   - Actividad marcada con ✓ verde
   - Porcentaje correcto (ej: 25%)

2. **En Firebase:**
   - Documento en `activityProgress` con los datos
   - Campo `progress` actualizado en `users`
   - Historial completo de actividades

---

**¡Listo! Ahora tu actividad está integrada con el sistema de progreso. 🚀**
