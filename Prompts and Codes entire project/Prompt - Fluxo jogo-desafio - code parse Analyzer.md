Parse Analyzer (pega o json depois do Analyzador)

// ========== PEGAR INPUT ==========
const item = $input.first();
let analyzerResponse = item.json.content[0].text;

console.log('🔍 Parse Analyzer iniciando...');
console.log('📏 Tamanho do response:', analyzerResponse.length, 'chars');

// ========== LIMPEZA PROGRESSIVA ==========

// 1. Remover markdown code blocks
console.log('🧹 [1/7] Removendo markdown code blocks...');
analyzerResponse = analyzerResponse
  .replace(/```json\s*/g, '')
  .replace(/```\s*/g, '')
  .trim();

// 2. Remover comentários de linha (// ...)
console.log('🧹 [2/7] Removendo comentários de linha...');
analyzerResponse = analyzerResponse.replace(/\/\/[^\n]*/g, '');

// 3. Remover comentários de bloco (/* ... */)
console.log('🧹 [3/7] Removendo comentários de bloco...');
analyzerResponse = analyzerResponse.replace(/\/\*[\s\S]*?\*\//g, '');

// 4. Remover trailing commas antes de ] ou }
console.log('🧹 [4/7] Removendo trailing commas...');
analyzerResponse = analyzerResponse.replace(/,(\s*[}\]])/g, '$1');

// 5. Corrigir zeros à esquerda em números (09 → 9, 08 → 8)
// Procura por : ou [ seguido de 0 e depois dígitos
console.log('🧹 [5/7] Corrigindo zeros à esquerda...');
analyzerResponse = analyzerResponse.replace(/([:,\[])\s*0+([1-9]\d*)/g, '$1$2');

// 6. Remover múltiplas quebras de linha
console.log('🧹 [6/8] Normalizando quebras de linha...');
analyzerResponse = analyzerResponse.replace(/\n{3,}/g, '\n\n');

// 7. Limpar caracteres de controle DENTRO de strings JSON
console.log('🧹 [7/8] Limpando caracteres de controle em strings...');
// Procura strings entre aspas e substitui quebras de linha por espaços
analyzerResponse = analyzerResponse.replace(/"([^"\\]|\\.)*"/g, function(match) {
  // Dentro de cada string, substitui \n, \r, \t literais por espaços
  return match
    .replace(/\r\n/g, ' ')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');
});

// 8. Tentar corrigir aspas simples (só se não tiver duplas)
console.log('🧹 [8/8] Verificando aspas...');
const hasDoubleQuotes = analyzerResponse.includes('"');
const hasSingleQuotes = analyzerResponse.includes("'");

if (hasSingleQuotes && !hasDoubleQuotes) {
  console.log('⚠️ Detectadas aspas simples, convertendo para duplas...');
  // Só converte se não houver aspas duplas no JSON
  analyzerResponse = analyzerResponse.replace(/'/g, '"');
}

// ========== TENTAR PARSE ==========
console.log('🔄 Tentando fazer parse do JSON limpo...');

let analyzerData;
try {
  analyzerData = JSON.parse(analyzerResponse);
  console.log('✅ Parse bem-sucedido!');
} catch (firstError) {
  console.error('❌ Primeiro parse falhou:', firstError.message);
  console.error('📍 Posição do erro:', firstError.message.match(/position (\d+)/)?.[1]);

  // Tentar diagnóstico: mostrar trecho ao redor do erro
  const errorPos = parseInt(firstError.message.match(/position (\d+)/)?.[1] || '0');
  if (errorPos > 0) {
    const start = Math.max(0, errorPos - 100);
    const end = Math.min(analyzerResponse.length, errorPos + 100);
    const snippet = analyzerResponse.substring(start, end);
    console.error('📝 Trecho ao redor do erro:');
    console.error(snippet);
  }

  // Última tentativa: remover TUDO que não é JSON válido
  console.log('🔧 Tentando limpeza mais agressiva...');

  // Encontrar primeiro { e último }
  const firstBrace = analyzerResponse.indexOf('{');
  const lastBrace = analyzerResponse.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    analyzerResponse = analyzerResponse.substring(firstBrace, lastBrace + 1);

    try {
      analyzerData = JSON.parse(analyzerResponse);
      console.log('✅ Parse bem-sucedido após limpeza agressiva!');
    } catch (secondError) {
      console.error('❌ Parse falhou mesmo após limpeza agressiva');
      console.error('💀 Erro final:', secondError.message);

      // Logar JSON problemático (primeiros 500 chars)
      console.error('📄 JSON problemático (início):');
      console.error(analyzerResponse.substring(0, 500));

      throw new Error(`JSON inválido mesmo após limpeza: ${secondError.message}`);
    }
  } else {
    throw new Error(`Não foi possível encontrar { e } válidos no response`);
  }
}

// ========== VALIDAR ESTRUTURA ==========
console.log('🔍 Validando estrutura...');

if (!analyzerData.concept) {
  console.warn('⚠️ Campo "concept" não encontrado');
}

if (!analyzerData.bloom_progression || !Array.isArray(analyzerData.bloom_progression)) {
  console.warn('⚠️ Campo "bloom_progression" inválido');
}

if (!analyzerData.estimated_time) {
  console.warn('⚠️ Campo "estimated_time" não encontrado');
}

// ========== RETORNAR ==========
console.log('✅ Parse completo!');
console.log('📊 Estrutura validada:');
console.log('  - Conceito:', analyzerData.concept);
console.log('  - Bloom levels:', analyzerData.bloom_progression?.length || 0);
console.log('  - Tempo estimado:', analyzerData.estimated_time);

return {
  json: {
    analyzer_output: analyzerData,
    raw_response: item.json.content[0].text,
    parse_stats: {
      original_length: item.json.content[0].text.length,
      cleaned_length: analyzerResponse.length,
      timestamp: new Date().toISOString()
    }
  }
};
