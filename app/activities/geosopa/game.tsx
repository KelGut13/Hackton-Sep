import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Header from '../../../components/Header';
import { useAccessibility } from '../../../contexts/AccessibilityContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

// Datos de la sopa de letras verificados
const GRID_DATA = [
  ['L', 'Y', 'Z', 'L', 'Q', 'K', 'T', 'B', 'Z', 'X', 'L'],  // fila 0
  ['G', 'W', 'Z', 'B', 'T', 'Z', 'T', 'Y', 'G', 'A', 'M'],  // fila 1
  ['C', 'U', 'A', 'D', 'R', 'A', 'D', 'O', 'Y', 'T', 'V'],  // fila 2 - CUADRADO (0-7)
  ['L', 'W', 'T', 'R', 'I', 'A', 'N', 'G', 'U', 'L', 'O'],  // fila 3 - TRIANGULO (5-10)
  ['A', 'P', 'E', 'N', 'T', 'A', 'G', 'O', 'N', 'O', 'G'],  // fila 4 - PENTAGONO (1-9)
  ['G', 'N', 'J', 'K', 'O', 'P', 'H', 'N', 'P', 'M', 'E'],  // fila 5
  ['H', 'A', 'L', 'T', 'C', 'I', 'R', 'C', 'U', 'L', 'O'],  // fila 6 - CIRCULO (5-10)
  ['E', 'E', 'C', 'T', 'R', 'A', 'P', 'E', 'C', 'I', 'O'],  // fila 7
  ['N', 'V', 'Q', 'R', 'O', 'M', 'B', 'O', 'X', 'J', 'E'],  // fila 8
  ['I', 'L', 'Y', 'Q', 'Z', 'O', 'V', 'A', 'L', 'O', 'L'],  // fila 9
  ['Z', 'R', 'E', 'C', 'T', 'A', 'N', 'G', 'U', 'L', 'O'],  // fila 10 - RECTANGULO (1-10)
];

// Palabras a encontrar con auto-detección de posiciones
const WORDS_TO_FIND = [
  {
    word: 'CUADRADO',
    found: false,
    positions: []
  },
  {
    word: 'TRIANGULO',
    found: false,
    positions: []
  },
  {
    word: 'PENTAGONO',
    found: false,
    positions: []
  },
  {
    word: 'CIRCULO',
    found: false,
    positions: []
  },
  {
    word: 'RECTANGULO',
    found: false,
    positions: []
  }
];

// Figuras geométricas mostradas
const GEOMETRIC_SHAPES = [
  { name: 'triangulo', icon: '△', color: '#D3D3D3', found: false },
  { name: 'cuadrado', icon: '■', color: '#D3D3D3', found: false },
  { name: 'circulo', icon: '●', color: '#D3D3D3', found: false },
  { name: 'rectangulo', icon: '▬', color: '#D3D3D3', found: false },
  { name: 'pentagono', icon: '⬟', color: '#D3D3D3', found: false }
];

