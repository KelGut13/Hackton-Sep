import { initializeDefaultRoles } from '@/services/database';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Componente para inicializar roles en Firebase
 * Este componente solo debe usarse UNA VEZ para crear los roles por defecto
 */
export default function InitRoles() {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const handleInitRoles = async () => {
    try {
      setLoading(true);
      await initializeDefaultRoles();
      setInitialized(true);
      Alert.alert(
        '✅ Éxito',
        'Los roles se han inicializado correctamente en Firebase.\n\nRoles creados:\n• Alumno\n• Maestro',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        '❌ Error',
        error.message || 'No se pudieron inicializar los roles. Por favor intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Inicialización de Roles</Text>
      <Text style={styles.description}>
        Presiona el botón para crear los roles por defecto en Firebase.
      </Text>
      <Text style={styles.warning}>
        ⚠️ Este proceso solo debe ejecutarse UNA VEZ
      </Text>

      <TouchableOpacity
        style={[styles.button, initialized && styles.buttonDisabled]}
        onPress={handleInitRoles}
        disabled={loading || initialized}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {initialized ? '✅ Roles Inicializados' : 'Inicializar Roles'}
          </Text>
        )}
      </TouchableOpacity>

      {initialized && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            ✅ Roles creados exitosamente en Firebase
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#C8E6C9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
