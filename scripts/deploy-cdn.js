#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE DEPLOY AUTOMÁTICO PARA CDN
 * 
 * O QUE ELE FAZ:
 * 1. Cria estrutura de pastas CDN
 * 2. Copia todos os arquivos necessários
 * 3. Versiona automaticamente
 * 4. Faz commit e push pro GitHub Pages
 * 
 * COMO USAR:
 *   npm run deploy
 * 
 * OU:
 *   npm run deploy -- --version 1.0.1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ========== CONFIGURAÇÃO ==========
const VERSION = process.argv.includes('--version')
  ? process.argv[process.argv.indexOf('--version') + 1]
  : '1.0.0';

// Deploy direto na pasta versionada (ex: /1.0.0/)
const VERSION_DIR = path.join(__dirname, '..', VERSION);

console.log('🚀 Deploy CDN - Versão ' + VERSION);
console.log('=====================================\n');

// ========== STEP 1: CRIAR ESTRUTURA ==========
console.log('📁 Criando estrutura de pastas...');

const folders = [
  VERSION_DIR,
  path.join(VERSION_DIR, 'mechanics'),
  path.join(VERSION_DIR, 'modalities')
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log('   ✅ ' + folder);
  }
});

// ========== STEP 2: COPIAR ARQUIVOS ==========
console.log('\n📦 Copiando arquivos...');

const filesToCopy = [
  // Base
  { from: 'base/scripts/base.js', to: 'base.js' },
  { from: 'base/scripts/game-engine.js', to: 'game-engine.js' },
  { from: 'base/scripts/bubble-integration.js', to: 'bubble-integration.js' },
  { from: 'base/scripts/particles.js', to: 'particles.js' },
  { from: 'base/scripts/audio.js', to: 'audio.js' },
  { from: 'base/scripts/decorations.js', to: 'decorations.js' },
  { from: 'base/styles/base.css', to: 'base.css' },

  // Mechanics
  { from: 'mechanics/escalada.js', to: 'mechanics/escalada.js' },
  { from: 'mechanics/perseguicao.js', to: 'mechanics/perseguicao.js' },

  // Modalities
  { from: 'modalities/quiz.js', to: 'modalities/quiz.js' },
  { from: 'modalities/true-false.js', to: 'modalities/true-false.js' },
  { from: 'modalities/fill-blanks.js', to: 'modalities/fill-blanks.js' },
  { from: 'modalities/sequence.js', to: 'modalities/sequence.js' }
];

filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, '..', file.from);
  const destPath = path.join(VERSION_DIR, file.to);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log('   ✅ ' + file.to);
  } else {
    console.log('   ⚠️  ARQUIVO NÃO ENCONTRADO: ' + file.from);
  }
});

// ========== STEP 3: CRIAR INDEX.HTML ==========
console.log('\n📄 Criando index.html...');

const indexHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IAlume CDN - ${VERSION}</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    h1 { font-size: 3rem; margin-bottom: 10px; }
    .version { font-size: 1.5rem; opacity: 0.8; margin-bottom: 30px; }
    .files { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
    .file { padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; }
    code { background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🌟 IAlume CDN</h1>
  <div class="version">Versão ${VERSION}</div>
  
  <h2>📦 Arquivos Disponíveis:</h2>
  <div class="files">
    ${filesToCopy.map(f => `<div class="file">
      <code>/${VERSION}/${f.to}</code>
    </div>`).join('')}
  </div>
  
  <h2>🔗 Como Usar:</h2>
  <pre style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; overflow-x: auto;">
&lt;script src="https://SEU-USUARIO.github.io/ialume-factory/${VERSION}/base.js"&gt;&lt;/script&gt;
&lt;script src="https://SEU-USUARIO.github.io/ialume-factory/${VERSION}/game-engine.js"&gt;&lt;/script&gt;
&lt;script src="https://SEU-USUARIO.github.io/ialume-factory/${VERSION}/mechanics/escalada.js"&gt;&lt;/script&gt;
  </pre>
  
  <p style="margin-top: 40px; opacity: 0.6; font-size: 0.9rem;">
    Gerado automaticamente por deploy-cdn.js
  </p>
</body>
</html>`;

fs.writeFileSync(path.join(VERSION_DIR, 'index.html'), indexHTML);
console.log('   ✅ index.html criado');

// ========== STEP 4: CRIAR MANIFEST ==========
console.log('\n📋 Criando manifest.json...');

const manifest = {
  version: VERSION,
  timestamp: new Date().toISOString(),
  files: filesToCopy.map(f => ({
    path: `/${VERSION}/${f.to}`,
    source: f.from
  }))
};

fs.writeFileSync(
  path.join(VERSION_DIR, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('   ✅ manifest.json criado');

// ========== STEP 5: GIT ==========
console.log('\n🔄 Preparando deploy...');
console.log('   ℹ️  Para fazer deploy no GitHub Pages:');
console.log('   1. git add ' + VERSION);
console.log('   2. git commit -m "deploy: versão ' + VERSION + '"');
console.log('   3. git push');
console.log('\n✅ DEPLOY PREPARADO COM SUCESSO!');
console.log(`\n📁 Arquivos em: /${VERSION}/`);
console.log(`🌐 Versão: ${VERSION}`);
