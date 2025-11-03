/**
 * 🎯 BUBBLE CODE NODE - VERSÃO MINIFICADA
 * 
 * ✅ SEM quebras de linha (\n)
 * ✅ HTML compactado em uma única linha
 * ✅ Pronto para copiar/colar no Bubble
 * 
 * COMO USAR:
 * 1. Copie TODO o código abaixo (a partir da linha com "const config")
 * 2. Cole no Code Node do seu Backend Workflow no Bubble
 * 3. Teste gerando um jogo
 */

const config = $json.game_config;
const analyzer = $json.analyzer_output;
const paginaId = $json.pagina_id;

const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/cdn/1.0.0/";

// ✅ Tratamento de analyzer undefined
const safeAnalyzer = analyzer || null;

// ✅ HTML MINIFICADO - SEM QUEBRAS DE LINHA
const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${config.narrative.theme}</title><link rel="stylesheet" href="${CDN_BASE}base.css"><script src="${CDN_BASE}base.js"></script><script src="${CDN_BASE}game-engine.js"></script><script src="${CDN_BASE}bubble-integration.js"></script><script src="${CDN_BASE}mechanics/${config.mechanic.name}.js"></script><script src="${CDN_BASE}modalities/${config.modality.name}.js"></script></head><body><div id="game-container"></div><script>window.GAME_CONFIG=${JSON.stringify(config)};window.ANALYZER_DATA=${JSON.stringify(safeAnalyzer)};window.addEventListener("DOMContentLoaded",function(){iAlumeFactory.init(window.GAME_CONFIG);});</script></body></html>`;

// ✅ Logs de debug
console.log('✅ HTML gerado (minificado)');
console.log('📏 Tamanho:', html.length, 'caracteres');
console.log('🎮 Mechanic:', config.mechanic.name);
console.log('🎯 Modality:', config.modality.name);

// ✅ Retornar JSON
return {
  json: {
    game_html: html,
    pagina_id: paginaId,
    metadata: {
      mechanic: config.mechanic.name,
      modality: config.modality.name,
      character: config.character.name,
      total_questions: config.questions.length,
      estimated_duration: config.metadata.estimated_duration
    }
  }
};
