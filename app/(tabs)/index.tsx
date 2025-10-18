import { auth } from '@/config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function HomeScreen() {
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
      languages: 'Lenguas',
      scientificThought: 'Saberes y Pensamiento Científico',
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
      languages: 'Languages',
      scientificThought: 'Knowledge and Scientific Thought',
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

  // Por defecto usar español para los textos
  const currentTexts = texts.es;

  const handleLogout = async () => {
    Alert.alert(
      '🚪 Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            }
          }
        }
      ]
    );
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
        <Header
          title="KidiQuo"
          showLanguageToggle={true}
          showProfile={true}
        />

        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Languages Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              fontSize: fontSizes.title, 
              color: colors.labelText 
            }]}>
              {currentTexts.languages}
            </Text>
            <View style={styles.activitiesGrid}>
              {activities.slice(0, 2).map(renderActivity)}
            </View>
          </View>

          {/* Scientific Thought Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              fontSize: fontSizes.title, 
              color: colors.labelText 
            }]}>
              {currentTexts.scientificThought}
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
});