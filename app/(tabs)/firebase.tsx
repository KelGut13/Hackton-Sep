// Temporalmente comentado - Firebase no instalado
// import FirebaseTest from '@/components/FirebaseTest';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FirebaseTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase</Text>
      <Text style={styles.subtitle}>Esta sección estará disponible próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
});

// export default FirebaseTest;