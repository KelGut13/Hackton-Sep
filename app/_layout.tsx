import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AccessibilitySystem from '../components/AccessibilitySystem';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AccessibilityProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="activities" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="test" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
            {/* Sistema de accesibilidad global */}
            <AccessibilitySystem />
          </ThemeProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
