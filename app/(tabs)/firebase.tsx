import FirebaseDiagnostic from '@/components/FirebaseDiagnostic';
import InitRoles from '@/components/InitRoles';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FirebaseTab() {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'init'>('diagnostic');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'diagnostic' && styles.activeTab]}
          onPress={() => setActiveTab('diagnostic')}
        >
          <Text style={[styles.tabText, activeTab === 'diagnostic' && styles.activeTabText]}>
            🔍 Diagnóstico
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'init' && styles.activeTab]}
          onPress={() => setActiveTab('init')}
        >
          <Text style={[styles.tabText, activeTab === 'init' && styles.activeTabText]}>
            🔧 Inicializar Roles
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'diagnostic' ? <FirebaseDiagnostic /> : <InitRoles />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
  },
});