import { testConnection } from '../lib/database';

async function test() {
  console.log('🔍 Probando conexión a MySQL...');
  const result = await testConnection();
  console.log('Resultado:', result);
}

test().catch(console.error); 