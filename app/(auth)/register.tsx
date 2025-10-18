import { auth } from '@/config/firebase';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { createUser, getRoles, type Role } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  
  // Usar el contexto de accesibilidad global
  const { 
    getAccessibleColors, 
    getFontSize, 
    speakText,
    screenReaderEnabled,
    highContrast,
    colorBlindMode,
    fontSize
  } = useAccessibility();

  // Cargar roles desde Firebase
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const fetchedRoles = await getRoles();
        
        // Si Firebase retorna roles, usarlos
        if (fetchedRoles && fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
          speakText(`${fetchedRoles.length} roles disponibles`);
        } else {
          // Si no hay roles en Firebase, usar roles temporales
          console.warn('No hay roles en Firebase, usando roles temporales');
          setRolesTemporales();
        }
      } catch (error: any) {
        console.error('Error cargando roles:', error);
        
        // Cualquier error: usar roles temporales
        setRolesTemporales();
        
        // Solo mostrar alerta si es error de permisos
        if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
          Alert.alert(
            '⚠️ Usando Roles Temporales',
            'Los roles no están configurados en Firebase.\n\n' +
            'Para solución permanente:\n' +
            '1. Ve a la pestaña "Firebase"\n' +
            '2. Presiona "Inicializar Roles"',
            [{ text: 'Entendido' }]
          );
        }
      } finally {
        setLoadingRoles(false);
      }
    };

    const setRolesTemporales = () => {
      const rolesTemp = [
        {
          id: 'temp-student',
          name: 'Alumno',
          value: 'student',
          description: 'Usuario que realiza actividades y aprende',
          permissions: ['view_lessons', 'complete_activities', 'view_progress'],
          createdAt: new Date()
        },
        {
          id: 'temp-teacher',
          name: 'Maestro',
          value: 'teacher',
          description: 'Usuario que crea y gestiona lecciones',
          permissions: ['view_lessons', 'create_lessons', 'edit_lessons', 'view_student_progress'],
          createdAt: new Date()
        }
      ];
      setRoles(rolesTemp);
      speakText('Usando roles temporales: Alumno y Maestro');
    };

    loadRoles();
  }, []);

  const handleRegister = async () => {
    // Validar campos
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      speakText('Error: Ingresa tu nombre');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      speakText('Error: Ingresa tu correo electrónico');
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      speakText('Error: La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona un rol');
      speakText('Error: Selecciona un rol');
      return;
    }

    try {
      setLoading(true);
      speakText("Registrando usuario, por favor espera");

      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      console.log('🔐 Usuario creado en Authentication:', userId);
      console.log('👤 Rol seleccionado:', selectedRole.name, '(ID:', selectedRole.id, ')');

      // 2. Guardar datos adicionales en Firestore
      await createUser(userId, {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date(),
        progress: 0,
        roleId: selectedRole.id!, // Guardar el ID del rol
        accessibilityPreferences: {
          highContrast,
          colorBlindMode,
          fontSize,
          screenReaderEnabled
        }
      });

      console.log('✅ Datos guardados en Firestore con roleId:', selectedRole.id);

      // 3. Éxito - navegar a la app
      speakText('Usuario registrado exitosamente. Bienvenido a EduPlay');
      
      Alert.alert(
        'Registro exitoso',
        '¡Bienvenido a EduPlay!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );

    } catch (error: any) {
      setLoading(false);
      console.error('Error en registro:', error);
      
      let errorMessage = 'Hubo un error al registrar el usuario';
      let errorTitle = 'Error de Registro';
      
      // Mensajes de error personalizados
      if (error.code === 'auth/configuration-not-found') {
        errorTitle = '⚠️ Authentication No Configurado';
        errorMessage = 'Firebase Authentication no está habilitado.\n\n' +
          '📋 Pasos para solucionar:\n' +
          '1. Ve a Firebase Console\n' +
          '2. Abre "Authentication"\n' +
          '3. Habilita "Email/Password"\n' +
          '4. Guarda los cambios\n\n' +
          'Ver: SOLUCION_AUTH_NOT_CONFIGURED.md';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres)';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
      speakText(`Error: ${errorMessage}`);
    }
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    speakText(`Rol seleccionado: ${role.name}`);
  };

  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  return (
    <LinearGradient
      colors={colors.background as [string, string, string]}
      style={styles.container}
    >
      {/* Botón de accesibilidad ahora manejado globalmente */}
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
          <Text 
            style={[styles.title, { 
              color: colors.labelText, 
              fontSize: fontSizes.title 
            }]}
            accessibilityRole="header"
          >
            REGISTRARSE
          </Text>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: colors.labelText, fontSize: fontSizes.label }]}>NOMBRE</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBg, 
                color: colors.inputText,
                fontSize: fontSizes.base 
              }]}
              placeholder="Nombre Completo"
              placeholderTextColor={highContrast ? "#666666" : "#FFFFFF"}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              accessibilityLabel="Campo de nombre completo"
              accessibilityHint="Ingresa tu nombre completo"
              accessibilityRole="text"
              onFocus={() => speakText("Campo de nombre completo")}
            />

            <Text style={[styles.label, { color: colors.labelText, fontSize: fontSizes.label }]}>CORREO</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBg, 
                color: colors.inputText,
                fontSize: fontSizes.base 
              }]}
              placeholder="Correo Electronico"
              placeholderTextColor={highContrast ? "#666666" : "#FFFFFF"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Campo de correo electrónico"
              accessibilityHint="Ingresa tu dirección de correo electrónico"
              accessibilityRole="text"
              onFocus={() => speakText("Campo de correo electrónico")}
            />
            
            <Text style={[styles.label, { color: colors.labelText, fontSize: fontSizes.label }]}>CONTRASEÑA</Text>
            <View style={[styles.passwordContainer, { backgroundColor: colors.inputBg }]}>
              <TextInput
                style={[styles.passwordInput, { 
                  color: colors.inputText,
                  fontSize: fontSizes.base 
                }]}
                placeholder="Contraseña"
                placeholderTextColor={highContrast ? "#666666" : "#FFFFFF"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                accessibilityLabel="Campo de contraseña"
                accessibilityHint="Ingresa tu contraseña"
                accessibilityRole="text"
                onFocus={() => speakText("Campo de contraseña")}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                accessibilityHint={showPassword ? "Toca para ocultar la contraseña" : "Toca para mostrar la contraseña"}
                accessibilityRole="button"
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color={colors.inputText} 
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.labelText, fontSize: fontSizes.label }]}>ROL</Text>
            <TouchableOpacity 
              style={[styles.roleSelector, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                if (loadingRoles) {
                  Alert.alert('Cargando', 'Espera mientras se cargan los roles');
                  return;
                }
                setShowRoleModal(true);
                speakText("Abriendo selector de rol");
              }}
              accessibilityLabel="Selector de rol"
              accessibilityHint={`Rol actual: ${selectedRole?.name || 'Ninguno seleccionado'}. Toca para cambiar`}
              accessibilityRole="button"
              disabled={loadingRoles}
            >
              {loadingRoles ? (
                <ActivityIndicator size="small" color={colors.inputText} />
              ) : (
                <Text style={[styles.roleSelectorText, { 
                  color: colors.inputText,
                  fontSize: fontSizes.base 
                }]}>
                  {selectedRole?.name || 'Seleccionar rol'}
                </Text>
              )}
              <Ionicons name="chevron-down" size={24} color={colors.inputText} />
            </TouchableOpacity>
          </View>

          {/* Botón REGISTRARSE */}
          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: colors.buttonBg,
              opacity: loading ? 0.7 : 1
            }]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityLabel="Botón de registrarse"
            accessibilityHint="Toca para crear tu cuenta con la información ingresada"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} size="small" />
            ) : (
              <Text style={[styles.buttonText, { 
                color: colors.buttonText,
                fontSize: fontSizes.button 
              }]}>
                REGISTRARSE
              </Text>
            )}
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
            {loadingRoles ? (
              <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />
            ) : roles.length === 0 ? (
              <Text style={styles.roleOptionText}>No hay roles disponibles</Text>
            ) : (
              roles.map((roleOption) => (
                <TouchableOpacity
                  key={roleOption.id}
                  style={[
                    styles.roleOption,
                    selectedRole?.id === roleOption.id && styles.roleOptionSelected
                  ]}
                  onPress={() => selectRole(roleOption)}
                  accessibilityLabel={`Seleccionar rol: ${roleOption.name}`}
                  accessibilityHint={roleOption.description}
                  accessibilityRole="button"
                >
                  <Text style={styles.roleOptionText}>{roleOption.name}</Text>
                  {roleOption.description && (
                    <Text style={styles.roleDescription}>{roleOption.description}</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRoleModal(false)}
              accessibilityLabel="Cancelar selección de rol"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de accesibilidad ahora manejado globalmente */}

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
  roleOptionSelected: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  roleOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
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