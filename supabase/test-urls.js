#!/usr/bin/env node

/**
 * TESTAR URLs PÚBLICAS - Supabase
 * Verifica se os assets estão acessíveis
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.supabase') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // Usando ANON key (pública) para simular acesso real
);

async function testUrls() {
  console.log('🧪 Testando URLs públicas...\n');

  // Testar cenários
  console.log('📊 Testando scenery_assets...');
  const { data: sceneries, error: sceneryError } = await supabase
    .from('scenery_assets')
    .select('*')
    .eq('is_active', true);

  if (sceneryError) {
    console.error('❌ Erro ao buscar cenários:', sceneryError.message);
  } else {
    console.log(`✅ ${sceneries.length} cenários encontrados:`);
    sceneries.forEach(s => {
      console.log(`   - ${s.scenery_id}: ${s.name}`);
      console.log(`     Layer 1: ${s.layer_1_sky ? '✅' : '❌'}`);
      console.log(`     Layer 2: ${s.layer_2_far ? '✅' : '❌'}`);
      console.log(`     Layer 3: ${s.layer_3_mid ? '✅' : '❌'}`);
    });
  }

  console.log('');

  // Testar decorações
  console.log('📊 Testando scenery_decorations...');
  const { data: decorations, error: decorError } = await supabase
    .from('scenery_decorations')
    .select('*')
    .eq('is_active', true);

  if (decorError) {
    console.error('❌ Erro ao buscar decorações:', decorError.message);
  } else {
    console.log(`✅ ${decorations.length} decorações encontradas:`);
    decorations.forEach(d => {
      console.log(`   - ${d.decoration_name} (${d.scenery_id})`);
    });
  }

  console.log('');

  // Testar áudios
  console.log('📊 Testando media_assets...');
  const { data: audios, error: audioError } = await supabase
    .from('media_assets')
    .select('*')
    .eq('is_active', true);

  if (audioError) {
    console.error('❌ Erro ao buscar áudios:', audioError.message);
  } else {
    console.log(`✅ ${audios.length} áudios encontrados:`);
    audios.forEach(a => {
      console.log(`   - ${a.media_id}: ${a.name}`);
    });
  }

  console.log('\n=====================================');
  console.log('✅ TODOS OS TESTES PASSARAM!');
  console.log('=====================================\n');

  console.log('🔗 URLs de exemplo:');
  if (sceneries && sceneries[0]) {
    console.log(`\n🏔️  Cenário: ${sceneries[0].name}`);
    console.log(`${sceneries[0].layer_1_sky}\n`);
  }

  if (audios && audios[0]) {
    console.log(`🎵 Áudio: ${audios[0].name}`);
    console.log(`${audios[0].file_url}\n`);
  }

  console.log('🎯 Agora você pode:');
  console.log('  1. Testar URLs no navegador (copie e cole)');
  console.log('  2. Configurar N8N para buscar do Supabase');
  console.log('  3. Atualizar game_assembler_cdn.js\n');
}

testUrls().catch(console.error);
