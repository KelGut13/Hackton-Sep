import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import AccessibilitySystem from '../components/AccessibilitySystem';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AccessibilityProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="test" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
        {/* Sistema de accesibilidad global */}
        <AccessibilitySystem />
      </ThemeProvider>
    </AccessibilityProvider>
  );
}
