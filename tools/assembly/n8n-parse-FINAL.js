/**
 * 🔍 N8N PARSE GPT OUTPUT - VERSÃO FINAL SIMPLIFICADA
 *
 * POSIÇÃO: Entre "Claude Game Designer" e "Game Assembler"
 *
 * FUNÇÃO: Apenas extrair JSON do formato Claude
 * - NÃO valida estrutura (deixa para o assembler)
 * - Aceita qualquer formato JSON válido
 * - Remove markdown automaticamente
 */

// ========== PEGAR INPUT ==========
const item = $input.first();
const response = item.json;

console.log('🔍 Parse GPT Output - Iniciando...');

try {
  let gameConfig;

  // ========== EXTRAIR JSON DO CLAUDE ==========
  if (response.content && Array.isArray(response.content) && response.content[0]?.text) {
    // Formato Claude: {content: [{type: "text", text: "..."}]}
    console.log('📦 Formato Claude detectado');
    let jsonString = response.content[0].text;
    console.log('📄 JSON String length:', jsonString.length);

    // ========== LIMPAR MARKDOWN CODE BLOCKS ==========
    jsonString = jsonString.trim();

    if (jsonString.startsWith('```')) {
      console.log('🧹 Removendo markdown code blocks...');
      // Remove ```json\n e \n```
      jsonString = jsonString.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
      console.log('✅ Code blocks removidos');
    }

    // Parsear JSON
    try {
      gameConfig = JSON.parse(jsonString);
      console.log('✅ JSON parseado com sucesso');
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError.message);
      console.error('JSON (primeiros 500 chars):', jsonString.substring(0, 500));
      throw new Error('JSON inválido retornado pelo Claude: ' + parseError.message);
    }

  } else if (typeof response === 'string') {
    // Formato string direta
    console.log('📦 Formato string detectado');
    gameConfig = JSON.parse(response);

  } else if (response.titulo || response.fases || response.questions || response.mechanic) {
    // Já é objeto parseado
    console.log('📦 Formato objeto detectado (já parseado)');
    gameConfig = response;

  } else {
    throw new Error('Formato de resposta não reconhecido. Chaves disponíveis: ' + Object.keys(response).join(', '));
  }

  // ========== LOG ESTRUTURA DETECTADA ==========
  console.log('✅ JSON extraído com sucesso');
  console.log('📦 Chaves no config:', Object.keys(gameConfig).join(', '));

  // Log específico baseado no formato
  if (gameConfig.fases) {
    console.log('📊 Formato: game-engine (fases)');
    console.log('   - Total de fases:', gameConfig.fases.length);
    console.log('   - Mecânica:', gameConfig.mecanica);
  } else if (gameConfig.questions) {
    console.log('📊 Formato: game-designer (questions)');
    console.log('   - Total de questions:', gameConfig.questions.length);
    console.log('   - Mechanic:', gameConfig.mechanic?.name || gameConfig.mechanic);
  }

  // ========== RETORNAR DADOS ==========
  return [{
    json: {
      config: gameConfig,  // ← Usa "config" genérico
      analyzer_output: response.analyzer_output || item.json.analyzer_output || {},
      pagina_id: response.pagina_id || item.json.pagina_id || null,
      success: true,
      timestamp: new Date().toISOString()
    }
  }];

} catch (error) {
  console.error('❌ ERRO no Parse GPT Output:', error.message);
  console.error('Stack:', error.stack);

  return [{
    json: {
      error: error.message,
      status: 'error_parse',
      timestamp: new Date().toISOString(),
      debug: {
        input_keys: Object.keys(response),
        has_content: !!response.content,
        has_titulo: !!response.titulo,
        has_fases: !!response.fases,
        has_questions: !!response.questions
      }
    }
  }];
}
