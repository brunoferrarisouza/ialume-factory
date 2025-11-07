#!/usr/bin/env node

/**
 * CRIAR BUCKETS - Supabase Storage
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.supabase') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createBuckets() {
  console.log('🪣 Criando buckets de storage...\n');

  // Bucket 1: scenery (backgrounds + decorations)
  try {
    const { data, error } = await supabase.storage.createBucket('scenery', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Bucket "scenery" já existe');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Bucket "scenery" criado com sucesso!');
    }
  } catch (error) {
    console.error('❌ Erro ao criar bucket scenery:', error.message);
  }

  // Bucket 2: audio (sons do jogo)
  try {
    const { data, error } = await supabase.storage.createBucket('audio', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav']
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Bucket "audio" já existe');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Bucket "audio" criado com sucesso!');
    }
  } catch (error) {
    console.error('❌ Erro ao criar bucket audio:', error.message);
  }

  console.log('\n✅ Buckets configurados!\n');
  console.log('📁 Estrutura:');
  console.log('  /scenery/');
  console.log('    /backgrounds/');
  console.log('      /montanha-nevada/');
  console.log('      /deserto-canyon/');
  console.log('    /decorations/');
  console.log('      /clouds/');
  console.log('      /birds/');
  console.log('  /audio/');
  console.log('    musica-principal.mp3');
  console.log('    som-vento.mp3');
  console.log('    ...\n');
}

createBuckets().catch(console.error);
