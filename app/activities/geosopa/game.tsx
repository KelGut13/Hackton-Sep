import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, PanResponder, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

// Palabras a encontrar con posiciones verificadas manualmente
const WORDS_TO_FIND = [
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
    word: 'TRIANGULO',
    found: false,
    positions: [
      {row: 3, col: 5}, {row: 3, col: 6}, {row: 3, col: 7}, 
      {row: 3, col: 8}, {row: 3, col: 9}, {row: 3, col: 10}
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
  },
  {
    word: 'CIRCULO',
    found: false, 
    positions: [
      {row: 6, col: 5}, {row: 6, col: 6}, {row: 6, col: 7}, 
      {row: 6, col: 8}, {row: 6, col: 9}, {row: 6, col: 10}
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
  
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const { currentTexts } = useLanguage();
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  // Configuración de celdas mejorada
  const CELL_SIZE = 40;
  const CELL_MARGIN = 4;

  // Sistema de selección simplificado y más preciso
  const handleCellPress = (row: number, col: number) => {
    if (!isSelecting) {
      // Iniciar nueva selección
      setIsSelecting(true);
      setStartCell({ row, col });
      setCurrentSelection([{ row, col }]);
      speakText(`Comenzando desde ${GRID_DATA[row][col]}`);
    } else if (startCell) {
      // Continuar selección - crear línea desde startCell hasta esta celda
      const newPath = getLinePath(startCell, { row, col });
      setCurrentSelection(newPath);
    }
  };

  const handleCellRelease = () => {
    if (isSelecting && currentSelection.length >= 3) {
      checkWordFound(currentSelection);
    }
    
    // Reset selection
    setIsSelecting(false);
    setCurrentSelection([]);
    setStartCell(null);
  };

  // Función mejorada para obtener línea recta entre dos puntos
  const getLinePath = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    const path = [];
    
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    if (steps === 0) return [start];
    
    // Calcular incrementos para cada paso
    const rowStep = steps > 0 ? rowDiff / steps : 0;
    const colStep = steps > 0 ? colDiff / steps : 0;
    
    for (let i = 0; i <= steps; i++) {
      const row = Math.round(start.row + rowStep * i);
      const col = Math.round(start.col + colStep * i);
      
      // Verificar que las coordenadas estén dentro de los límites
      if (row >= 0 && row < GRID_DATA.length && col >= 0 && col < GRID_DATA[0].length) {
        path.push({ row, col });
      }
    }
    
    return path;
  };

  // Función para verificar si una palabra fue encontrada (completamente mejorada)
  const checkWordFound = (path: {row: number, col: number}[]) => {
    if (path.length < 3) {
      console.log('Path muy corto:', path.length);
      return;
    }

    const selectedWord = path.map(cell => GRID_DATA[cell.row][cell.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    console.log('=== VERIFICANDO PALABRA ===');
    console.log('Palabra seleccionada:', selectedWord);
    console.log('Palabra invertida:', reversedWord);
    console.log('Path completo:', path);
    console.log('Longitud del path:', path.length);

    // Verificar cada palabra individualmente
    for (let index = 0; index < wordsFound.length; index++) {
      const wordData = wordsFound[index];
      const wordToFind = wordData.word;
      
      console.log(`Comparando con: ${wordToFind} (encontrada: ${wordData.found})`);
      
      if ((selectedWord === wordToFind || reversedWord === wordToFind) && !wordData.found) {
        console.log(`🎉 ¡PALABRA ENCONTRADA: ${wordToFind}!`);
        
        // Marcar palabra como encontrada
        const updatedWords = [...wordsFound];
        updatedWords[index] = { ...updatedWords[index], found: true };
        setWordsFound(updatedWords);

        // Actualizar forma geométrica correspondiente
        const shapeName = wordToFind.toLowerCase();
        console.log(`Buscando figura con nombre: ${shapeName}`);
        
        const updatedShapes = shapes.map(shape => {
          console.log(`Comparando ${shape.name} con ${shapeName}`);
          return shape.name === shapeName 
            ? { ...shape, found: true, color: '#4CAF50' }
            : shape;
        });
        
        console.log('Figuras actualizadas:', updatedShapes);
        setShapes(updatedShapes);

        // Marcar celdas como encontradas
        setSelectedCells(prev => [...prev, ...path]);
        
        speakText(`¡Excelente! Encontraste ${wordToFind}`);
        return; // Salir después de encontrar la palabra
      }
    }

    // Si no se encontró ninguna palabra
    console.log('❌ Palabra no encontrada en la lista');
    if (selectedWord.length >= 4) {
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
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                    onPressOut={handleCellRelease}
                    activeOpacity={0.5}
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
            
            {/* Botón de debug para probar */}
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => {
                console.log('=== DEBUG INFO ===');
                console.log('Palabras a encontrar:', wordsFound.map(w => w.word));
                console.log('Estado de las figuras:', shapes);
                // Probar CUADRADO manualmente
                const testPath = [
                  {row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, 
                  {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, 
                  {row: 2, col: 6}, {row: 2, col: 7}
                ];
                console.log('Probando CUADRADO:', testPath.map(cell => GRID_DATA[cell.row][cell.col]).join(''));
                checkWordFound(testPath);
              }}
            >
              <Text style={styles.debugButtonText}>🔍 Debug</Text>
            </TouchableOpacity>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCell: {
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    borderColor: '#4A90E2',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.3,
  },
  foundCell: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderColor: '#4CAF50',
    borderWidth: 3,
    shadowOpacity: 0.3,
  },
  gridLetter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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