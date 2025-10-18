import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface GlobalAccessibilityButtonProps {
  onPress: () => void;
}

export default function GlobalAccessibilityButton({ onPress }: GlobalAccessibilityButtonProps) {
  const {
    buttonPosition,
    setButtonPosition,
    speakText,
  } = useAccessibility();

  const [isDragging, setIsDragging] = useState(false);
  
  // Configuración para el botón arrastrable
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const buttonSize = 50;
  
  // Usar la posición global del contexto
  const pan = useRef(new Animated.ValueXY(buttonPosition)).current;
  
  // Referencias para rastrear la posición actual
  const currentPosition = useRef(buttonPosition);

  // Sincronizar la posición del contexto cuando cambie
  useEffect(() => {
    try {
      pan.setValue(buttonPosition);
      currentPosition.current = buttonPosition;
    } catch (error) {
      console.warn('Error syncing button position:', error);
    }
  }, [buttonPosition]);

  // Listener para rastrear cambios de posición y guardarlos globalmente
  useEffect(() => {
    let listenerId: string | undefined;
    
    try {
      listenerId = pan.addListener((value) => {
        currentPosition.current = value;
      });
    } catch (error) {
      console.warn('Error setting up position listener:', error);
    }
    
    return () => {
      try {
        if (listenerId) {
          pan.removeListener(listenerId);
        }
      } catch (error) {
        console.warn('Error removing position listener:', error);
      }
    };
  }, []);
  
  // Configurar el PanResponder para hacer el botón arrastrable
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Cuando comience el arrastre, establecer el offset y cambiar estado visual
      setIsDragging(true);
      pan.setOffset({
        x: currentPosition.current.x,
        y: currentPosition.current.y,
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      // Actualizar la posición mientras se arrastra
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Cuando se suelte, quitar el offset y asegurar que esté dentro de los límites
      pan.flattenOffset();
      
      // Obtener la posición final basada en el gesture
      let finalX = currentPosition.current.x;
      let finalY = currentPosition.current.y;
      
      // Limitar la posición dentro de la pantalla
      if (finalX < 0) finalX = 0;
      if (finalX > screenWidth - buttonSize) finalX = screenWidth - buttonSize;
      if (finalY < 0) finalY = 0;
      if (finalY > screenHeight - buttonSize - 100) finalY = screenHeight - buttonSize - 100;
      
      // Efecto de "magnetismo": si está cerca del borde, pegarlo al borde
      const edgeThreshold = 50;
      if (finalX < edgeThreshold) {
        finalX = 10; // Margen del borde izquierdo
      } else if (finalX > screenWidth - buttonSize - edgeThreshold) {
        finalX = screenWidth - buttonSize - 10; // Margen del borde derecho
      }
      
      // Guardar la posición final en el contexto global
      setButtonPosition({ x: finalX, y: finalY });
      
      // Animar a la posición final válida con efecto de rebote
      Animated.spring(pan, {
        toValue: { x: finalX, y: finalY },
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
      
      // Si el movimiento fue mínimo, considerar como tap para abrir el menú
      const distance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
      if (distance < 10) {
        try {
          onPress();
          speakText("Menú de accesibilidad abierto");
        } catch (error) {
          console.warn('Error opening accessibility menu:', error);
        }
      } else {
        try {
          speakText("Botón de accesibilidad movido");
        } catch (error) {
          console.warn('Error in speakText:', error);
        }
      }
      
      // Resetear el estado de arrastre
      setIsDragging(false);
    },
  });

  return (
    <Animated.View
      style={[
        styles.accessibilityButton,
        isDragging && styles.accessibilityButtonDragging,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        style={styles.buttonTouchable}
        onPress={onPress}
        accessibilityLabel="Botón de accesibilidad arrastrable"
        accessibilityHint="Mantén presionado y arrastra para mover el botón, o toca para abrir el menú de accesibilidad"
        accessibilityRole="button"
        disabled={isDragging} // Deshabilitar onPress mientras se arrastra
      >
        <Ionicons 
          name="accessibility" 
          size={isDragging ? 28 : 24} 
          color="white" 
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accessibilityButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  accessibilityButtonDragging: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});