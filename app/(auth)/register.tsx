import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const roles = [
    { label: 'Alumno', value: 'student' },
    { label: 'Maestro', value: 'teacher' }
  ];

  const handleRegister = () => {
    // Aquí implementarías tu lógica de registro
    router.replace('/(tabs)'); // Navega a la página principal después del registro
  };

  const selectRole = (selectedRole: { label: string; value: string }) => {
    setRole(selectedRole.label);
    setShowRoleModal(false);
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

          {/* Título REGISTRARSE */}
          <Text style={styles.title}>REGISTRARSE</Text>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              placeholderTextColor="#A8D5E2"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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

            <Text style={styles.label}>ROL</Text>
            <TouchableOpacity 
              style={styles.roleSelector}
              onPress={() => setShowRoleModal(true)}
            >
              <Text style={styles.roleSelectorText}>
                {role || 'Seleccionar rol'}
              </Text>
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Botón REGISTRARSE */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>REGISTRARSE</Text>
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

      {/* Modal para seleccionar rol */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showRoleModal}
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Rol</Text>
            {roles.map((roleOption, index) => (
              <TouchableOpacity
                key={index}
                style={styles.roleOption}
                onPress={() => selectRole(roleOption)}
              >
                <Text style={styles.roleOptionText}>{roleOption.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRoleModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 80,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  logoKidi: {
    color: '#6BCDDD',
  },
  logoQ: {
    color: '#FFC857',
    fontSize: 50,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFC857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
    letterSpacing: 2,
  },
  formContainer: {
    width: '100%',
    marginBottom: 25,
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
    marginBottom: 15,
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
    marginBottom: 15,
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
  roleSelector: {
    width: '100%',
    height: 50,
    backgroundColor: '#6BCDDD',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  roleSelectorText: {
    fontSize: 16,
    color: 'white',
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
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  roleOption: {
    width: '100%',
    padding: 15,
    backgroundColor: '#6BCDDD',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  roleOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});