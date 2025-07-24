const { exec } = require('child_process');

function checkMySQLStatus() {
  console.log('🔍 Verificando estado de MySQL...\n');
  
  // Verificar si MySQL está corriendo en el puerto 3306
  exec('netstat -an | findstr :3306', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error al verificar puerto 3306:', error.message);
      return;
    }
    
    if (stdout.trim()) {
      console.log('✅ MySQL está corriendo en el puerto 3306');
      console.log('📊 Conexiones activas:');
      console.log(stdout);
    } else {
      console.log('❌ MySQL NO está corriendo en el puerto 3306');
      console.log('\n🚀 Para iniciar MySQL:');
      console.log('1. Abre PowerShell como Administrador');
      console.log('2. Ejecuta: net start MySQL80');
      console.log('   (o el nombre de tu servicio MySQL)');
      console.log('\n🔧 Alternativas:');
      console.log('- Panel de Control > Servicios > Buscar MySQL > Iniciar');
      console.log('- Si usas XAMPP/WAMP: Inicia el panel de control y activa MySQL');
      console.log('\n📝 Después de iniciar MySQL, ejecuta: npm run db:test');
    }
  });
  
  // Verificar servicios de MySQL
  console.log('\n🔍 Verificando servicios de MySQL...\n');
  exec('sc query | findstr -i mysql', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error al verificar servicios:', error.message);
      return;
    }
    
    if (stdout.trim()) {
      console.log('📋 Servicios de MySQL encontrados:');
      console.log(stdout);
    } else {
      console.log('❌ No se encontraron servicios de MySQL');
      console.log('💡 Asegúrate de que MySQL esté instalado correctamente');
    }
  });
}

checkMySQLStatus(); 