export default function GeoSopaGameScreen() {
  const [wordsFound, setWordsFound] = useState(WORDS_TO_FIND);
  const [shapes, setShapes] = useState(GEOMETRIC_SHAPES);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{row: number, col: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{row: number, col: number} | null>(null);
  const [endCell, setEndCell] = useState<{row: number, col: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const { currentTexts } = useLanguage();
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  // Función automática para encontrar palabras en cualquier dirección
  const findWordInGrid = (startCell: {row: number, col: number}) => {
    try {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1], // arriba-izq, arriba, arriba-der
        [0, -1],           [0, 1],  // izquierda, derecha
        [1, -1],  [1, 0],  [1, 1]   // abajo-izq, abajo, abajo-der
      ];

      for (const [rowDir, colDir] of directions) {
        for (let len = 3; len <= 8; len++) {
          const path: {row: number, col: number}[] = [];
          let valid = true;

          for (let i = 0; i < len; i++) {
            const row = startCell.row + (i * rowDir);
            const col = startCell.col + (i * colDir);

            if (row < 0 || row >= GRID_DATA.length || 
                col < 0 || col >= GRID_DATA[0].length) {
              valid = false;
              break;
            }
            path.push({ row, col });
          }

          if (valid && path.length >= 3) {
            const selectedWord = path.map((cell: {row: number, col: number}) => GRID_DATA[cell.row][cell.col]).join('');
            
            // Verificar si esta palabra existe en nuestra lista
            const foundWord = wordsFound.find((word: any) => 
              word.word === selectedWord && !word.found
            );

            if (foundWord) {
              return path;
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error en findWordInGrid:', error);
      return null;
    }
  };

  // Configuración de celdas optimizada
  const CELL_SIZE = 28;
  const CELL_MARGIN = 1;

  // Sistema de selección simplificado y seguro
  const handleCellPress = (row: number, col: number) => {
    try {
      if (!isSelecting) {
        // Primer toque: marcar inicio
        setIsSelecting(true);
        setStartCell({ row, col });
        setCurrentSelection([{ row, col }]);
        setEndCell(null);
        speakText(`Inicio: ${GRID_DATA[row][col]}`);
      } else if (startCell && !endCell) {
        // Segundo toque: marcar fin y crear selección
        setEndCell({ row, col });
        const path = getPathBetweenCells(startCell, { row, col });
        setCurrentSelection(path);
        
        const selectedWord = path.map((cell: {row: number, col: number}) => GRID_DATA[cell.row][cell.col]).join('');
        speakText(`Palabra: ${selectedWord}`);
        
        // Verificar palabra inmediatamente sin setTimeout
        checkWordFound(path);
        
        // Reset después de verificar
        setTimeout(() => {
          resetSelection();
        }, 1000);
      } else {
        // Toque durante selección: resetear y empezar nuevo
        resetSelection();
        // Recursivamente iniciar nueva selección
        setIsSelecting(true);
        setStartCell({ row, col });
        setCurrentSelection([{ row, col }]);
        setEndCell(null);
        speakText(`Nuevo inicio: ${GRID_DATA[row][col]}`);
      }
    } catch (error) {
      console.error('Error en handleCellPress:', error);
      resetSelection();
    }
  };

  const resetSelection = () => {
    try {
      setIsSelecting(false);
      setStartCell(null);
      setEndCell(null);
      setCurrentSelection([]);
      setIsDragging(false);
    } catch (error) {
      console.error('Error en resetSelection:', error);
    }
  };

  // Función simplificada para obtener celda desde coordenadas
  const getCellFromCoordinates = (x: number, y: number): {row: number, col: number} | null => {
    try {
      // Constantes que coinciden con los estilos
      const CELL_SIZE = 30;
      const CELL_MARGIN = 1; 
      const TOTAL_CELL_SIZE = CELL_SIZE + (CELL_MARGIN * 2); // 32px total por celda
      
      // Calcular índices directamente
      const col = Math.floor(x / TOTAL_CELL_SIZE);
      const row = Math.floor(y / TOTAL_CELL_SIZE);
      
      // Verificar límites de forma más robusta
      if (row >= 0 && row < GRID_DATA.length && 
          col >= 0 && col < GRID_DATA[0].length) {
        console.log(`Coordenadas (${x}, ${y}) -> Celda [${row}, ${col}]`);
        return { row, col };
      }
      
      console.log(`Coordenadas fuera de límites: (${x}, ${y})`);
      return null;
    } catch (error) {
      console.error('Error en getCellFromCoordinates:', error);
      return null;
    }
  };

  // Gesto de arrastre para selección de palabras
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      try {
        console.log('Gesto iniciado en:', event.x, event.y);
        
        // Verificar que las coordenadas son válidas
        if (typeof event.x !== 'number' || typeof event.y !== 'number') {
          console.log('Coordenadas inválidas:', event.x, event.y);
          return;
        }
        
        const cell = getCellFromCoordinates(event.x, event.y);
        if (cell) {
          console.log('Celda encontrada:', cell);
          setIsDragging(true);
          setIsSelecting(true);
          setStartCell(cell);
          setCurrentSelection([cell]);
          
          // Verificar que la celda existe en GRID_DATA
          if (GRID_DATA[cell.row] && GRID_DATA[cell.row][cell.col]) {
            speakText(`Inicio: ${GRID_DATA[cell.row][cell.col]}`);
          }
        } else {
          console.log('No se encontró celda válida');
        }
      } catch (error) {
        console.error('Error en panGesture.onStart:', error);
      }
    })
    .onUpdate((event) => {
      try {
        if (!isDragging || !startCell) return;
        
        // Verificar coordenadas válidas
        if (typeof event.x !== 'number' || typeof event.y !== 'number') return;
        
        const currentCell = getCellFromCoordinates(event.x, event.y);
        if (currentCell && startCell) {
          const path = getPathBetweenCells(startCell, currentCell);
          if (path && path.length >= 2) {
            setCurrentSelection(path);
            setEndCell(currentCell);
          }
        }
      } catch (error) {
        console.error('Error en panGesture.onUpdate:', error);
      }
    })
    .onEnd(() => {
      try {
        console.log('Gesto terminado, selección actual:', currentSelection.length);
        
        if (currentSelection && currentSelection.length >= 3) {
          const selectedWord = currentSelection.map((cell: {row: number, col: number}) => {
            if (GRID_DATA[cell.row] && GRID_DATA[cell.row][cell.col]) {
              return GRID_DATA[cell.row][cell.col];
            }
            return '';
          }).join('');
          
          console.log('Palabra formada:', selectedWord);
          speakText(`Palabra: ${selectedWord}`);
          checkWordFound(currentSelection);
        }
        
        // Reset inmediato para evitar problemas de estado
        setTimeout(() => {
          resetSelection();
        }, 500);
      } catch (error) {
        console.error('Error en panGesture.onEnd:', error);
        resetSelection();
      }
    });

  // Función simplificada y robusta para obtener path entre dos celdas
  const getPathBetweenCells = (start: {row: number, col: number}, end: {row: number, col: number}): {row: number, col: number}[] => {
    try {
      const rowDiff = end.row - start.row;
      const colDiff = end.col - start.col;
      const path: {row: number, col: number}[] = [];

      // Solo permitir líneas rectas en 8 direcciones
      if (rowDiff === 0) {
        // Horizontal
        const step = colDiff > 0 ? 1 : -1;
        for (let col = start.col; col !== end.col + step; col += step) {
          if (col >= 0 && col < GRID_DATA[0].length) {
            path.push({ row: start.row, col });
          }
        }
      } else if (colDiff === 0) {
        // Vertical
        const step = rowDiff > 0 ? 1 : -1;
        for (let row = start.row; row !== end.row + step; row += step) {
          if (row >= 0 && row < GRID_DATA.length) {
            path.push({ row, col: start.col });
          }
        }
      } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        // Diagonal
        const rowStep = rowDiff > 0 ? 1 : -1;
        const colStep = colDiff > 0 ? 1 : -1;
        const steps = Math.abs(rowDiff);
        
        for (let i = 0; i <= steps; i++) {
          const row = start.row + (i * rowStep);
          const col = start.col + (i * colStep);
          
          if (row >= 0 && row < GRID_DATA.length && 
              col >= 0 && col < GRID_DATA[0].length) {
            path.push({ row, col });
          }
        }
      }

      return path;
    } catch (error) {
      console.error('Error en getPathBetweenCells:', error);
      return [];
    }
  };  // Función segura para verificar palabras
  const checkWordFound = (path: {row: number, col: number}[]) => {
    try {
      if (!path || path.length < 3) {
        console.log('Path inválido o muy corto');
        return;
      }

      const selectedWord = path.map(cell => {
        if (cell.row >= 0 && cell.row < GRID_DATA.length && 
            cell.col >= 0 && cell.col < GRID_DATA[0].length) {
          return GRID_DATA[cell.row][cell.col];
        }
        return '';
      }).join('');
      
      const reversedWord = selectedWord.split('').reverse().join('');

      console.log('Verificando palabra:', selectedWord);

      // Verificar cada palabra de forma segura
      for (let index = 0; index < wordsFound.length; index++) {
        const wordData = wordsFound[index];
        
        if (!wordData || !wordData.word) continue;
        
        const wordToFind = wordData.word;
        
        if ((selectedWord === wordToFind || reversedWord === wordToFind) && !wordData.found) {
          console.log(`¡Palabra encontrada: ${wordToFind}!`);
          
          // Actualizar palabras encontradas de forma segura
          setWordsFound(prevWords => {
            const newWords = [...prevWords];
            if (newWords[index]) {
              newWords[index] = { ...newWords[index], found: true };
            }
            return newWords;
          });

          // Actualizar figuras de forma segura
          const shapeName = wordToFind.toLowerCase();
          setShapes(prevShapes => {
            return prevShapes.map(shape => 
              shape.name === shapeName 
                ? { ...shape, found: true, color: '#4CAF50' }
                : shape
            );
          });

          // Marcar celdas como encontradas
          setSelectedCells(prev => [...prev, ...path]);
          
          speakText(`¡Encontraste ${wordToFind}!`);
          return;
        }
      }

      console.log('Palabra no encontrada:', selectedWord);
      speakText('Sigue buscando');
      
    } catch (error) {
      console.error('Error en checkWordFound:', error);
      speakText('Error al verificar palabra');
    }
  };

  const handleBack = () => {
    speakText('Regresando a la actividad');
    router.back();
  };

  const handleNext = () => {
    const foundWords = wordsFound.filter(word => word.found).length;
    if (foundWords === wordsFound.length) {
      speakText('¡Felicidades! Has completado el nivel');
      router.back();
    } else {
      speakText(`Te faltan ${wordsFound.length - foundWords} palabras por encontrar`);
    }
  };

  // Función para determinar el estilo de cada celda
  const getCellStyle = (row: number, col: number) => {
    const isStartCell = startCell && startCell.row === row && startCell.col === col;
    const isInCurrentSelection = currentSelection.some(cell => cell.row === row && cell.col === col);
    const isFound = selectedCells.some(cell => cell.row === row && cell.col === col);
    
    if (isFound) {
      return [styles.gridCell, styles.foundCell];
    } else if (isStartCell && isSelecting) {
      return [styles.gridCell, styles.startCell];
    } else if (isInCurrentSelection) {
      return [styles.gridCell, styles.selectedCell];
    }
    return [styles.gridCell];
  };

  const foundCount = wordsFound.filter(word => word.found).length;
  const foundShapes = shapes.filter(shape => shape.found).length;

  return (
    <LinearGradient
      colors={['#5BA9B8', '#87CEBD', '#B8D896']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Header 
          title={currentTexts.title}
        />



        {/* Word Search Grid */}
        <View style={styles.gameContainer}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.gridContainer}>
              {GRID_DATA.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                  {row.map((letter, colIndex) => (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      style={getCellStyle(rowIndex, colIndex)}
                      onPress={() => handleCellPress(rowIndex, colIndex)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.gridLetter}>{letter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </GestureDetector>


            



          {/* Geometric Shapes Display */}
          <View style={styles.shapesContainer}>
            {shapes.map((shape, index) => (
              <View 
                key={index} 
                style={[
                  styles.shapeItem,
                  { 
                    backgroundColor: shape.found ? '#4CAF50' : '#D3D3D3',
                    borderWidth: shape.found ? 3 : 2,
                    borderColor: shape.found ? '#2E7D32' : '#999'
                  }
                ]}
              >
                <Text style={[
                  styles.shapeIcon,
                  { color: shape.found ? 'white' : '#666' }
                ]}>
                  {shape.icon}
                </Text>
                {shape.found && (
                  <View style={styles.checkMark}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </View>
                )}
                <Text style={[
                  styles.shapeName,
                  { color: shape.found ? 'white' : '#666' }
                ]}>
                  {shape.name.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              { opacity: foundCount === wordsFound.length ? 1 : 0.6 }
            ]}
            onPress={handleNext}
            accessibilityLabel={currentTexts.next}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {currentTexts.next}
            </Text>
          </TouchableOpacity>
        </View>

        {/* All modals now handled by Header component */}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gridContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectionText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
  },
  selectedCell: {
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
  },
  startCell: {
    backgroundColor: 'rgba(255, 193, 7, 0.7)',
  },
  foundCell: {
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
  },
  gridLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  shapesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  shapeItem: {
    width: 90,
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    paddingVertical: 5,
  },
  shapeIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shapeName: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
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
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6BCDDD',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});