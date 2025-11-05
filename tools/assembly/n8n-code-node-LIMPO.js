// N8N CODE NODE - GAME ASSEMBLER COM ADAPTADOR
// Converte formato novo (GPT) para formato antigo (Foundation)

// Pegar dados do input
const config = $json.game_config;
const analyzer = $json.analyzer_output;
const paginaId = $json.pagina_id;

// Adaptador de formato
function adaptConfig(newFormat) {
  const adaptedConfig = {
    tema: newFormat.narrative?.theme || 'Jogo Educativo',
    descricao: newFormat.narrative?.intro || '',
    mecanica: newFormat.mechanic?.name || 'escalada',
    fases: []
  };

  // IMPORTANTE: Adicionar fase welcome no array para calculo correto de totalSteps
  // game-engine.js usa fases.length para determinar quantos andares criar
  // 3 perguntas = 4 andares (BASE + 3 andares de progresso)
  adaptedConfig.fases.push({
    type: 'welcome',
    titulo: 'Bem-vindo!',
    mensagem: newFormat.narrative?.intro || ''
  });

  // Fases: Perguntas jogaveis
  if (newFormat.questions && Array.isArray(newFormat.questions)) {
    newFormat.questions.forEach((q) => {
      adaptedConfig.fases.push({
        modalidade: newFormat.modality?.name || 'quiz',
        dados: {
          pergunta: q.text,
          alternativas: q.options,
          correta: q.options.indexOf(q.correct),
          feedback_correto: q.feedback_correct || 'Correto!',
          feedback_errado: q.feedback_wrong || 'Tente novamente!'
        }
      });
    });
  }

  return adaptedConfig;
}

// Adaptar configuração
const adaptedConfig = adaptConfig(config);

// CDN Base URL
const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/1.0.0/";

// Gerar divs das fases dinamicamente
function generatePhasesHTML(fases) {
  let html = '';
  // Fase 0 ja esta no HTML (welcome), entao pular ela e gerar as fases jogaveis
  fases.forEach((fase, index) => {
    // Pular fase 0 (welcome) pois ja esta hardcoded no HTML como phase-0
    if (index === 0) return;

    // index 1 vira phase-1, index 2 vira phase-2, etc
    html += `<div id="phase-${index}" class="phase"></div>`;
  });
  return html;
}

// Construir HTML minificado
const phasesHTML = generatePhasesHTML(adaptedConfig.fases);
const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${adaptedConfig.tema}</title><link rel="stylesheet" href="${CDN_BASE}base.css"><script src="${CDN_BASE}base.js"></script><script src="${CDN_BASE}game-engine.js"></script><script src="${CDN_BASE}bubble-integration.js"></script><script src="${CDN_BASE}mechanics/${adaptedConfig.mecanica}.js"></script><script src="${CDN_BASE}modalities/${config.modality?.name || 'quiz'}.js"></script></head><body><div class="game-container"><div class="header"><h1 id="phase-title">BEM-VINDO!</h1></div><div class="score-container"><div class="score-item">Pontos: <span id="score">0</span></div><div class="score-item">Acertos: <span id="correct-count">0</span></div></div><div id="content-area"><div id="phase-0" class="phase active"><div class="lume-char">🌟</div><div class="story-box"><h1>${adaptedConfig.tema}</h1><p>${adaptedConfig.descricao}</p><button class="btn btn-primary" onclick="startAdventure()">COMEÇAR AVENTURA</button></div></div>${phasesHTML}</div><div id="feedback-zone"></div></div><script>window.GAME_CONFIG=${JSON.stringify(adaptedConfig)};window.ANALYZER_DATA=${JSON.stringify(analyzer)};window.addEventListener("DOMContentLoaded",function(){if(typeof GAME_ENGINE==="undefined"){console.error("GAME_ENGINE nao encontrado");return;}GAME_ENGINE.init(window.GAME_CONFIG);});</script></body></html>`;

// Return
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
