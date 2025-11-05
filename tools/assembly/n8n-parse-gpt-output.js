/**
 * N8N CODE NODE: Parse GPT Output
 *
 * POSIÇÃO: Entre "Game Designer" e "Game Assembler"
 *
 * FUNÇÃO:
 * - Extrai JSON do formato Claude (content[0].text)
 * - Valida estrutura básica
 * - Repassa dados para o Game Assembler
 *
 * INPUT esperado:
 * {
 *   content: [{
 *     type: "text",
 *     text: "{\"mechanic\": {...}, \"questions\": [...]}"
 *   }],
 *   analyzer_output: {...},  // Do node anterior
 *   pagina_id: "..."
 * }
 *
 * OUTPUT:
 * {
 *   game_config: {...},      // JSON parseado do GPT
 *   analyzer_output: {...},  // Repassado
 *   pagina_id: "..."         // Repassado
 * }
 */

// ========== EXECUÇÃO N8N ==========
try {
  const item = $input.first();
  const response = item.json;

  console.log('🔍 Parse GPT Output - Iniciando...');

  // ========== EXTRAIR JSON DO CLAUDE ==========
  let gameConfig;

  if (response.content && Array.isArray(response.content) && response.content[0]?.text) {
    // Formato Claude: {content: [{type: "text", text: "..."}]}
    console.log('📦 Formato Claude detectado');
    let jsonString = response.content[0].text;
    console.log('📄 JSON String length:', jsonString.length);

    // ========== LIMPAR MARKDOWN CODE BLOCKS ==========
    // Remove ```json ... ``` ou ``` ... ```
    jsonString = jsonString.trim();

    if (jsonString.startsWith('```')) {
      console.log('🧹 Removendo markdown code blocks...');

      // Remove primeira linha (```json ou ```)
      jsonString = jsonString.replace(/^```[a-z]*\n?/, '');

      // Remove última linha (```)
      jsonString = jsonString.replace(/\n?```$/, '');

      jsonString = jsonString.trim();
      console.log('✅ Code blocks removidos');
    }

    try {
      gameConfig = JSON.parse(jsonString);
      console.log('✅ JSON parseado com sucesso');
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError.message);
      console.error('JSON recebido (primeiros 500 chars):', jsonString.substring(0, 500));
      throw new Error('JSON inválido retornado pelo GPT: ' + parseError.message);
    }

  } else if (typeof response === 'string') {
    // Formato string direta
    console.log('📦 Formato string detectado');
    gameConfig = JSON.parse(response);

  } else if (response.mechanic || response.questions) {
    // Já é objeto parseado
    console.log('📦 Formato objeto detectado');
    gameConfig = response;

  } else {
    throw new Error('Formato de resposta não reconhecido');
  }

  // ========== VALIDAÇÃO BÁSICA ==========
  console.log('🔍 Validando estrutura...');

  if (!gameConfig.mechanic || !gameConfig.mechanic.name) {
    throw new Error('Campo "mechanic" ausente ou inválido');
  }

  if (!gameConfig.modality || !gameConfig.modality.name) {
    throw new Error('Campo "modality" ausente ou inválido');
  }

  if (!gameConfig.questions || !Array.isArray(gameConfig.questions)) {
    throw new Error('Campo "questions" ausente ou não é array');
  }

  if (gameConfig.questions.length === 0) {
    throw new Error('Array "questions" está vazio');
  }

  console.log('✅ Estrutura válida');
  console.log('📊 Mecânica:', gameConfig.mechanic.name);
  console.log('📊 Modalidade:', gameConfig.modality.name);
  console.log('📊 Perguntas:', gameConfig.questions.length);

  // ========== RETORNAR DADOS ==========
  return {
    json: {
      game_config: gameConfig,
      analyzer_output: response.analyzer_output || item.json.analyzer_output || {},
      pagina_id: response.pagina_id || item.json.pagina_id || null
    }
  };

} catch (error) {
  console.error('❌ ERRO no Parse GPT Output:', error.message);
  console.error('Stack:', error.stack);

  return {
    json: {
      error: error.message,
      status: 'error_parse',
      timestamp: new Date().toISOString()
    }
  };
}
