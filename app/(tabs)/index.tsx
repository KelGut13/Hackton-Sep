import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
import Header from '../../components/Header';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getUserStats, type ActivityProgress } from '../../services/database';

export default function HomeScreen() {
  const [completedActivities, setCompletedActivities] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [userActivities, setUserActivities] = useState<ActivityProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const totalActivities = 12;
  
  // Contexto de accesibilidad y idioma
  const { getAccessibleColors, getFontSize, speakText } = useAccessibility();
  const { currentTexts } = useLanguage();
  
  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  // Definición de todas las actividades de la app
  const allActivities = [
    { id: 'geosopa', name: currentTexts.geoSopa, icon: '🌍', category: 'geography' },
    { id: 'puntogo', name: currentTexts.puntoGo, icon: '🎯', category: 'logic' },
    { id: 'matematico', name: currentTexts.matematico, icon: '🔢', category: 'math' },
    { id: 'activity4', name: 'Actividad 4', icon: '📚', category: 'reading' },
    { id: 'activity5', name: 'Actividad 5', icon: '🎨', category: 'art' },
    { id: 'activity6', name: 'Actividad 6', icon: '🔬', category: 'science' },
    { id: 'activity7', name: 'Actividad 7', icon: '🎵', category: 'music' },
    { id: 'activity8', name: 'Actividad 8', icon: '⚽', category: 'sports' },
    { id: 'activity9', name: 'Actividad 9', icon: '🌳', category: 'nature' },
    { id: 'activity10', name: 'Actividad 10', icon: '💡', category: 'creativity' },
    { id: 'activity11', name: 'Actividad 11', icon: '🚀', category: 'technology' },
    { id: 'activity12', name: 'Actividad 12', icon: '🏆', category: 'challenge' }
  ];

  // Cargar progreso del usuario
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (user) {
        const stats = await getUserStats(user.uid);
        setCompletedActivities(stats.completedActivities);
        setProgressPercentage(stats.progress);
        setUserActivities(stats.activities);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si una actividad está completada
  const isActivityCompleted = (activityId: string): boolean => {
    return userActivities.some(a => a.activityId === activityId && a.completed);
  };

  // Combinar actividades con su estado de completado
  const activities = allActivities.map(activity => ({
    ...activity,
    completed: isActivityCompleted(activity.id)
  }));

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

  if (loading) {
    return (
      <LinearGradient
        colors={colors.background as [string, string, string]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Header
            title="KidiQuo"
            showLanguageToggle={true}
            showProfile={true}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando tu progreso...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              {activities.slice(1, 2).map(renderActivity)}
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
              {[activities[0], ...activities.slice(2, 6)].map(renderActivity)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
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