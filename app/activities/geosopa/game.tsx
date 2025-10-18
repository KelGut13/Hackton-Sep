import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, PanResponder, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useAccessibility } from '../../../contexts/AccessibilityContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

// Datos de la sopa de letras basada en la imagen
const GRID_DATA = [
  ['L', 'Y', 'Z', 'L', 'Q', 'K', 'T', 'B', 'Z', 'X', 'L'],
  ['G', 'W', 'Z', 'B', 'T', 'Z', 'T', 'Y', 'G', 'A', 'M'],
  ['C', 'U', 'A', 'D', 'R', 'A', 'D', 'O', 'Y', 'T', 'V'],
  ['L', 'W', 'T', 'R', 'I', 'A', 'N', 'G', 'U', 'L', 'O'],
  ['A', 'P', 'E', 'N', 'T', 'A', 'G', 'O', 'N', 'O', 'G'],
  ['G', 'N', 'J', 'K', 'O', 'P', 'H', 'N', 'P', 'M', 'E'],
  ['H', 'A', 'L', 'T', 'C', 'I', 'R', 'C', 'U', 'L', 'O'],
  ['E', 'E', 'C', 'T', 'R', 'A', 'P', 'E', 'C', 'I', 'O'],
  ['N', 'V', 'Q', 'R', 'O', 'M', 'B', 'O', 'X', 'J', 'E'],
  ['I', 'L', 'Y', 'Q', 'Z', 'O', 'V', 'A', 'L', 'O', 'L'],
  ['Z', 'R', 'E', 'C', 'T', 'A', 'N', 'G', 'U', 'L', 'O'],
];

