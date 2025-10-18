import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { updateUser } from '../services/database';

interface HeaderProps {
  title: string;
  showLanguageToggle?: boolean;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  showLanguageToggle = true, 
  showProfile = true 
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Estados para cambiar nombre y contraseña
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { getFontSize, speakText } = useAccessibility();
  const { currentLanguage, toggleLanguage, currentTexts } = useLanguage();
  const fontSizes = getFontSize();

  const handleSettingsPress = () => {
    setShowSettings(true);
    speakText('Abriendo configuraciones');
  };

  const handleProfilePress = () => {
    setShowUserMenu(true);
    speakText('Abriendo menú de usuario');
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    speakText(`Idioma cambiado a ${currentLanguage === 'es' ? 'inglés' : 'español'}`);
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'No hay un usuario autenticado');
        return;
      }

      // Actualizar nombre en Firebase Auth
      await updateProfile(user, {
        displayName: newName.trim()
      });

      // Actualizar nombre en Firestore (se creará si no existe)
      await updateUser(user.uid, { 
        name: newName.trim(),
        email: user.email || ''
      });

      Alert.alert('✅ Éxito', 'Tu nombre ha sido actualizado correctamente');
      speakText('Nombre actualizado exitosamente');
      setShowChangeNameModal(false);
      setNewName('');
    } catch (error: any) {
      console.error('Error al cambiar nombre:', error);
      
      let errorMessage = 'No se pudo actualizar el nombre. Intenta de nuevo.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'No tienes permiso para actualizar tu perfil. Contacta al administrador.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (user && user.email) {
        // Reautenticar al usuario antes de cambiar la contraseña
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Cambiar la contraseña
        await updatePassword(user, newPassword);

        Alert.alert('✅ Éxito', 'Tu contraseña ha sido actualizada correctamente');
        speakText('Contraseña actualizada exitosamente');
        setShowChangePasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      let errorMessage = 'No se pudo actualizar la contraseña. Intenta de nuevo.';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'La contraseña actual es incorrecta';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Por seguridad, debes cerrar sesión y volver a iniciar antes de cambiar tu contraseña';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      currentTexts.logout,
      currentTexts.logoutConfirm,
      [
        {
          text: currentTexts.cancel,
          style: 'cancel'
        },
        {
          text: currentTexts.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              setShowUserMenu(false);
              speakText('Sesión cerrada exitosamente');
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert(currentTexts.error, currentTexts.logoutError);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.header}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSettingsPress}
        accessibilityLabel="Configuraciones"
        accessibilityRole="button"
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.headerTitle, { fontSize: fontSizes.title }]}>
        {title}
      </Text>

      {/* Right side buttons */}
      <View style={styles.rightButtons}>
        {/* Language Toggle */}
        {showLanguageToggle && (
          <TouchableOpacity
            style={styles.languageButton}
            onPress={handleLanguageToggle}
            accessibilityLabel={`Cambiar idioma a ${currentLanguage === 'es' ? 'inglés' : 'español'}`}
            accessibilityRole="button"
          >
            <Text style={styles.languageFlag}>
              {currentLanguage === 'es' ? '🇲🇽' : '🇺🇸'}
            </Text>
          </TouchableOpacity>
        )}

        {/* User Profile */}
        {showProfile && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            accessibilityLabel="Perfil de usuario"
            accessibilityRole="button"
          >
            <View style={styles.profileImage}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.settings}
            </Text>
            
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => {
                setDarkMode(!darkMode);
                speakText(`Modo ${darkMode ? 'claro' : 'oscuro'} activado`);
              }}
              accessibilityLabel={`${currentTexts.darkMode}: ${darkMode ? 'Activado' : 'Desactivado'}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
            >
              <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#333" />
              <Text style={styles.settingText}>{currentTexts.darkMode}</Text>
              <Ionicons 
                name={darkMode ? "toggle" : "toggle-outline"} 
                size={24} 
                color={darkMode ? "#4CAF50" : "#ccc"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUserMenu}
        onRequestClose={() => setShowUserMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.userProfile}
            </Text>
            
            <TouchableOpacity
              style={styles.userOption}
              onPress={() => {
                setShowUserMenu(false);
                setShowChangeNameModal(true);
              }}
              accessibilityLabel={currentTexts.changeName}
              accessibilityRole="button"
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changeName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              onPress={() => {
                setShowUserMenu(false);
                setShowChangePasswordModal(true);
              }}
              accessibilityLabel={currentTexts.changePassword}
              accessibilityRole="button"
            >
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changePassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              onPress={handleLogout}
              accessibilityLabel={currentTexts.logout}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={24} color="#f44336" />
              <Text style={[styles.userOptionText, { color: '#f44336' }]}>
                {currentTexts.logout}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUserMenu(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Name Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangeNameModal}
        onRequestClose={() => setShowChangeNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.changeName}
            </Text>
            
            <Text style={styles.inputLabel}>Nuevo Nombre</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu nuevo nombre"
              placeholderTextColor="#999"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowChangeNameModal(false);
                  setNewName('');
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{currentTexts.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleChangeName}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePasswordModal}
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.changePassword}
            </Text>
            
            <Text style={styles.inputLabel}>Contraseña Actual</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor="#999"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Nueva Contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowChangePasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{currentTexts.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40, // Aumentado para mover el header más abajo
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
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
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userOptionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6BCDDD',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Nuevos estilos para modales de cambio
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#6BCDDD',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});