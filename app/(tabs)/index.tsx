import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function HomeScreen() {
  const [currentLanguage, setCurrentLanguage] = useState('es'); // 'es' o 'en'
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [completedActivities, setCompletedActivities] = useState(3);
  const totalActivities = 12;
  
  // Contexto de accesibilidad
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  const texts = {
    es: {
      geoSopa: 'GeoSopa',
      puntoGo: 'PuntoGo',
      matematico: 'P.Matemático',
      languagesAndKnowledge: 'Lenguas y Saberes',
      thoughts: 'Pensamientos',
      progress: 'Progreso',
      settings: 'Configuraciones',
      userProfile: 'Perfil de Usuario',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      changePassword: 'Cambiar Contraseña',
      changeName: 'Cambiar Nombre',
      logout: 'Cerrar Sesión'
    },
    en: {
      geoSopa: 'GeoSoup',
      puntoGo: 'PuntoGo',
      matematico: 'P.Mathematical',
      languagesAndKnowledge: 'Languages and Knowledge',
      thoughts: 'Thoughts',
      progress: 'Progress',
      settings: 'Settings',
      userProfile: 'User Profile',
      darkMode: 'Dark Mode',
      language: 'Language',
      changePassword: 'Change Password',
      changeName: 'Change Name',
      logout: 'Logout'
    }
  };

  const currentTexts = texts[currentLanguage as keyof typeof texts];

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLang);
    speakText(`Idioma cambiado a ${newLang === 'es' ? 'español' : 'inglés'}`);
  };

  const activities = [
    { 
      id: 1, 
      name: currentTexts.geoSopa, 
      icon: '🌍', 
      completed: true,
      category: 'geography'
    },
    { 
      id: 2, 
      name: currentTexts.puntoGo, 
      icon: '🎯', 
      completed: true,
      category: 'logic'
    },
    { 
      id: 3, 
      name: currentTexts.matematico, 
      icon: '🔢', 
      completed: true,
      category: 'math'
    },
    { 
      id: 4, 
      name: 'Actividad 4', 
      icon: '📚', 
      completed: false,
      category: 'reading'
    },
    { 
      id: 5, 
      name: 'Actividad 5', 
      icon: '🎨', 
      completed: false,
      category: 'art'
    },
    { 
      id: 6, 
      name: 'Actividad 6', 
      icon: '🔬', 
      completed: false,
      category: 'science'
    }
  ];

  const progressPercentage = (completedActivities / totalActivities) * 100;

  const handleActivityPress = (activity: any) => {
    speakText(`Actividad ${activity.name} ${activity.completed ? 'completada' : 'disponible'}`);
    
    // Navegación a actividades específicas
    if (activity.name === currentTexts.geoSopa || activity.id === 1) {
      router.push('/activities/geosopa');
    } else if (activity.name === currentTexts.puntoGo || activity.id === 2) {
      speakText('PuntoGo próximamente disponible');
      // router.push('/activities/puntogo');
    } else if (activity.name === currentTexts.matematico || activity.id === 3) {
      speakText('P.Matemático próximamente disponible');
      // router.push('/activities/matematico');
    } else {
      speakText('Esta actividad próximamente estará disponible');
    }
  };

  const renderActivity = (activity: any) => (
    <TouchableOpacity
      key={activity.id}
      style={[
        styles.activityCard,
        {
          backgroundColor: activity.completed ? colors.inputBg : '#f0f0f0',
          opacity: activity.completed ? 1 : 0.7
        }
      ]}
      onPress={() => handleActivityPress(activity)}
      accessibilityLabel={`Actividad ${activity.name}`}
      accessibilityHint={activity.completed ? 'Actividad completada' : 'Actividad pendiente'}
      accessibilityRole="button"
    >
      <View style={styles.activityContent}>
        <Text style={styles.activityIcon}>{activity.icon}</Text>
        <Text style={[
          styles.activityName,
          { 
            fontSize: fontSizes.base,
            color: activity.completed ? colors.inputText : '#666'
          }
        ]}>
          {activity.name}
        </Text>
        {activity.completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={colors.background as [string, string, string]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {/* Settings Button */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setShowSettings(true);
              speakText('Abriendo configuraciones');
            }}
            accessibilityLabel="Configuraciones"
            accessibilityRole="button"
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.headerTitle, { fontSize: fontSizes.title }]}>
            KidiQuo
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
              onPress={() => {
                setShowUserMenu(true);
                speakText('Abriendo menú de usuario');
              }}
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
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Languages and Knowledge Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              fontSize: fontSizes.title, 
              color: colors.labelText 
            }]}>
              {currentTexts.languagesAndKnowledge}
            </Text>
            <View style={styles.activitiesGrid}>
              {activities.slice(0, 2).map(renderActivity)}
            </View>
          </View>

          {/* Thoughts Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              fontSize: fontSizes.title, 
              color: colors.labelText 
            }]}>
              {currentTexts.thoughts}
            </Text>
            <View style={styles.activitiesGrid}>
              {activities.slice(2, 6).map(renderActivity)}
            </View>
          </View>
        </ScrollView>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { fontSize: fontSizes.base }]}>
              {currentTexts.progress}
            </Text>
            <Text style={[styles.progressText, { fontSize: fontSizes.base }]}>
              {completedActivities}/{totalActivities}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <View style={styles.progressStars}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Ionicons name="star" size={24} color="#FFD700" />
            </View>
          </View>
        </View>

        {/* Accessibility Menu now managed globally */}

        {/* Settings Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSettings}
          onRequestClose={() => setShowSettings(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
                {currentTexts.settings}
              </Text>
              
              <TouchableOpacity
                style={styles.settingOption}
                onPress={() => {
                  setDarkMode(!darkMode);
                  speakText(`Modo ${darkMode ? 'claro' : 'oscuro'} activado`);
                }}
                accessibilityLabel={`${currentTexts.darkMode}: ${darkMode ? 'Activado' : 'Desactivado'}`}
                accessibilityRole="switch"
                accessibilityState={{ checked: darkMode }}
              >
                <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#333" />
                <Text style={styles.settingText}>{currentTexts.darkMode}</Text>
                <Ionicons 
                  name={darkMode ? "toggle" : "toggle-outline"} 
                  size={24} 
                  color={darkMode ? "#4CAF50" : "#ccc"} 
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSettings(false)}
                accessibilityLabel="Cerrar configuraciones"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* User Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showUserMenu}
          onRequestClose={() => setShowUserMenu(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
                {currentTexts.userProfile}
              </Text>
              
              <TouchableOpacity
                style={styles.userOption}
                accessibilityLabel="Cambiar nombre"
                accessibilityRole="button"
              >
                <Ionicons name="person-outline" size={24} color="#333" />
                <Text style={styles.userOptionText}>{currentTexts.changeName}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userOption}
                accessibilityLabel="Cambiar contraseña"
                accessibilityRole="button"
              >
                <Ionicons name="lock-closed-outline" size={24} color="#333" />
                <Text style={styles.userOptionText}>{currentTexts.changePassword}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userOption}
                accessibilityLabel="Cerrar sesión"
                accessibilityRole="button"
              >
                <Ionicons name="log-out-outline" size={24} color="#f44336" />
                <Text style={[styles.userOptionText, { color: '#f44336' }]}>
                  {currentTexts.logout}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUserMenu(false)}
                accessibilityLabel="Cerrar menú de usuario"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  activityCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    alignItems: 'center',
    position: 'relative',
  },
  activityIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  activityName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -15,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    color: '#666',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9C27B0',
    borderRadius: 5,
  },
  progressStars: {
    flexDirection: 'row',
    gap: 5,
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
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userOptionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
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