// Palabras a encontrar con sus posiciones exactas en la grilla
const WORDS_TO_FIND = [
  {
    word: 'TRIANGULO',
    found: false,
    positions: [
      {row: 3, col: 6}, {row: 3, col: 7}, {row: 3, col: 8}, 
      {row: 3, col: 9}, {row: 3, col: 10}, {row: 4, col: 10}, 
      {row: 5, col: 10}, {row: 6, col: 10}, {row: 7, col: 10}
    ]
  },
  {
    word: 'CUADRADO', 
    found: false,
    positions: [
      {row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, 
      {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, 
      {row: 2, col: 6}, {row: 2, col: 7}
    ]
  },
  {
    word: 'CIRCULO',
    found: false, 
    positions: [
      {row: 6, col: 4}, {row: 6, col: 5}, {row: 6, col: 6}, 
      {row: 6, col: 7}, {row: 6, col: 8}, {row: 6, col: 9}, 
      {row: 6, col: 10}
    ]
  },
  {
    word: 'RECTANGULO', 
    found: false,
    positions: [
      {row: 10, col: 1}, {row: 10, col: 2}, {row: 10, col: 3}, 
      {row: 10, col: 4}, {row: 10, col: 5}, {row: 10, col: 6}, 
      {row: 10, col: 7}, {row: 10, col: 8}, {row: 10, col: 9}, 
      {row: 10, col: 10}
    ]
  },
  {
    word: 'PENTAGONO',
    found: false,
    positions: [
      {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, 
      {row: 4, col: 4}, {row: 4, col: 5}, {row: 4, col: 6}, 
      {row: 4, col: 7}, {row: 4, col: 8}, {row: 4, col: 9}
    ]
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
  const [dragPath, setDragPath] = useState<{row: number, col: number}[]>([]);
  
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const { currentTexts } = useLanguage();
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  // Tamaño de cada celda mejorado
  const CELL_SIZE = 36;
  const CELL_MARGIN = 3;

  // Sistema de arrastre mejorado con PanResponder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      const position = getCellFromCoordinates(pageX, pageY);
      
      if (position) {
        setIsSelecting(true);
        setStartCell(position);
        setCurrentSelection([position]);
        setDragPath([position]);
        speakText(`Comenzando desde ${GRID_DATA[position.row][position.col]}`);
      }
    },

    onPanResponderMove: (evt) => {
      if (!isSelecting || !startCell) return;
      
      const { pageX, pageY } = evt.nativeEvent;
      const position = getCellFromCoordinates(pageX, pageY);
      
      if (position) {
        const newSelection = getLinePath(startCell, position);
        setCurrentSelection(newSelection);
        
        // Agregar al dragPath si no está ya
        if (!dragPath.some(p => p.row === position.row && p.col === position.col)) {
          setDragPath(prev => [...prev, position]);
        }
      }
    },

    onPanResponderRelease: () => {
      if (isSelecting && currentSelection.length > 2) {
        checkWordFound(currentSelection);
      }
      
      setIsSelecting(false);
      setCurrentSelection([]);
      setStartCell(null);
      setDragPath([]);
    },
  });

  // Función para obtener la celda desde coordenadas de pantalla
  const getCellFromCoordinates = (pageX: number, pageY: number): {row: number, col: number} | null => {
    // Esta función se mejorará cuando tengamos las coordenadas del grid
    // Por ahora retornamos null para evitar errores
    return null;
  };

  // Sistema de selección manual por celda (más confiable)
  const handleCellPressIn = (row: number, col: number) => {
    setIsSelecting(true);
    setStartCell({ row, col });
    setCurrentSelection([{ row, col }]);
    speakText(`Comenzando desde letra ${GRID_DATA[row][col]}`);
  };

  const handleCellTouch = (row: number, col: number) => {
    if (isSelecting && startCell) {
      const newSelection = getLinePath(startCell, { row, col });
      setCurrentSelection(newSelection);
    }
  };

  const handleCellPressOut = () => {
    if (isSelecting && currentSelection.length > 2) {
      checkWordFound(currentSelection);
    }
    setIsSelecting(false);
    setCurrentSelection([]);
    setStartCell(null);
  };

  // Función para obtener el camino en línea recta entre dos puntos
  const getLinePath = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    const path = [];
    
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    if (steps === 0) return [start];
    
    const rowStep = rowDiff / steps;
    const colStep = colDiff / steps;
    
    for (let i = 0; i <= steps; i++) {
      const row = Math.round(start.row + rowStep * i);
      const col = Math.round(start.col + colStep * i);
      
      if (row >= 0 && row < GRID_DATA.length && col >= 0 && col < GRID_DATA[0].length) {
        path.push({ row, col });
      }
    }
    
    return path;
  };

  // Función para verificar si una palabra fue encontrada (mejorada)
  const checkWordFound = (path: {row: number, col: number}[]) => {
    if (path.length < 3) return;

    const selectedWord = path.map(cell => GRID_DATA[cell.row][cell.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    console.log('Palabra seleccionada:', selectedWord);
    console.log('Palabra invertida:', reversedWord);
    console.log('Longitud del path:', path.length);

    wordsFound.forEach((wordData, index) => {
      const wordToFind = wordData.word;
      
      if ((selectedWord === wordToFind || reversedWord === wordToFind) && !wordData.found) {
        console.log(`¡Palabra encontrada: ${wordToFind}!`);
        
        // Marcar palabra como encontrada
        const updatedWords = [...wordsFound];
        updatedWords[index].found = true;
        setWordsFound(updatedWords);

        // Actualizar forma geométrica correspondiente
        const shapeName = wordToFind.toLowerCase();
        const updatedShapes = shapes.map(shape => 
          shape.name === shapeName 
            ? { ...shape, found: true, color: '#4CAF50' }
            : shape
        );
        setShapes(updatedShapes);

        // Marcar celdas como encontradas
        setSelectedCells(prev => [...prev, ...path]);
        
        speakText(`¡Excelente! Encontraste ${wordToFind}`);
        return; // Salir después de encontrar la palabra
      }
    });

    // Si no se encontró ninguna palabra, dar feedback
    if (selectedWord.length >= 5) {
      console.log('Palabra no encontrada:', selectedWord);
      speakText('Palabra no encontrada, sigue buscando');
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

  // Función para determinar si una celda está seleccionada o encontrada
  const getCellStyle = (row: number, col: number) => {
    const isInCurrentSelection = currentSelection.some(cell => cell.row === row && cell.col === col);
    const isFound = selectedCells.some(cell => cell.row === row && cell.col === col);
    
    if (isFound) {
      return [styles.gridCell, styles.foundCell];
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
          <View style={styles.gridContainer}>
            {GRID_DATA.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((letter, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={getCellStyle(rowIndex, colIndex)}
                    onPressIn={() => handleCellPressIn(rowIndex, colIndex)}
                    onPressOut={handleCellPressOut}
                    onPress={() => handleCellTouch(rowIndex, colIndex)}
                    activeOpacity={0.6}
                    accessibilityLabel={`Letra ${letter} en fila ${rowIndex + 1}, columna ${colIndex + 1}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.gridLetter}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Progress and Help Display */}
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { fontSize: fontSizes.base }]}>
              Palabras encontradas: {foundCount}/{wordsFound.length}
            </Text>
            {isSelecting && currentSelection.length > 0 && (
              <Text style={[styles.selectionText, { fontSize: fontSizes.small }]}>
                Seleccionando: {currentSelection.map(cell => GRID_DATA[cell.row][cell.col]).join('')}
              </Text>
            )}
          </View>

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
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
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
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCell: {
    backgroundColor: 'rgba(74, 144, 226, 0.8)',
    borderColor: '#4A90E2',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  foundCell: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  gridLetter: {
    fontSize: 20,
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
});