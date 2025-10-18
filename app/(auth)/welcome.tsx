import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#5BA9B8', '#87CEBD', '#B8D896']}
      style={styles.container}
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

      {/* Contenido central */}
      <View style={styles.content}>
        {/* Logo KidiQuo con borde */}
        <View style={styles.logoBorder}>
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
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.buttonText}>REGISTRARSE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decoraciones inferiores - Árboles y flores */}
      <View style={styles.decorationBottom}>
        {/* Árbol izquierdo */}
        <View style={[styles.tree, { left: 30 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>
        
        {/* Árbol derecho */}
        <View style={[styles.tree, { right: 30 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Flores */}
        <Text style={[styles.flower, { bottom: 60, left: 180 }]}>🌸</Text>
        <Text style={[styles.flower, { bottom: 40, left: 220 }]}>🌼</Text>
        <Text style={[styles.flower, { bottom: 60, right: 180 }]}>🌸</Text>
        <Text style={[styles.flower, { bottom: 40, right: 220 }]}>🌼</Text>
      </View>

      {/* Confeti decorativo */}
      <Text style={[styles.confetti, { top: 100, left: 30 }]}>🎨</Text>
      <Text style={[styles.confetti, { top: 150, right: 40 }]}>🎨</Text>
      <Text style={[styles.confetti, { top: 200, left: 60 }]}>🌈</Text>
      <Text style={[styles.confetti, { top: 250, right: 50 }]}>🌈</Text>
      <Text style={[styles.confetti, { bottom: 200, left: 20 }]}>⭐</Text>
      <Text style={[styles.confetti, { bottom: 250, right: 30 }]}>⭐</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  logoBorder: {
    borderWidth: 4,
    borderColor: '#4A90A4',
    borderRadius: 20,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 60,
  },
  logoContainer: {
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
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '85%',
    height: 60,
    backgroundColor: '#5BA9D0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  tree: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  treeTop: {
    width: 100,
    height: 100,
    backgroundColor: '#8BC34A',
    borderRadius: 50,
    marginBottom: -10,
  },
  treeTrunk: {
    width: 25,
    height: 50,
    backgroundColor: '#6D4C41',
  },
  flower: {
    position: 'absolute',
    fontSize: 24,
  },
  confetti: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
  },
});
