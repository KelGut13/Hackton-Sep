import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎓 EduPlay</Text>
        <Text style={styles.subtitle}>Aplicación Educativa Interactiva</Text>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¡Bienvenido! 👋</Text>
          <Text style={styles.cardText}>
            Tu aplicación educativa está funcionando perfectamente.
            Ahora puedes comenzar a desarrollar contenido educativo increíble.
          </Text>
        </View>
        
        {/* Features Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌟 Características</Text>
          <View style={styles.feature}>
            <Text style={styles.featureText}>✅ Funciona en web y móvil</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>✅ Desarrollado con Expo</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>✅ Compatible Android e iOS</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>✅ Responsive design</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>✅ Build APK en progreso</Text>
          </View>
        </View>
        
        {/* Navigation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧭 Navegación</Text>
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>🔍 Explorar</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>📚 Lecciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>🎮 Juegos</Text>
          </TouchableOpacity>
        </View>
        
        {/* Development Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ Información de Desarrollo</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Repositorio:</Text> Hackton-Sep{'\n'}
            <Text style={styles.infoLabel}>Estado:</Text> ✅ Funcional{'\n'}
            <Text style={styles.infoLabel}>Plataforma:</Text> Multiplataforma{'\n'}
            <Text style={styles.infoLabel}>Build Android:</Text> En progreso
          </Text>
        </View>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  feature: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  navButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#374151',
  },
});