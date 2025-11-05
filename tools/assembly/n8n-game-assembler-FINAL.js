/**
 * N8N CODE NODE: Game Assembler FINAL - VERSÃO FUNCIONANDO
 *
 * INSTRUÇÕES:
 * 1. Copie TODO este código
 * 2. Cole no node "Game Assembler" no N8N
 * 3. Salve e execute
 *
 * Última atualização: 2025-11-04
 */

// ========== CDN ==========
const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/1.0.0/";

// ========== PEGAR INPUT ==========
const item = $input.first();
const gptConfig = item.json.game_config;
const analyzer = item.json.analyzer_output || {};
const paginaId = item.json.pagina_id || null;

// ========== ADAPTER ==========
const adaptedConfig = {
  tema: gptConfig.narrative?.theme || 'Jogo Educativo',
  descricao: gptConfig.narrative?.intro || '',
  mecanica: gptConfig.mechanic?.name || 'escalada',
  fases: []
};

// Fase 0: Welcome
adaptedConfig.fases.push({
  type: 'welcome',
  titulo: 'Bem-vindo!',
  mensagem: gptConfig.narrative?.intro || ''
});

// Fases: Perguntas
gptConfig.questions.forEach((q, i) => {
  const modalityName = gptConfig.modality?.name || 'quiz';

  // DEBUG: Log primeira question
  if (i === 0) {
    console.log('🔍 DEBUG - Primeira question recebida do GPT:');
    console.log(JSON.stringify(q, null, 2));
  }

  let dados = {};

  // ========== SEQUENCE ==========
  if (modalityName === 'sequence') {
    // Tentar pegar itens de várias fontes
    let itens = q.items || q.correct_order;

    // Se não tem, tentar extrair da instrução
    if (!itens && q.text) {
      const match = q.text.match(/[\d,\s]+$/);
      if (match) {
        itens = match[0].split(',').map(n => n.trim());
        console.log(`⚠️ Question ${i+1}: Extraindo itens da instrução:`, itens);
      }
    }

    dados = {
      instrucao: q.text,
      itens: itens,
      ordem_correta: q.correct_order || itens,  // Se não tem ordem_correta, usa itens
      feedback_correto: q.feedback_correct,
      feedback_errado: q.feedback_wrong
    };
  }
  // ========== QUIZ ==========
  else if (modalityName === 'quiz') {
    dados = {
      pergunta: q.text,
      alternativas: q.options,
      correta: q.options.indexOf(q.correct),
      feedback_correto: q.feedback_correct,
      feedback_errado: q.feedback_wrong
    };
  }
  // ========== TRUE-FALSE ==========
  else if (modalityName === 'true-false') {
    dados = {
      afirmacao: q.text,
      correta: q.correct === 'true' || q.correct === true,
      feedback_correto: q.feedback_correct,
      feedback_errado: q.feedback_wrong
    };
  }
  // ========== FILL-BLANKS ==========
  else if (modalityName === 'fill-blanks') {
    dados = {
      frase: q.text,
      resposta: q.correct,
      variacoes_aceitas: q.accepted_variations || [q.correct],
      feedback_correto: q.feedback_correct,
      feedback_errado: q.feedback_wrong,
      dica: q.hint || ''
    };
  }

  adaptedConfig.fases.push({
    modalidade: modalityName,
    dados: dados
  });
});

// ========== GERAR HTML ==========
let phasesHTML = '';
for (let i = 1; i < adaptedConfig.fases.length; i++) {
  phasesHTML += `<div id="phase-${i}" class="phase"></div>\n`;
}

const modalityName = gptConfig.modality?.name || 'quiz';

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${adaptedConfig.tema}</title>
    <link rel="stylesheet" href="${CDN_BASE}base.css">
    <script src="${CDN_BASE}base.js"></script>
    <script src="${CDN_BASE}game-engine.js"></script>
    <script src="${CDN_BASE}bubble-integration.js"></script>
    <script src="${CDN_BASE}mechanics/${adaptedConfig.mecanica}.js"></script>
    <script src="${CDN_BASE}modalities/${modalityName}.js"></script>
</head>
<body>
    <div class="game-container">
        <div class="header">
            <h1 id="phase-title">BEM-VINDO!</h1>
        </div>
        <div class="score-container">
            <div class="score-item">Pontos: <span id="score">0</span></div>
            <div class="score-item">Acertos: <span id="correct-count">0</span></div>
        </div>
        <div id="content-area">
            <div id="phase-0" class="phase active">
                <div class="lume-char">🌟</div>
                <div class="story-box">
                    <h1>${adaptedConfig.tema}</h1>
                    <p>${adaptedConfig.descricao}</p>
                    <button class="btn btn-primary" onclick="startAdventure()">COMEÇAR AVENTURA</button>
                </div>
            </div>
            ${phasesHTML}
        </div>
        <div id="feedback-zone"></div>
    </div>
    <script>
        window.GAME_CONFIG = ${JSON.stringify(adaptedConfig)};
        window.ANALYZER_DATA = ${JSON.stringify(analyzer)};
        window.addEventListener('DOMContentLoaded', function() {
            if (typeof GAME_ENGINE !== 'undefined') {
                GAME_ENGINE.init(window.GAME_CONFIG);
            }
        });
    </script>
</body>
</html>`;

// ========== RETORNAR ==========
return {
  json: {
    game_html: html,
    pagina_id: paginaId,
    metadata: {
      mechanic: adaptedConfig.mecanica,
      modality: modalityName,
      character: gptConfig.character?.name || 'Lume',
      total_questions: adaptedConfig.fases.length - 1,
      total_fases: adaptedConfig.fases.length,
      estimated_duration: gptConfig.metadata?.estimated_duration || '3-5 minutos',
      timestamp: new Date().toISOString()
    }
  }
};
