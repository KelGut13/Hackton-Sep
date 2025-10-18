import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Aquí implementarías tu lógica de login
    router.replace('/(tabs)'); // Navega a la página principal después del login
  };

  return (
    <LinearGradient
      colors={['#5BA9B8', '#87CEBD', '#B8D896']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Decoraciones superiores - Nubes y estrellas */}
        <View style={styles.decorationTop}>
          <View style={styles.cloudLeft}>
            <View style={[styles.cloudCircle, styles.cloudCircle1]} />
            <View style={[styles.cloudCircle, styles.cloudCircle2]} />
            <View style={[styles.cloudCircle, styles.cloudCircle3]} />
          </View>
          <View style={styles.cloudRight}>
            <View style={[styles.cloudCircle, styles.cloudCircle1]} />
            <View style={[styles.cloudCircle, styles.cloudCircle2]} />
            <View style={[styles.cloudCircle, styles.cloudCircle3]} />
          </View>
          <Text style={[styles.star, { top: 20, left: 80 }]}>⭐</Text>
          <Text style={[styles.star, { top: 30, right: 100 }]}>⭐</Text>
          <Text style={[styles.star, { top: 50, left: 30 }]}>🌟</Text>
          <Text style={[styles.star, { top: 40, right: 50 }]}>🌟</Text>
        </View>

        {/* Logo KidiQuo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoKidi}>Kidi</Text>
            <Text style={styles.logoQ}>Q</Text>
            <Text style={styles.logoUo}>uo</Text>
          </Text>
          <View style={styles.magnifyingGlass}>
            <View style={styles.magnifyingCircle}>
              <Text style={styles.smiley}>😊</Text>
            </View>
          </View>
        </View>

        {/* Título INGRESAR */}
        <Text style={styles.title}>INGRESAR</Text>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>CORREO</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electronico"
            placeholderTextColor="#A8D5E2"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>CONTRASEÑA</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#A8D5E2"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón INGRESAR */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>

        {/* Decoraciones inferiores - Árboles y flores */}
        <View style={styles.decorationBottom}>
          {/* Árbol izquierdo */}
          <View style={[styles.tree, { left: 20 }]}>
            <View style={styles.treeTop} />
            <View style={styles.treeTrunk} />
          </View>
          
          {/* Árbol derecho */}
          <View style={[styles.tree, { right: 20 }]}>
            <View style={styles.treeTop} />
            <View style={styles.treeTrunk} />
          </View>

          {/* Flores */}
          <Text style={[styles.flower, { bottom: 100, left: 150 }]}>🌸</Text>
          <Text style={[styles.flower, { bottom: 80, left: 200 }]}>🌼</Text>
          <Text style={[styles.flower, { bottom: 100, right: 150 }]}>🌸</Text>
          <Text style={[styles.flower, { bottom: 80, right: 200 }]}>🌼</Text>
        </View>

        {/* Confeti decorativo */}
        <Text style={[styles.confetti, { top: 100, left: 50 }]}>🎨</Text>
        <Text style={[styles.confetti, { top: 150, right: 60 }]}>🎨</Text>
        <Text style={[styles.confetti, { top: 200, left: 80 }]}>🌈</Text>
        <Text style={[styles.confetti, { top: 250, right: 70 }]}>🌈</Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  decorationTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  cloudLeft: {
    position: 'absolute',
    top: 40,
    left: 30,
    flexDirection: 'row',
  },
  cloudRight: {
    position: 'absolute',
    top: 50,
    right: 30,
    flexDirection: 'row',
  },
  cloudCircle: {
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
  },
  cloudCircle1: {
    width: 60,
    height: 60,
    left: 0,
    top: 10,
  },
  cloudCircle2: {
    width: 50,
    height: 50,
    left: 40,
    top: 0,
  },
  cloudCircle3: {
    width: 40,
    height: 40,
    left: 70,
    top: 15,
  },
  star: {
    position: 'absolute',
    fontSize: 16,
  },
  logoContainer: {
    marginTop: 100,
    marginBottom: 30,
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: 56,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  logoKidi: {
    color: '#6BCDDD',
  },
  logoQ: {
    color: '#FFC857',
    fontSize: 58,
  },
  logoUo: {
    color: '#FFC857',
  },
  magnifyingGlass: {
    position: 'absolute',
    right: -10,
    top: 0,
  },
  magnifyingCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    letterSpacing: 2,
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#6BCDDD',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: 'white',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#6BCDDD',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'white',
  },
  eyeIcon: {
    padding: 5,
    marginLeft: 10,
  },
  button: {
    width: '80%',
    height: 55,
    backgroundColor: '#5BA9D0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  tree: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  treeTop: {
    width: 80,
    height: 80,
    backgroundColor: '#8BC34A',
    borderRadius: 40,
    marginBottom: -10,
  },
  treeTrunk: {
    width: 20,
    height: 40,
    backgroundColor: '#6D4C41',
  },
  flower: {
    position: 'absolute',
    fontSize: 20,
  },
  confetti: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
  },
});