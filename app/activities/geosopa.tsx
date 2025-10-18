import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function GeoSopaActivity() {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  const texts = {
    es: {
      title: 'GeoSopa',
      instruction: 'Encuentra en la sopa de letras el nombre de las figuras que aparecen, hazlo en el menor tiempo posible.',
      howToPlay: '¿Cómo jugar?',
      playButton: '¡A Jugar!',
      backButton: 'Atrás',
      soundButton: 'Sonido'
    },
    en: {
      title: 'GeoSoup',
      instruction: 'Find in the word search the name of the figures that appear, do it in the shortest time possible.',
      howToPlay: 'How to play?',
      playButton: 'Let\'s Play!',
      backButton: 'Back',
      soundButton: 'Sound'
    }
  };

  const currentTexts = texts[currentLanguage as keyof typeof texts];

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLang);
    speakText(`Idioma cambiado a ${newLang === 'es' ? 'español' : 'inglés'}`);
  };

  const handlePlayButton = () => {
    speakText('Iniciando juego GeoSopa');
    // Aquí iría la navegación al juego real
    // router.push('/activities/geosopa/game');
  };

  const handleHowToPlay = () => {
    speakText('Abriendo instrucciones del juego');
    // Aquí iría la navegación a las instrucciones
    // router.push('/activities/geosopa/instructions');
  };

  const handleBack = () => {
    speakText('Regresando al inicio');
    router.back();
  };

  const handleSound = () => {
    speakText('Reproduciendo sonido de ejemplo');
    // Aquí iría la funcionalidad de sonido
  };

  return (
    <LinearGradient
      colors={colors.background as [string, string, string]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {/* Settings Button (Engranaje) */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => speakText('Configuraciones de la actividad')}
            accessibilityLabel="Configuraciones de la actividad"
            accessibilityRole="button"
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.headerTitle, { fontSize: fontSizes.title }]}>
            {currentTexts.title}
          </Text>

          {/* Right side buttons */}
          <View style={styles.rightButtons}>
            {/* Language Toggle */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguage}
              accessibilityLabel={`Cambiar idioma a ${currentLanguage === 'es' ? 'inglés' : 'español'}`}
              accessibilityRole="button"
            >
              <Text style={styles.languageFlag}>
                {currentLanguage === 'es' ? '🇲🇽' : '🇺🇸'}
              </Text>
            </TouchableOpacity>

            {/* User Profile */}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => speakText('Perfil de usuario')}
              accessibilityLabel="Perfil de usuario"
              accessibilityRole="button"
            >
              <View style={styles.profileImage}>
                <Ionicons name="person" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Game Title */}
          <View style={styles.gameHeader}>
            <Text style={[styles.gameTitle, { fontSize: fontSizes.title * 1.5 }]}>
              {currentTexts.title}
            </Text>
          </View>

          {/* Instruction Card */}
          <View style={styles.instructionCard}>
            <Text style={[styles.instructionText, { fontSize: fontSizes.base }]}>
              {currentTexts.instruction}
            </Text>

            {/* Sound Button */}
            <TouchableOpacity
              style={styles.soundButton}
              onPress={handleSound}
              accessibilityLabel={currentTexts.soundButton}
              accessibilityRole="button"
            >
              <View style={styles.soundIcon}>
                <Ionicons name="volume-high" size={24} color="#333" />
              </View>
            </TouchableOpacity>

            {/* How to Play Button */}
            <TouchableOpacity
              style={styles.howToPlayButton}
              onPress={handleHowToPlay}
              accessibilityLabel={currentTexts.howToPlay}
              accessibilityRole="button"
            >
              <View style={styles.playIconContainer}>
                <Ionicons name="play-circle" size={20} color="white" />
              </View>
              <Text style={[styles.howToPlayText, { fontSize: fontSizes.base }]}>
                {currentTexts.howToPlay}
              </Text>
            </TouchableOpacity>

            {/* Play Button */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayButton}
              accessibilityLabel={currentTexts.playButton}
              accessibilityRole="button"
            >
              <Text style={[styles.playButtonText, { fontSize: fontSizes.base }]}>
                {currentTexts.playButton}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel={currentTexts.backButton}
            accessibilityRole="button"
          >
            <Text style={[styles.backButtonText, { fontSize: fontSizes.base }]}>
              {currentTexts.backButton}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40, // Aumentado para mover el header más abajo
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameHeader: {
    marginBottom: 40,
    alignItems: 'center',
  },
  gameTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 40,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  instructionText: {
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    fontWeight: '500',
  },
  soundButton: {
    marginBottom: 20,
  },
  soundIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  howToPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  playIconContainer: {
    marginRight: 8,
  },
  howToPlayText: {
    color: 'white',
    fontWeight: '600',
  },
  playButton: {
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
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});