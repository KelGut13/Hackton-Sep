import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { usePlatform } from '../../hooks/use-platform';

interface WebLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ 
  children, 
  title = 'EduPlay',
  description = 'Aplicación Educativa'
}) => {
  const { isWeb, isDesktop } = usePlatform();

  if (!isWeb) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Header específico para web */}
      <View style={styles.webHeader}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      
      {/* Contenido principal */}
      <View style={[styles.content, isDesktop && styles.desktopContent]}>
        {children}
      </View>
      
      {/* Footer específico para web */}
      <View style={styles.webFooter}>
        <Text style={styles.footerText}>
          © 2025 EduPlay - Desarrollado con Expo
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  } as ViewStyle,
  desktopContainer: {
    minHeight: '100%',
  } as ViewStyle,
  webHeader: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  } as ViewStyle,
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  } as TextStyle,
  description: {
    fontSize: 18,
    color: '#e0e7ff',
  } as TextStyle,
  content: {
    flex: 1,
    padding: 20,
  } as ViewStyle,
  desktopContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  } as ViewStyle,
  webFooter: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  } as ViewStyle,
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  } as TextStyle,
});

export default WebLayout;