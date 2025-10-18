import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige automáticamente a la pantalla de bienvenida cuando se inicia la app
  return <Redirect href="/(auth)/welcome" />;
}
