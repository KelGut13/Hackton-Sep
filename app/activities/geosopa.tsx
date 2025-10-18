import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GeoSopaActivity() {
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const { currentTexts } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  const handlePlayButton = () => {
    speakText('Iniciando juego GeoSopa');
    router.push('/activities/geosopa/game');
  };

  const handleHowToPlay = () => {
    setShowTutorial(true);
    setTutorialStep(0);
    speakText('Iniciando tutorial del juego GeoSopa');
  };

  const tutorialSteps = [
    {
      title: "¡Bienvenido a GeoSopa! 🌍",
      content: "GeoSopa es un juego donde debes encontrar palabras relacionadas con geografía en una sopa de letras.",
      action: "Toca para continuar"
    },
    {
      title: "Cómo buscar palabras 🔍",
      content: "Desliza tu dedo sobre las letras para formar palabras. Puedes buscar en todas las direcciones: horizontal, vertical y diagonal.",
      action: "Toca para continuar"
    },
    {
      title: "Encuentra todas las palabras 📝",
      content: "Tu objetivo es encontrar todas las palabras ocultas en la grilla. Las palabras pueden estar escritas al derecho o al revés.",
      action: "Toca para continuar"
    },
    {
      title: "¡Listo para jugar! 🎮",
      content: "Ahora ya sabes cómo jugar. ¡Presiona 'A Jugar' para comenzar tu aventura geográfica!",
      action: "¡Entendido!"
    }
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
      speakText(tutorialSteps[tutorialStep + 1].content);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
      speakText('Tutorial completado. ¡Ya puedes jugar!');
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    speakText('Tutorial cerrado');
  };

  const handleBack = () => {
    speakText('Regresando al inicio');
    router.back();
  };

  const handleSound = async () => {
    try {
      console.log('Sound button pressed');
      
      const instructionText = currentTexts.instruction || 'Encuentra en la sopa de letras el nombre de las figuras que aparecen, hazlo en el menor tiempo posible.';
      const fullText = `Instrucciones del juego GeoSopa: ${instructionText}`;
      
      console.log('Speaking text:', fullText);
      
      // Usar Speech directamente para asegurar que funcione
      await Speech.speak(fullText, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.75,
      });
      
      // También usar la función del contexto como respaldo
      speakText(fullText);
      
    } catch (error) {
      console.error('Error al reproducir audio:', error);
      // Fallback usando la función del contexto
      speakText('Error al reproducir las instrucciones del juego');
    }
  };

  return (
    <LinearGradient
      colors={colors.background as [string, string, string]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Header 
          title={currentTexts.title}
        />

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

        {/* All modals now handled by Header component */}

        {/* Tutorial Modal */}
        <Modal
          visible={showTutorial}
          transparent={true}
          animationType="fade"
          onRequestClose={closeTutorial}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.tutorialModal, { backgroundColor: colors.inputBg }]}>
              {/* Tutorial Header */}
              <View style={styles.tutorialHeader}>
                <Text style={[styles.tutorialTitle, { fontSize: fontSizes.title }]}>
                  {tutorialSteps[tutorialStep].title}
                </Text>
                <TouchableOpacity
                  onPress={closeTutorial}
                  style={styles.tutorialCloseButton}
                  accessibilityLabel="Cerrar tutorial"
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Tutorial Content */}
              <View style={styles.tutorialContent}>
                <Text style={[styles.tutorialText, { fontSize: fontSizes.base }]}>
                  {tutorialSteps[tutorialStep].content}
                </Text>

                {/* Tutorial Visual Aid */}
                <View style={styles.tutorialVisual}>
                  {tutorialStep === 0 && (
                    <View style={styles.visualDemo}>
                      <Text style={styles.demoText}>🌍 GeoSopa 🌍</Text>
                    </View>
                  )}
                  {tutorialStep === 1 && (
                    <View style={styles.visualDemo}>
                      <View style={styles.miniGrid}>
                        <Text style={styles.gridLetter}>P</Text>
                        <Text style={styles.gridLetter}>E</Text>
                        <Text style={styles.gridLetter}>R</Text>
                        <Text style={styles.gridLetter}>U</Text>
                      </View>
                      <Text style={styles.demoArrow}>👆 Desliza así</Text>
                    </View>
                  )}
                  {tutorialStep === 2 && (
                    <View style={styles.visualDemo}>
                      <Text style={styles.demoText}>📍 CHILE</Text>
                      <Text style={styles.demoText}>📍 BRASIL</Text>
                      <Text style={styles.demoText}>📍 MEXICO</Text>
                    </View>
                  )}
                  {tutorialStep === 3 && (
                    <View style={styles.visualDemo}>
                      <Text style={styles.demoText}>🎯 ¡A jugar!</Text>
                    </View>
                  )}
                </View>

                {/* Tutorial Navigation */}
                <View style={styles.tutorialNavigation}>
                  <View style={styles.stepIndicator}>
                    {tutorialSteps.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.stepDot,
                          index === tutorialStep && styles.activeStepDot
                        ]}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.tutorialButton}
                    onPress={nextTutorialStep}
                    accessibilityLabel={tutorialSteps[tutorialStep].action}
                  >
                    <Text style={[styles.tutorialButtonText, { fontSize: fontSizes.base }]}>
                      {tutorialSteps[tutorialStep].action}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  // Tutorial styles
  tutorialModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tutorialTitle: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tutorialCloseButton: {
    padding: 5,
  },
  tutorialContent: {
    alignItems: 'center',
  },
  tutorialText: {
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  tutorialVisual: {
    alignItems: 'center',
    marginBottom: 30,
  },
  visualDemo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    minHeight: 100,
    justifyContent: 'center',
  },
  demoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  miniGrid: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  gridLetter: {
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  demoArrow: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tutorialNavigation: {
    alignItems: 'center',
    width: '100%',
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeStepDot: {
    backgroundColor: '#4CAF50',
  },
  tutorialButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tutorialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});