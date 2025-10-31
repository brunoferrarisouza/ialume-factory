#!/usr/bin/env node

/**
 * 🚀 PUSH AUTOMÁTICO PARA GITHUB PAGES
 * 
 * COMO USAR:
 *   npm run push-cdn
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Push para GitHub Pages');
console.log('=====================================\n');

const cdnDir = path.join(__dirname, '..', 'cdn');

if (!fs.existsSync(cdnDir)) {
  console.error('❌ Pasta cdn/ não encontrada!');
  console.log('   Execute primeiro: npm run deploy');
  process.exit(1);
}

try {
  console.log('📦 Adicionando arquivos...');
  execSync('git add cdn/', { stdio: 'inherit' });
  
  console.log('\n💾 Fazendo commit...');
  const timestamp = new Date().toISOString();
  execSync(`git commit -m "deploy: CDN update ${timestamp}"`, { stdio: 'inherit' });
  
  console.log('\n🚀 Fazendo push...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ DEPLOY CONCLUÍDO!');
  console.log('\n⏳ Aguarde 1-2 minutos para GitHub Pages processar');
  console.log('🌐 Acesse: https://SEU-USUARIO.github.io/ialume-factory/');
  
} catch (error) {
  console.error('❌ Erro no deploy:', error.message);
  process.exit(1);
}
