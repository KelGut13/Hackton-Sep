import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createLesson, getLessons, Lesson } from '../services/database';

/**
 * Componente de ejemplo para probar la conexión con Firebase
 * Muestra cómo obtener y crear lecciones en Firestore
 */
export default function FirebaseTest() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lecciones al montar el componente
  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLessons();
      setLessons(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar lecciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSampleLesson = async () => {
    try {
      setLoading(true);
      const newLesson: Omit<Lesson, 'id'> = {
        title: 'Lección de prueba',
        description: 'Esta es una lección de ejemplo',
        content: 'Contenido de la lección',
        difficulty: 'easy',
        createdAt: new Date()
      };
      
      await createLesson(newLesson);
      await loadLessons(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al crear lección');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && lessons.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Conectando con Firebase...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Firebase Test</Text>
        <Text style={styles.subtitle}>Estado de conexión: ✅ Conectado</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Error: {error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={addSampleLesson}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creando...' : '➕ Crear Lección de Prueba'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={loadLessons}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : '🔄 Recargar Lecciones'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Lecciones en Firebase ({lessons.length})
        </Text>
        
        {lessons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay lecciones todavía.{'\n'}
              Presiona el botón de arriba para crear una.
            </Text>
          </View>
        ) : (
          lessons.map((lesson) => (
            <View key={lesson.id} style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
              <View style={styles.lessonMeta}>
                <Text style={styles.difficultyBadge}>
                  {lesson.difficulty === 'easy' ? '🟢 Fácil' : 
                   lesson.difficulty === 'medium' ? '🟡 Media' : '🔴 Difícil'}
                </Text>
                <Text style={styles.lessonDate}>
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>✅ Firebase Configurado</Text>
        <Text style={styles.infoText}>
          • Proyecto: kidiquo{'\n'}
          • Base de datos: Firestore{'\n'}
          • Estado: Conectado{'\n'}
          • Colecciones disponibles: users, lessons, userProgress
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  lessonDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 22,
  },
});