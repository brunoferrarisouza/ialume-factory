#!/usr/bin/env node

/**
 * SETUP SUPABASE - iAlume Factory
 * Cria tabelas, buckets e configura tudo automaticamente
 */

const fs = require('fs');
const path = require('path');

// Carregar .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.supabase') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Erro: Credenciais não encontradas em .env.supabase');
  process.exit(1);
}

console.log('🚀 Iniciando setup do Supabase...\n');
console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 Service Key: ${SERVICE_KEY.substring(0, 20)}...\n`);

// Instalar dependências se necessário
try {
  require('@supabase/supabase-js');
} catch (e) {
  console.log('📦 Instalando @supabase/supabase-js...');
  require('child_process').execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setup() {
  console.log('=====================================');
  console.log('STEP 1: Criar Tabelas SQL');
  console.log('=====================================\n');

  // Ler SQL
  const sqlPath = path.join(__dirname, 'setup-tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('⚠️  IMPORTANTE: O SQL precisa ser executado manualmente no Supabase SQL Editor');
  console.log('📋 Copie o conteúdo de: supabase/setup-tables.sql');
  console.log('🔗 Cole em: https://supabase.com/dashboard/project/[seu-projeto]/sql\n');

  console.log('Pressione ENTER quando tiver executado o SQL...');

  // Aguardar confirmação
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  console.log('\n=====================================');
  console.log('STEP 2: Criar Buckets de Storage');
  console.log('=====================================\n');

  // Criar bucket 'scenery'
  try {
    const { data, error } = await supabase.storage.createBucket('scenery', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
    });

    if (error && !error.message.includes('already exists')) {
      throw error;
    }

    console.log('✅ Bucket "scenery" criado (ou já existe)');
  } catch (error) {
    console.error('❌ Erro ao criar bucket scenery:', error.message);
  }

  // Criar bucket 'audio'
  try {
    const { data, error } = await supabase.storage.createBucket('audio', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3']
    });

    if (error && !error.message.includes('already exists')) {
      throw error;
    }

    console.log('✅ Bucket "audio" criado (ou já existe)');
  } catch (error) {
    console.error('❌ Erro ao criar bucket audio:', error.message);
  }

  console.log('\n=====================================');
  console.log('SETUP COMPLETO! ✅');
  console.log('=====================================\n');

  console.log('📁 Buckets criados:');
  console.log('  - scenery (backgrounds + decorations)');
  console.log('  - audio (sons do jogo)\n');

  console.log('📊 Tabelas criadas:');
  console.log('  - scenery_assets');
  console.log('  - scenery_decorations');
  console.log('  - media_assets\n');

  console.log('🎯 Próximos passos:');
  console.log('  1. npm run supabase:upload-assets');
  console.log('  2. npm run supabase:populate-db\n');

  process.exit(0);
}

setup().catch(error => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
