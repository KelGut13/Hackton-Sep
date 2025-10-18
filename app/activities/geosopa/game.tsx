import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useAccessibility } from '../../../contexts/AccessibilityContext';

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

// Palabras a encontrar con sus posiciones
const WORDS_TO_FIND = [
  {
    word: 'TRIANGULO',
    found: false,
    startRow: 3,
    startCol: 6,
    endRow: 3,
    endCol: 10,
    direction: 'horizontal'
  },
  {
    word: 'CUADRADO',
    found: false,
    startRow: 2,
    startCol: 0,
    endRow: 2,
    endCol: 7,
    direction: 'horizontal'
  },
  {
    word: 'CIRCULO',
    found: false,
    startRow: 6,
    startCol: 4,
    endRow: 6,
    endCol: 10,
    direction: 'horizontal'
  },
  {
    word: 'RECTANGULO',
    found: false,
    startRow: 10,
    startCol: 1,
    endRow: 10,
    endCol: 10,
    direction: 'horizontal'
  },
  {
    word: 'PENTAGONO',
    found: false,
    startRow: 4,
    startCol: 1,
    endRow: 4,
    endCol: 9,
    direction: 'horizontal'
  }
];

// Figuras geométricas mostradas
const GEOMETRIC_SHAPES = [
  { name: 'triangulo', icon: '△', color: '#D3D3D3', found: false },
  { name: 'rectangulo', icon: '▯', color: '#D3D3D3', found: false },
  { name: 'circulo', icon: '●', color: '#FF69B4', found: true } // Marcado como encontrado en la imagen
];

export default function GeoSopaGameScreen() {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [wordsFound, setWordsFound] = useState(WORDS_TO_FIND);
  const [shapes, setShapes] = useState(GEOMETRIC_SHAPES);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentPath, setCurrentPath] = useState<{row: number, col: number}[]>([]);
  
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  const texts = {
    es: {
      title: 'GeoSopa',
      next: 'Siguiente',
      back: 'Atrás',
      found: 'encontradas',
      total: 'de 5'
    },
    en: {
      title: 'GeoSoup',
      next: 'Next',
      back: 'Back',
      found: 'found',
      total: 'of 5'
    }
  };

  const currentTexts = texts[currentLanguage as keyof typeof texts];

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLang);
    speakText(`Idioma cambiado a ${newLang === 'es' ? 'español' : 'inglés'}`);
  };

  const handleBack = () => {
    speakText('Regresando a la actividad');
    router.back();
  };

  const handleNext = () => {
    const foundWords = wordsFound.filter(word => word.found).length;
    if (foundWords === wordsFound.length) {
      speakText('¡Felicidades! Has completado el nivel');
      // Aquí se podría navegar al siguiente nivel
      router.back();
    } else {
      speakText(`Te faltan ${wordsFound.length - foundWords} palabras por encontrar`);
    }
  };

  // Función para verificar si una palabra fue encontrada
  const checkWordFound = (path: {row: number, col: number}[]) => {
    if (path.length < 3) return;

    const selectedWord = path.map(cell => GRID_DATA[cell.row][cell.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    wordsFound.forEach((wordData, index) => {
      if ((selectedWord === wordData.word || reversedWord === wordData.word) && !wordData.found) {
        // Marcar palabra como encontrada
        const updatedWords = [...wordsFound];
        updatedWords[index].found = true;
        setWordsFound(updatedWords);

        // Actualizar forma geométrica correspondiente
        const shapeName = wordData.word.toLowerCase();
        const updatedShapes = shapes.map(shape => 
          shape.name === shapeName 
            ? { ...shape, found: true, color: '#4CAF50' }
            : shape
        );
        setShapes(updatedShapes);

        // Marcar celdas como encontradas
        setSelectedCells(prev => [...prev, ...path]);
        
        speakText(`¡Excelente! Encontraste ${wordData.word}`);
      }
    });
  };

  // Función para manejar la selección de celdas
  const handleCellPress = (row: number, col: number) => {
    setIsSelecting(true);
    setCurrentPath([{row, col}]);
    speakText(`Seleccionando desde letra ${GRID_DATA[row][col]}`);
  };

  const handleCellRelease = (row: number, col: number) => {
    if (isSelecting) {
      // Agregar la celda final si no está ya en el path
      const finalPath = currentPath.some(cell => cell.row === row && cell.col === col) 
        ? currentPath 
        : [...currentPath, {row, col}];
      
      if (finalPath.length > 1) {
        checkWordFound(finalPath);
      }
    }
    setIsSelecting(false);
    setCurrentPath([]);
  };

  // Función para detectar si el usuario está arrastrando sobre una celda
  const handleCellMove = (row: number, col: number) => {
    if (isSelecting && currentPath.length > 0) {
      const lastCell = currentPath[currentPath.length - 1];
      
      // Solo agregar si es una celda adyacente o en línea
      if (isValidMove(lastCell, {row, col}) && !currentPath.some(cell => cell.row === row && cell.col === col)) {
        setCurrentPath(prev => [...prev, {row, col}]);
      }
    }
  };

  // Función para validar si el movimiento es válido (horizontal, vertical o diagonal)
  const isValidMove = (from: {row: number, col: number}, to: {row: number, col: number}) => {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // Permitir movimientos en línea recta (horizontal, vertical, diagonal)
    return (rowDiff === 0 && colDiff === 1) || // horizontal
           (rowDiff === 1 && colDiff === 0) || // vertical
           (rowDiff === 1 && colDiff === 1);   // diagonal
  };

  // Función para determinar si una celda está seleccionada o encontrada
  const getCellStyle = (row: number, col: number) => {
    const isInCurrentPath = currentPath.some(cell => cell.row === row && cell.col === col);
    const isFound = selectedCells.some(cell => cell.row === row && cell.col === col);
    
    if (isFound) {
      return [styles.gridCell, styles.foundCell];
    } else if (isInCurrentPath) {
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
          onSettingsPress={() => speakText('Configuraciones de la actividad')}
          onProfilePress={() => speakText('Perfil de usuario')}
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
                    onPressIn={() => handleCellPress(rowIndex, colIndex)}
                    onPressOut={() => handleCellRelease(rowIndex, colIndex)}
                    accessibilityLabel={`Letra ${letter} en fila ${rowIndex + 1}, columna ${colIndex + 1}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.gridLetter}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Geometric Shapes Display */}
          <View style={styles.shapesContainer}>
            {shapes.map((shape, index) => (
              <View 
                key={index} 
                style={[
                  styles.shapeItem,
                  { backgroundColor: shape.color }
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
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    backgroundColor: 'transparent',
  },
  selectedCell: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    borderRadius: 4,
  },
  foundCell: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 4,
  },
  gridLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shapesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  shapeItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shapeIcon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  checkMark: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
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
});