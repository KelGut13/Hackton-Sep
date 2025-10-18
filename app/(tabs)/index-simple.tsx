import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎓 EduPlay</Text>
        <Text style={styles.subtitle}>Aplicación Educativa</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¡Bienvenido!</Text>
          <Text style={styles.cardText}>
            Tu aplicación EduPlay está funcionando correctamente.
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌟 Características</Text>
          <Text style={styles.cardText}>
            • Funciona en web y móvil{'\n'}
            • Desarrollado con Expo{'\n'}
            • Compatible con Android e iOS{'\n'}
            • Responsive design
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚀 Próximos pasos</Text>
          <Text style={styles.cardText}>
            Ahora puedes personalizar tu aplicación educativa
            y añadir el contenido que necesites.
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
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});