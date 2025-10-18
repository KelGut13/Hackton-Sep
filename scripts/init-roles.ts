// Script para inicializar roles en Firebase
// Ejecutar este script UNA SOLA VEZ para crear los roles por defecto

import { initializeDefaultRoles } from '../services/database';

const initRoles = async () => {
  try {
    console.log('🚀 Inicializando roles en Firebase...');
    await initializeDefaultRoles();
    console.log('✅ ¡Roles inicializados correctamente!');
    console.log('\nRoles creados:');
    console.log('1. Alumno - Usuario que realiza actividades y aprende');
    console.log('2. Maestro - Usuario que crea y gestiona lecciones');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar roles:', error);
    process.exit(1);
  }
};

// Ejecutar el script
initRoles();
