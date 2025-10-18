import { auth } from '@/config/firebase';
import { createUser, getRoles, type Role } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  
  // Estados para accesibilidad
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Cargar roles desde Firebase
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
        if (screenReaderEnabled) {
          Speech.speak(`${fetchedRoles.length} roles disponibles`);
        }
      } catch (error) {
        console.error('Error cargando roles:', error);
        Alert.alert('Error', 'No se pudieron cargar los roles. Por favor intenta de nuevo.');
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const handleRegister = async () => {
    // Validar campos
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      if (screenReaderEnabled) Speech.speak('Error: Ingresa tu nombre');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      if (screenReaderEnabled) Speech.speak('Error: Ingresa tu correo electrónico');
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      if (screenReaderEnabled) Speech.speak('Error: La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona un rol');
      if (screenReaderEnabled) Speech.speak('Error: Selecciona un rol');
      return;
    }

    try {
      setLoading(true);
      if (screenReaderEnabled) {
        Speech.speak("Registrando usuario, por favor espera");
      }

      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // 2. Guardar datos adicionales en Firestore
      await createUser({
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

      // 3. Éxito - navegar a la app
      if (screenReaderEnabled) {
        Speech.speak('Usuario registrado exitosamente. Bienvenido a EduPlay');
      }
      
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
      
      // Mensajes de error personalizados
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      Alert.alert('Error de Registro', errorMessage);
      if (screenReaderEnabled) {
        Speech.speak(`Error: ${errorMessage}`);
      }
    }
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    if (screenReaderEnabled) {
      Speech.speak(`Rol seleccionado: ${role.name}`);
    }
  };

  // Función para leer texto en voz alta
  const speakText = (text: string) => {
    if (screenReaderEnabled) {
      Speech.speak(text, {
        language: 'es-ES', // Español
        pitch: 1.0,
        rate: 0.8, // Velocidad más lenta para mejor comprensión
      });
    }
  };

  // Detectar si el lector de pantalla del sistema está activo
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.log('Error checking screen reader:', error);
      }
    };
    
    checkScreenReader();
    
    // Listener para cambios en el lector de pantalla
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  // Leer cuando se abra el menú de accesibilidad
  useEffect(() => {
    if (showAccessibilityMenu && screenReaderEnabled) {
      speakText("Menú de opciones de accesibilidad abierto. Aquí puedes configurar alto contraste, modo daltónico, lector de pantalla y tamaño de texto.");
    }
  }, [showAccessibilityMenu]);

  // Funciones de accesibilidad
  const getAccessibleColors = () => {
    if (highContrast) {
      return {
        background: ['#000000', '#1a1a1a', '#333333'],
        inputBg: '#FFFFFF',
        inputText: '#000000',
        buttonBg: '#FFFFFF',
        buttonText: '#000000',
        labelText: '#FFFFFF'
      };
    }
    if (colorBlindMode) {
      return {
        background: ['#4A90E2', '#7BB3F0', '#A8D5F2'], // Colores amigables para daltónicos
        inputBg: '#E8F4FD',
        inputText: '#2C5282',
        buttonBg: '#2C5282',
        buttonText: '#FFFFFF',
        labelText: '#FFFFFF'
      };
    }
    return {
      background: ['#5BA9B8', '#87CEBD', '#B8D896'],
      inputBg: '#6BCDDD',
      inputText: 'white',
      buttonBg: '#5BA9D0',
      buttonText: 'white',
      labelText: 'white'
    };
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return { base: 14, title: 20, button: 16, label: 12 };
      case 'large': return { base: 20, title: 32, button: 24, label: 18 };
      default: return { base: 16, title: 24, button: 20, label: 14 };
    }
  };

  const colors = getAccessibleColors();
  const fontSizes = getFontSize();

  return (
    <LinearGradient
      colors={colors.background as [string, string, string]}
      style={styles.container}
    >
      {/* Botón de accesibilidad flotante */}
      <TouchableOpacity 
        style={styles.accessibilityButton}
        onPress={() => setShowAccessibilityMenu(true)}
        accessibilityLabel="Abrir menú de accesibilidad"
        accessibilityHint="Abre las opciones de accesibilidad como alto contraste y modo daltónico"
        accessibilityRole="button"
      >
        <Ionicons name="accessibility" size={24} color="white" />
      </TouchableOpacity>
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
              placeholderTextColor={highContrast ? "#666666" : "#A8D5E2"}
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
              placeholderTextColor={highContrast ? "#666666" : "#A8D5E2"}
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
                placeholderTextColor={highContrast ? "#666666" : "#A8D5E2"}
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

      {/* Modal de accesibilidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAccessibilityMenu}
        onRequestClose={() => setShowAccessibilityMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 400 }]}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>Opciones de Accesibilidad</Text>
            
            {/* Alto contraste */}
            <TouchableOpacity
              style={[styles.accessibilityOption, highContrast && styles.selectedOption]}
              onPress={() => {
                setHighContrast(!highContrast);
                speakText(highContrast ? "Alto contraste desactivado" : "Alto contraste activado");
              }}
              accessibilityLabel={`Alto contraste: ${highContrast ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Cambia a colores de alto contraste para mejor visibilidad"
              accessibilityRole="switch"
              accessibilityState={{ checked: highContrast }}
            >
              <Ionicons name="contrast" size={24} color={highContrast ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: highContrast ? "white" : "#333" }]}>
                Alto Contraste
              </Text>
              <Ionicons 
                name={highContrast ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={highContrast ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Modo daltónico */}
            <TouchableOpacity
              style={[styles.accessibilityOption, colorBlindMode && styles.selectedOption]}
              onPress={() => {
                setColorBlindMode(!colorBlindMode);
                speakText(colorBlindMode ? "Modo daltónico desactivado" : "Modo daltónico activado");
              }}
              accessibilityLabel={`Modo daltónico: ${colorBlindMode ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Activa colores amigables para personas con daltonismo"
              accessibilityRole="switch"
              accessibilityState={{ checked: colorBlindMode }}
            >
              <Ionicons name="eye" size={24} color={colorBlindMode ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: colorBlindMode ? "white" : "#333" }]}>
                Modo Daltónico
              </Text>
              <Ionicons 
                name={colorBlindMode ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={colorBlindMode ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Lector de pantalla */}
            <TouchableOpacity
              style={[styles.accessibilityOption, screenReaderEnabled && styles.selectedOption]}
              onPress={() => {
                const newState = !screenReaderEnabled;
                setScreenReaderEnabled(newState);
                if (newState) {
                  Speech.speak("Lector de pantalla activado. Los elementos serán leídos en voz alta.");
                } else {
                  Speech.speak("Lector de pantalla desactivado");
                }
              }}
              accessibilityLabel={`Lector de pantalla: ${screenReaderEnabled ? 'Activado' : 'Desactivado'}`}
              accessibilityHint="Activa la lectura en voz alta de los elementos de la pantalla"
              accessibilityRole="switch"
              accessibilityState={{ checked: screenReaderEnabled }}
            >
              <Ionicons name="volume-high" size={24} color={screenReaderEnabled ? "white" : "#333"} />
              <Text style={[styles.accessibilityOptionText, { color: screenReaderEnabled ? "white" : "#333" }]}>
                Lector de Pantalla
              </Text>
              <Ionicons 
                name={screenReaderEnabled ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={screenReaderEnabled ? "white" : "#333"} 
              />
            </TouchableOpacity>

            {/* Tamaño de fuente */}
            <View style={styles.fontSizeContainer}>
              <Text style={[styles.accessibilityLabel, { fontSize: fontSizes.base }]}>Tamaño de Texto:</Text>
              <View style={styles.fontSizeButtons}>
                {['small', 'normal', 'large'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontSizeButton, 
                      fontSize === size && styles.selectedFontButton
                    ]}
                    onPress={() => setFontSize(size)}
                    accessibilityLabel={`Tamaño de texto: ${size === 'small' ? 'Pequeño' : size === 'normal' ? 'Normal' : 'Grande'}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: fontSize === size }}
                  >
                    <Text style={[
                      styles.fontSizeButtonText, 
                      fontSize === size && styles.selectedFontButtonText,
                      { fontSize: size === 'small' ? 12 : size === 'large' ? 20 : 16 }
                    ]}>
                      {size === 'small' ? 'A' : size === 'normal' ? 'A' : 'A'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAccessibilityMenu(false);
                speakText("Menú de accesibilidad cerrado");
              }}
              accessibilityLabel="Cerrar menú de accesibilidad"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>

            {/* Botón para detener la voz */}
            {screenReaderEnabled && (
              <TouchableOpacity
                style={[styles.accessibilityOption, { backgroundColor: '#ff6b6b' }]}
                onPress={() => Speech.stop()}
                accessibilityLabel="Detener lectura en voz alta"
                accessibilityHint="Detiene la lectura actual del lector de pantalla"
                accessibilityRole="button"
              >
                <Ionicons name="stop" size={24} color="white" />
                <Text style={[styles.accessibilityOptionText, { color: 'white' }]}>
                  Detener Voz
                </Text>
                <Ionicons name="stop-circle" size={24} color="white" />
              </TouchableOpacity>
            )}
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
  // Estilos de accesibilidad
  accessibilityButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  accessibilityOption: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  accessibilityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
  accessibilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fontSizeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFontButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#2C5AA0',
  },
  fontSizeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedFontButtonText: {
    color: 'white',
  },
});