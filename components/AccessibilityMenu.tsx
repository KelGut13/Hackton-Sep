import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useState, useRef } from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated, 
  PanResponder, 
  Dimensions 
} from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function AccessibilityMenu() {
  const {
    highContrast,
    colorBlindMode,
    fontSize,
    screenReaderEnabled,
    setHighContrast,
    setColorBlindMode,
    setFontSize,
    setScreenReaderEnabled,
    speakText,
    getFontSize
  } = useAccessibility();

  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fontSizes = getFontSize();
  
  // Configuración para el botón arrastrable
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const buttonSize = 50;
  
  // Posición inicial del botón (esquina superior derecha)
  const pan = useRef(new Animated.ValueXY({ 
    x: screenWidth - buttonSize - 20, 
    y: 50 
  })).current;
  
  // Referencias para rastrear la posición actual
  const currentPosition = useRef({ x: screenWidth - buttonSize - 20, y: 50 });
  
  // Listener para rastrear cambios de posición
  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      currentPosition.current = value;
    });
    
    return () => {
      pan.removeListener(listenerId);
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
        setShowAccessibilityMenu(true);
        speakText("Menú de accesibilidad abierto");
      } else {
        speakText("Botón de accesibilidad movido");
      }
      
      // Resetear el estado de arrastre
      setIsDragging(false);
    },
  });

  // Leer cuando se abra el menú de accesibilidad
  useEffect(() => {
    if (showAccessibilityMenu && screenReaderEnabled) {
      speakText("Menú de opciones de accesibilidad abierto. Aquí puedes configurar alto contraste, modo daltónico, lector de pantalla y tamaño de texto.");
    }
  }, [showAccessibilityMenu]);

  return (
    <>
      {/* Botón de accesibilidad flotante arrastrable */}
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
          onPress={() => setShowAccessibilityMenu(true)}
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

      {/* Modal de accesibilidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAccessibilityMenu}
        onRequestClose={() => setShowAccessibilityMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 400 }]}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              Opciones de Accesibilidad
            </Text>
            
            {/* Alto contraste */}
            <TouchableOpacity
              style={[styles.accessibilityOption, highContrast && styles.selectedOption]}
              onPress={() => {
                setHighContrast(!highContrast);
                speakText(highContrast ? "Alto contraste desactivado" : "Alto contraste activado");
              }}
              accessibilityLabel={`Alto contraste: ${highContrast ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Cambia a colores de alto contraste para mejor visibilidad"
              accessibilityRole="switch"
              accessibilityState={{ checked: highContrast }}
            >
              <Ionicons name="contrast" size={24} color={highContrast ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: highContrast ? "white" : "#333" }]}>
                Alto Contraste
              </Text>
              <Ionicons 
                name={highContrast ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={highContrast ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Modo daltónico */}
            <TouchableOpacity
              style={[styles.accessibilityOption, colorBlindMode && styles.selectedOption]}
              onPress={() => {
                setColorBlindMode(!colorBlindMode);
                speakText(colorBlindMode ? "Modo daltónico desactivado" : "Modo daltónico activado");
              }}
              accessibilityLabel={`Modo daltónico: ${colorBlindMode ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Activa colores amigables para personas con daltonismo"
              accessibilityRole="switch"
              accessibilityState={{ checked: colorBlindMode }}
            >
              <Ionicons name="eye" size={24} color={colorBlindMode ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: colorBlindMode ? "white" : "#333" }]}>
                Modo Daltónico
              </Text>
              <Ionicons 
                name={colorBlindMode ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={colorBlindMode ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Lector de pantalla */}
            <TouchableOpacity
              style={[styles.accessibilityOption, screenReaderEnabled && styles.selectedOption]}
              onPress={() => {
                const newState = !screenReaderEnabled;
                setScreenReaderEnabled(newState);
                if (newState) {
                  Speech.speak("Lector de pantalla activado. Los elementos serán leídos en voz alta.");
                } else {
                  Speech.speak("Lector de pantalla desactivado");
                }
              }}
              accessibilityLabel={`Lector de pantalla: ${screenReaderEnabled ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Activa la lectura en voz alta de los elementos de la pantalla"
              accessibilityRole="switch"
              accessibilityState={{ checked: screenReaderEnabled }}
            >
              <Ionicons name="volume-high" size={24} color={screenReaderEnabled ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: screenReaderEnabled ? "white" : "#333" }]}>
                Lector de Pantalla
              </Text>
              <Ionicons 
                name={screenReaderEnabled ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={screenReaderEnabled ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Tamaño de fuente */}
            <View style={styles.fontSizeContainer}>
              <Text style={[styles.accessibilityLabel, { fontSize: fontSizes.base }]}>
                Tamaño de Texto:
              </Text>
              <View style={styles.fontSizeButtons}>
                {(['small', 'normal', 'large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontSizeButton, 
                      fontSize === size && styles.selectedFontButton
                    ]}
                    onPress={() => {
                      setFontSize(size);
                      speakText(`Tamaño de texto cambiado a ${size === 'small' ? 'pequeño' : size === 'normal' ? 'normal' : 'grande'}`);
                    }}
                    accessibilityLabel={`Tamaño de texto: ${size === 'small' ? 'Pequeño' : size === 'normal' ? 'Normal' : 'Grande'}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: fontSize === size }}
                  >
                    <Text style={[
                      styles.fontSizeButtonText, 
                      fontSize === size && styles.selectedFontButtonText,
                      { fontSize: size === 'small' ? 12 : size === 'large' ? 20 : 16 }
                    ]}>
                      A
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botón para detener la voz */}
            {screenReaderEnabled && (
              <TouchableOpacity
                style={[styles.accessibilityOption, { backgroundColor: '#ff6b6b' }]}
                onPress={() => Speech.stop()}
                accessibilityLabel="Detener lectura en voz alta"
                accessibilityHint="Detiene la lectura actual del lector de pantalla"
                accessibilityRole="button"
              >
                <Ionicons name="stop" size={24} color="white" />
                <Text style={[styles.accessibilityOptionText, { color: 'white' }]}>
                  Detener Voz
                </Text>
                <Ionicons name="stop-circle" size={24} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAccessibilityMenu(false);
                speakText("Menú de accesibilidad cerrado");
              }}
              accessibilityLabel="Cerrar menú de accesibilidad"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  accessibilityOption: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  accessibilityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
  accessibilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fontSizeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFontButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#2C5AA0',
  },
  fontSizeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedFontButtonText: {
    color: 'white',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});