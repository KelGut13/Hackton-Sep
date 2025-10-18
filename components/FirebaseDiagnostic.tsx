import { auth, db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
}

/**
 * Componente de diagnóstico para verificar la conexión con Firebase
 */
export default function FirebaseDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnostics: DiagnosticResult[] = [];

    // 1. Verificar configuración de Firebase
    try {
      if (db && auth) {
        diagnostics.push({
          name: 'Configuración Firebase',
          status: 'success',
          message: 'Firebase inicializado correctamente',
          details: `Proyecto: ${db.app.options.projectId}`
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'Configuración Firebase',
        status: 'error',
        message: 'Error al inicializar Firebase',
        details: error.message
      });
    }

    // 2. Verificar conexión a Firestore
    try {
      const testCollection = collection(db, 'roles');
      diagnostics.push({
        name: 'Conexión Firestore',
        status: 'success',
        message: 'Conexión establecida con Firestore'
      });
    } catch (error: any) {
      diagnostics.push({
        name: 'Conexión Firestore',
        status: 'error',
        message: 'No se pudo conectar a Firestore',
        details: error.message
      });
    }

    // 3. Verificar permisos de lectura en colección roles
    try {
      const rolesSnapshot = await getDocs(collection(db, 'roles'));
      if (rolesSnapshot.empty) {
        diagnostics.push({
          name: 'Colección Roles',
          status: 'warning',
          message: 'La colección "roles" está vacía',
          details: 'Necesitas inicializar los roles. Ve a la pestaña Firebase y presiona "Inicializar Roles".'
        });
      } else {
        diagnostics.push({
          name: 'Colección Roles',
          status: 'success',
          message: `${rolesSnapshot.size} rol(es) encontrado(s)`,
          details: rolesSnapshot.docs.map(doc => doc.data().name).join(', ')
        });
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        diagnostics.push({
          name: 'Colección Roles',
          status: 'error',
          message: 'Permisos insuficientes',
          details: 'Las reglas de Firestore están bloqueando el acceso. Consulta CONFIGURAR_FIREBASE_REGLAS.md'
        });
      } else {
        diagnostics.push({
          name: 'Colección Roles',
          status: 'error',
          message: 'Error al leer roles',
          details: error.message
        });
      }
    }

    // 4. Verificar Authentication
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        diagnostics.push({
          name: 'Firebase Auth',
          status: 'success',
          message: 'Usuario autenticado',
          details: `Email: ${currentUser.email}`
        });
      } else {
        diagnostics.push({
          name: 'Firebase Auth',
          status: 'warning',
          message: 'No hay usuario autenticado',
          details: 'Esto es normal si no has iniciado sesión'
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'Firebase Auth',
        status: 'error',
        message: 'Error en Authentication',
        details: error.message
      });
    }

    setResults(diagnostics);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Diagnóstico Firebase</Text>
        <Text style={styles.subtitle}>
          Verifica la conexión y configuración de Firebase
        </Text>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={runDiagnostics}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.refreshButtonText}>🔄 Ejecutar Diagnóstico</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View
            key={index}
            style={[
              styles.resultCard,
              { borderLeftColor: getStatusColor(result.status) }
            ]}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>{getStatusIcon(result.status)}</Text>
              <Text style={styles.resultName}>{result.name}</Text>
            </View>
            <Text style={styles.resultMessage}>{result.message}</Text>
            {result.details && (
              <Text style={styles.resultDetails}>{result.details}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📝 ¿Qué hacer si hay errores?</Text>
        <Text style={styles.infoText}>
          1. Si ves "Permisos insuficientes":{'\n'}
          {' '.repeat(3)}→ Configura las reglas de Firestore (ver CONFIGURAR_FIREBASE_REGLAS.md)
        </Text>
        <Text style={styles.infoText}>
          2. Si la colección "roles" está vacía:{'\n'}
          {' '.repeat(3)}→ Ve a la pestaña Firebase y presiona "Inicializar Roles"
        </Text>
        <Text style={styles.infoText}>
          3. Si hay errores de conexión:{'\n'}
          {' '.repeat(3)}→ Verifica tu conexión a internet
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultDetails: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  infoBox: {
    margin: 20,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
});
