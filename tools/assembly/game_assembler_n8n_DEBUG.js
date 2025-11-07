/**
 * 🔍 GAME ASSEMBLER N8N - VERSÃO DEBUG
 *
 * Esta versão mostra EXATAMENTE o que está chegando no input
 * Use primeiro para diagnosticar o problema
 */

// ========== DEBUG: VER TODO O INPUT ==========
const item = $input.first();

console.log('🔍 ===== DEBUG: INSPECIONANDO INPUT =====');
console.log('');
console.log('📦 item completo:');
console.log(JSON.stringify(item, null, 2));
console.log('');
console.log('📦 item.json:');
console.log(JSON.stringify(item.json, null, 2));
console.log('');
console.log('📦 Chaves disponíveis em item.json:');
console.log(Object.keys(item.json));
console.log('');

// Tentar acessar de várias formas
console.log('🔍 Tentando acessar dados de várias formas:');
console.log('');
console.log('1. item.json.game_config:', typeof item.json.game_config);
if (item.json.game_config) {
  console.log('   → Existe! Chaves:', Object.keys(item.json.game_config));
}
console.log('');
console.log('2. item.json.config:', typeof item.json.config);
if (item.json.config) {
  console.log('   → Existe! Chaves:', Object.keys(item.json.config));
}
console.log('');
console.log('3. item.json.questions:', typeof item.json.questions);
if (item.json.questions) {
  console.log('   → Existe! É array?', Array.isArray(item.json.questions));
}
console.log('');
console.log('4. item.json.mechanic:', typeof item.json.mechanic);
console.log('');
console.log('5. item.json.content:', typeof item.json.content);
if (item.json.content) {
  console.log('   → Existe! É array?', Array.isArray(item.json.content));
  if (Array.isArray(item.json.content) && item.json.content[0]) {
    console.log('   → content[0].type:', item.json.content[0].type);
    console.log('   → content[0].text (primeiros 200 chars):');
    console.log('   ', item.json.content[0].text?.substring(0, 200));
  }
}

console.log('');
console.log('🔍 ===== FIM DO DEBUG =====');
console.log('');
console.log('💡 PRÓXIMO PASSO:');
console.log('   Veja os logs acima e me diga qual estrutura apareceu');
console.log('   Assim eu posso adaptar o código corretamente');

// Retornar debug info
return [
  {
    json: {
      debug: true,
      message: 'Debug executado - veja os logs do console',
      input_keys: Object.keys(item.json),
      has_game_config: !!item.json.game_config,
      has_config: !!item.json.config,
      has_questions: !!item.json.questions,
      has_content: !!item.json.content,
      raw_json: item.json
    }
  }
];
