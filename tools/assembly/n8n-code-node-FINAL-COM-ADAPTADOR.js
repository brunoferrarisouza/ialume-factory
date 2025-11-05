/**
 * 🎮 CODE NODE N8N - VERSÃO FINAL COM ADAPTADOR
 *
 * ✅ CORREÇÕES:
 * - Adaptador que converte formato novo (GPT) → formato antigo (Foundation)
 * - HTML minificado (sem \n)
 * - Usa GAME_ENGINE.init() (não iAlumeFactory)
 * - CDN correto: 1.0.0/
 *
 * INPUT esperado ($json.game_config):
 * {
 *   mechanic: { name: "escalada" },
 *   modality: { name: "quiz" },
 *   questions: [
 *     {
 *       text: "Quanto é 3 + 2?",
 *       options: ["4", "5", "6", "3"],
 *       correct: "5",
 *       feedback_correct: "...",
 *       feedback_wrong: "..."
 *     }
 *   ]
 * }
 */

// ========== PEGAR DADOS DO INPUT ==========
const config = $json.game_config;
const analyzer = $json.analyzer_output;
const paginaId = $json.pagina_id;

// ========== ADAPTADOR DE FORMATO ==========
function adaptConfig(newFormat) {
  // Converter formato novo (GPT) → formato antigo (Foundation)
  const adaptedConfig = {
    tema: newFormat.narrative?.theme || 'Jogo Educativo',
    descricao: newFormat.narrative?.intro || '',
    mecanica: newFormat.mechanic?.name || 'escalada',  // ← Português, não 'mechanic'
    fases: []
  };

  // Fase 0: Boas-vindas (se tiver)
  if (newFormat.narrative?.intro) {
    adaptedConfig.fases.push({
      type: 'welcome',
      titulo: 'Bem-vindo!',
      mensagem: newFormat.narrative.intro
    });
  }

  // Fases: Perguntas
  if (newFormat.questions && Array.isArray(newFormat.questions)) {
    newFormat.questions.forEach((q) => {
      adaptedConfig.fases.push({
        modalidade: newFormat.modality?.name || 'quiz',  // ← Português, não 'modality'
        dados: {
          pergunta: q.text,  // ← text → pergunta
          alternativas: q.options,  // ← options → alternativas
          correta: q.options.indexOf(q.correct),  // ← Converte "5" para índice 1
          feedback_correto: q.feedback_correct || 'Correto!',
          feedback_errado: q.feedback_wrong || 'Tente novamente!'
        }
      });
    });
  }

  return adaptedConfig;
}

// ========== ADAPTAR CONFIGURAÇÃO ==========
const adaptedConfig = adaptConfig(config);

console.log('📊 Config original:', config);
console.log('✅ Config adaptado:', adaptedConfig);

// ========== CDN ==========
const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/1.0.0/";

// ========== CONSTRUIR HTML (MINIFICADO) ==========
const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${adaptedConfig.tema}</title><link rel="stylesheet" href="${CDN_BASE}base.css"><script src="${CDN_BASE}base.js"></script><script src="${CDN_BASE}game-engine.js"></script><script src="${CDN_BASE}bubble-integration.js"></script><script src="${CDN_BASE}mechanics/${adaptedConfig.mecanica}.js"></script><script src="${CDN_BASE}modalities/${config.modality?.name || 'quiz'}.js"></script></head><body><div id="game-container"></div><script>window.GAME_CONFIG=${JSON.stringify(adaptedConfig)};window.ANALYZER_DATA=${JSON.stringify(analyzer)};window.addEventListener("DOMContentLoaded",function(){console.log("🎮 Inicializando jogo...",window.GAME_CONFIG);if(typeof GAME_ENGINE==="undefined"){console.error("❌ GAME_ENGINE não encontrado!");alert("Erro: GAME_ENGINE não carregado!");return;}GAME_ENGINE.init(window.GAME_CONFIG);});</script></body></html>`;

// ========== RETURN ==========
return {
  json: {
    game_html: html,
    pagina_id: paginaId,
    metadata: {
      mechanic: adaptedConfig.mecanica,
      modality: config.modality?.name || 'quiz',
      character: config.character?.name || 'Lume',
      total_questions: adaptedConfig.fases.filter(f => f.modalidade).length,
      estimated_duration: config.metadata?.estimated_duration || '3-5 minutos'
    }
  }
};
