/**
 * 🔍 N8N PARSE GPT OUTPUT - VERSÃO ROBUSTA
 *
 * POSIÇÃO: Entre "Game Designer" e "Game Assembler"
 *
 * Esta versão aceita QUALQUER formato do Claude:
 * - JSON direto
 * - JSON em markdown (```json)
 * - JSON em content[0].text
 * - JSON com ou sem "mechanic"
 * - Qualquer estrutura
 */

// ========== PEGAR INPUT ==========
const item = $input.first();
const response = item.json;

console.log('🔍 Parse GPT Output ROBUSTO - Iniciando...');
console.log('📦 Chaves no input:', Object.keys(response));

// ========== FUNÇÃO: EXTRAIR JSON DE QUALQUER FORMATO ==========
function extractJSON(data) {
  console.log('📦 Tentando extrair JSON...');

  // 1. Se já é objeto com as chaves esperadas, retornar direto
  if (data.mechanic || data.questions || data.narrative) {
    console.log('✅ Formato: JSON direto (já parseado)');
    return data;
  }

  // 2. Se tem content[0].text (formato Claude)
  if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
    console.log('📦 Formato: Claude (content[0].text)');
    let jsonString = data.content[0].text;
    return parseJSONString(jsonString);
  }

  // 3. Se é string direto
  if (typeof data === 'string') {
    console.log('📦 Formato: String');
    return parseJSONString(data);
  }

  // 4. Se tem message.content[0].text (outro formato Claude)
  if (data.message?.content?.[0]?.text) {
    console.log('📦 Formato: message.content[0].text');
    return parseJSONString(data.message.content[0].text);
  }

  // 5. Se nenhum formato reconhecido
  console.log('⚠️ Formato não reconhecido, tentando usar objeto direto');
  return data;
}

// ========== FUNÇÃO: PARSEAR STRING JSON ==========
function parseJSONString(jsonString) {
  console.log('📄 JSON String length:', jsonString.length);

  // Limpar whitespace
  jsonString = jsonString.trim();

  // Remover markdown code blocks (```json ... ``` ou ``` ... ```)
  if (jsonString.includes('```')) {
    console.log('🧹 Removendo markdown code blocks...');

    // Encontrar o JSON entre code blocks
    const match = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (match && match[1]) {
      jsonString = match[1].trim();
      console.log('✅ Code blocks removidos');
    } else {
      // Tentar remover manualmente
      jsonString = jsonString.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    }
  }

  // Parsear JSON
  try {
    const parsed = JSON.parse(jsonString);
    console.log('✅ JSON parseado com sucesso');
    return parsed;
  } catch (parseError) {
    console.error('❌ Erro ao parsear JSON:', parseError.message);
    console.error('JSON recebido (primeiros 500 chars):', jsonString.substring(0, 500));
    throw new Error('JSON inválido retornado pelo Claude: ' + parseError.message);
  }
}

// ========== EXTRAIR DADOS ==========
let gameConfig;

try {
  gameConfig = extractJSON(response);
  console.log('✅ Dados extraídos com sucesso');
} catch (error) {
  console.error('❌ Erro ao extrair dados:', error.message);

  // Retornar erro detalhado
  return [{
    json: {
      error: error.message,
      status: 'error_extract',
      timestamp: new Date().toISOString(),
      debug: {
        input_keys: Object.keys(response),
        has_content: !!response.content,
        has_message: !!response.message,
        raw_type: typeof response
      }
    }
  }];
}

// ========== VALIDAÇÃO FLEXÍVEL ==========
console.log('🔍 Validando estrutura...');
console.log('📦 Chaves no gameConfig:', Object.keys(gameConfig));

// Verificar se tem PELO MENOS uma estrutura válida
const hasValidStructure =
  gameConfig.questions ||
  gameConfig.phases ||
  gameConfig.fases ||
  (gameConfig.mechanic && gameConfig.narrative);

if (!hasValidStructure) {
  console.error('❌ Estrutura inválida - nenhum campo reconhecido encontrado');
  console.error('Chaves disponíveis:', Object.keys(gameConfig));

  return [{
    json: {
      error: 'Estrutura inválida: esperado "questions", "phases", "fases", ou "mechanic"+"narrative"',
      status: 'error_validation',
      timestamp: new Date().toISOString(),
      available_keys: Object.keys(gameConfig),
      sample: JSON.stringify(gameConfig).substring(0, 500)
    }
  }];
}

console.log('✅ Estrutura válida detectada');

// ========== LOG INFO ==========
if (gameConfig.mechanic) {
  console.log('📊 Mecânica:', gameConfig.mechanic.name || gameConfig.mechanic);
}
if (gameConfig.modality) {
  console.log('📊 Modalidade:', gameConfig.modality.name || gameConfig.modality);
}
if (gameConfig.questions) {
  console.log('📊 Questions:', gameConfig.questions.length);
}
if (gameConfig.narrative) {
  console.log('📊 Theme:', gameConfig.narrative.theme);
}

// ========== RETORNAR DADOS ==========
return [{
  json: {
    game_config: gameConfig,
    analyzer_output: response.analyzer_output || item.json.analyzer_output || {},
    pagina_id: response.pagina_id || item.json.pagina_id || null,
    success: true,
    timestamp: new Date().toISOString()
  }
}];
