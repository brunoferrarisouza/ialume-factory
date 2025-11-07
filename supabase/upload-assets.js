#!/usr/bin/env node

/**
 * UPLOAD AUTOMÁTICO DE ASSETS - Supabase
 *
 * Faz upload de:
 * - Backgrounds (4 cenários)
 * - Decorations (nuvens, pássaros)
 * - Áudios (5 sons)
 *
 * E popula o banco de dados com as URLs
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.supabase') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const AUDIO_DIR = path.join(__dirname, '..', 'audio');

// ========================================
// 1. UPLOAD DE BACKGROUNDS
// ========================================

const BACKGROUNDS = {
  'montanha-nevada': [
    { file: 'layer-1-sky.png', layer: 1 },
    { file: 'layer-2-mountains-far.png', layer: 2 },
    { file: 'layer-3-mountains-mid.png', layer: 3 }
  ],
  'deserto-canyon': [
    { file: 'desert-layer-1.png', layer: 1 },
    { file: 'desert-layer-2.png', layer: 2 },
    { file: 'desert-layer-3.png', layer: 3 },
    { file: 'desert-layer-4.png', layer: 4 },
    { file: 'desert-layer-5.png', layer: 5 }
  ],
  'cidade-floresta': [
    { file: 'bg03-layer-1.png', layer: 1 },
    { file: 'bg03-layer-2.png', layer: 2 },
    { file: 'bg03-layer-3.png', layer: 3 }
  ],
  'vulcao': [
    { file: 'bg07-layer-1.png', layer: 1 },
    { file: 'bg07-layer-2.png', layer: 2 },
    { file: 'bg07-layer-3.png', layer: 3 }
  ]
};

async function uploadBackgrounds() {
  console.log('🏔️  Fazendo upload de backgrounds...\n');

  const sceneryRecords = [];

  for (const [sceneryId, layers] of Object.entries(BACKGROUNDS)) {
    console.log(`📁 Cenário: ${sceneryId}`);

    const urls = {};

    for (const { file, layer } of layers) {
      const filePath = path.join(ASSETS_DIR, 'backgrounds', 'escalada', file);

      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  Arquivo não encontrado: ${file}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const storagePath = `backgrounds/${sceneryId}/${file}`;

      try {
        const { data, error } = await supabase.storage
          .from('scenery')
          .upload(storagePath, fileBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (error) throw error;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('scenery')
          .getPublicUrl(storagePath);

        urls[`layer_${layer}_${layer === 1 ? 'sky' : layer === 2 ? 'far' : layer === 3 ? 'mid' : layer === 4 ? 'near' : 'ground'}`] = publicUrl;

        console.log(`   ✅ ${file}`);
      } catch (error) {
        console.error(`   ❌ Erro ao fazer upload de ${file}:`, error.message);
      }
    }

    // Preparar registro para inserir no banco
    sceneryRecords.push({
      scenery_id: sceneryId,
      name: sceneryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ...urls
    });

    console.log('');
  }

  return sceneryRecords;
}

// ========================================
// 2. UPLOAD DE DECORATIONS
// ========================================

const DECORATIONS = [
  // Nuvens
  { scenery: 'montanha-nevada', type: 'cloud', name: 'cloud-1', file: 'decorations/clouds/cloud-1.png', animation: 'float-horizontal', speed: 0.5, frequency: 8000 },
  { scenery: 'montanha-nevada', type: 'cloud', name: 'cloud-2', file: 'decorations/clouds/cloud-2.png', animation: 'float-horizontal', speed: 0.7, frequency: 10000 },
  { scenery: 'deserto-canyon', type: 'cloud', name: 'cloud-1', file: 'decorations/clouds/cloud-1.png', animation: 'float-horizontal', speed: 0.8, frequency: 7000 },

  // Pássaros
  { scenery: 'montanha-nevada', type: 'bird', name: 'bird-eagle', file: 'decorations/birds/bird_2_eagle.png', animation: 'fly-diagonal', speed: 1.5, frequency: 15000 },
  { scenery: 'deserto-canyon', type: 'bird', name: 'bird-cardinal', file: 'decorations/birds/bird_2_cardinal.png', animation: 'fly-diagonal', speed: 1.2, frequency: 12000 },
  { scenery: 'cidade-floresta', type: 'bird', name: 'bird-bluejay', file: 'decorations/birds/bird_1_bluejay.png', animation: 'fly-diagonal', speed: 1.0, frequency: 10000 }
];

async function uploadDecorations() {
  console.log('🦅 Fazendo upload de decorations...\n');

  const decorationRecords = [];

  for (const decoration of DECORATIONS) {
    const filePath = path.join(ASSETS_DIR, decoration.file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${decoration.file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `decorations/${decoration.type}s/${path.basename(decoration.file)}`;

    try {
      const { data, error } = await supabase.storage
        .from('scenery')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('scenery')
        .getPublicUrl(storagePath);

      decorationRecords.push({
        scenery_id: decoration.scenery,
        decoration_type: decoration.type,
        decoration_name: decoration.name,
        image_url: publicUrl,
        animation_type: decoration.animation,
        speed_multiplier: decoration.speed,
        spawn_frequency: decoration.frequency
      });

      console.log(`✅ ${decoration.name} (${decoration.scenery})`);
    } catch (error) {
      console.error(`❌ Erro ao fazer upload de ${decoration.file}:`, error.message);
    }
  }

  console.log('');
  return decorationRecords;
}

// ========================================
// 3. UPLOAD DE ÁUDIOS
// ========================================

const AUDIOS = [
  { id: 'musica-principal', name: 'Música Principal', file: 'musica-principal.mp3', type: 'music', volume: 0.3, loop: true },
  { id: 'som-vento', name: 'Som do Vento', file: 'som-vento.mp3', type: 'ambient', volume: 0.2, loop: true },
  { id: 'som-moeda', name: 'Som da Moeda', file: 'som-moeda.mp3', type: 'sfx', volume: 0.5, loop: false },
  { id: 'som-voo-lume', name: 'Som do Voo do Lume', file: 'som-voo-lume.mp3', type: 'sfx', volume: 0.4, loop: false },
  { id: 'som-nova-pergunta', name: 'Som de Nova Pergunta', file: 'som-nova-pergunta.mp3', type: 'sfx', volume: 0.4, loop: false }
];

async function uploadAudios() {
  console.log('🎵 Fazendo upload de áudios...\n');

  const audioRecords = [];

  for (const audio of AUDIOS) {
    const filePath = path.join(AUDIO_DIR, audio.file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${audio.file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = audio.file;

    try {
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(storagePath, fileBuffer, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(storagePath);

      audioRecords.push({
        media_id: audio.id,
        name: audio.name,
        file_url: publicUrl,
        media_type: audio.type,
        volume: audio.volume,
        loop: audio.loop
      });

      console.log(`✅ ${audio.name}`);
    } catch (error) {
      console.error(`❌ Erro ao fazer upload de ${audio.file}:`, error.message);
    }
  }

  console.log('');
  return audioRecords;
}

// ========================================
// 4. POPULAR BANCO DE DADOS
// ========================================

async function populateDatabase(sceneryRecords, decorationRecords, audioRecords) {
  console.log('💾 Populando banco de dados...\n');

  // Inserir scenery_assets
  console.log('📊 Inserindo scenery_assets...');
  for (const record of sceneryRecords) {
    const { error } = await supabase
      .from('scenery_assets')
      .upsert(record, { onConflict: 'scenery_id' });

    if (error) {
      console.error(`❌ Erro ao inserir ${record.scenery_id}:`, error.message);
    } else {
      console.log(`✅ ${record.scenery_id}`);
    }
  }

  console.log('');

  // Inserir scenery_decorations
  console.log('📊 Inserindo scenery_decorations...');
  for (const record of decorationRecords) {
    const { error } = await supabase
      .from('scenery_decorations')
      .insert(record);

    if (error) {
      console.error(`❌ Erro ao inserir ${record.decoration_name}:`, error.message);
    } else {
      console.log(`✅ ${record.decoration_name} (${record.scenery_id})`);
    }
  }

  console.log('');

  // Inserir media_assets
  console.log('📊 Inserindo media_assets...');
  for (const record of audioRecords) {
    const { error } = await supabase
      .from('media_assets')
      .upsert(record, { onConflict: 'media_id' });

    if (error) {
      console.error(`❌ Erro ao inserir ${record.media_id}:`, error.message);
    } else {
      console.log(`✅ ${record.media_id}`);
    }
  }

  console.log('');
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('=====================================');
  console.log('🚀 UPLOAD AUTOMÁTICO DE ASSETS');
  console.log('=====================================\n');

  try {
    const sceneryRecords = await uploadBackgrounds();
    const decorationRecords = await uploadDecorations();
    const audioRecords = await uploadAudios();

    await populateDatabase(sceneryRecords, decorationRecords, audioRecords);

    console.log('=====================================');
    console.log('✅ UPLOAD COMPLETO!');
    console.log('=====================================\n');

    console.log('📊 Resumo:');
    console.log(`  - ${sceneryRecords.length} cenários`);
    console.log(`  - ${decorationRecords.length} decorações`);
    console.log(`  - ${audioRecords.length} áudios\n`);

    console.log('🎯 Próximo passo:');
    console.log('  - Testar URLs no navegador');
    console.log('  - Configurar N8N para buscar assets do Supabase\n');

  } catch (error) {
    console.error('❌ Erro geral:', error);
    process.exit(1);
  }
}

main();
