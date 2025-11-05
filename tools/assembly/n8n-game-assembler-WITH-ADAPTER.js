/**
 * N8N CODE NODE: Game Assembler COM ADAPTER
 *
 * POSIÇÃO: Depois do "Parse GPT Output"
 *
 * FUNÇÃO:
 * - Converte formato GPT (novo) → Foundation (antigo)
 * - Adapta dados específicos por modalidade
 * - Gera HTML completo do jogo
 *
 * INPUT esperado:
 * {
 *   game_config: {
 *     mechanic: {name: "escalada", rationale: "..."},
 *     modality: {name: "quiz", rationale: "..."},
 *     character: {name: "Max", quotes: {...}},
 *     narrative: {theme: "...", intro: "..."},
 *     questions: [{text: "...", options: [...], correct: "...", ...}],
 *     metadata: {total_questions: 4, ...}
 *   },
 *   analyzer_output: {...},
 *   pagina_id: "..."
 * }
 *
 * OUTPUT:
 * {
 *   game_html: "<html>...</html>",
 *   pagina_id: "...",
 *   metadata: {...}
 * }
 */

// ========== CDN BASE URL ==========
const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/1.0.0/";

// ========== ADAPTER DE FORMATO ==========
/**
 * Converte formato GPT (inglês, nested) → Foundation (português, flat)
 */
function adaptConfig(gptFormat) {
  console.log('🔄 Adaptando configuração GPT → Foundation...');

  const adaptedConfig = {
    tema: gptFormat.narrative?.theme || 'Jogo Educativo',
    descricao: gptFormat.narrative?.intro || '',
    mecanica: gptFormat.mechanic?.name || 'escalada',
    fases: []
  };

  // FASE 0: Welcome (obrigatória)
  adaptedConfig.fases.push({
    type: 'welcome',
    titulo: 'Bem-vindo!',
    mensagem: gptFormat.narrative?.intro || ''
  });

  // FASES: Perguntas jogáveis
  if (gptFormat.questions && Array.isArray(gptFormat.questions)) {
    const modalityName = gptFormat.modality?.name || 'quiz';

    gptFormat.questions.forEach((question, index) => {
      console.log(`📝 Adaptando pergunta ${index + 1} (${modalityName})`);

      try {
        const dadosAdaptados = adaptModalityData(modalityName, question);

        adaptedConfig.fases.push({
          modalidade: modalityName,
          dados: dadosAdaptados
        });

        console.log(`✅ Pergunta ${index + 1} adaptada`);

      } catch (error) {
        console.error(`❌ Erro ao adaptar pergunta ${index + 1}:`, error.message);
        // Continuar mesmo com erro para não quebrar todo o jogo
      }
    });
  }

  console.log('✅ Configuração adaptada:', adaptedConfig.fases.length, 'fases');
  return adaptedConfig;
}

/**
 * Adapta dados específicos por modalidade
 */
function adaptModalityData(modality, question) {
  switch (modality) {

    // ========== QUIZ ==========
    case 'quiz':
      if (!question.options || !Array.isArray(question.options)) {
        throw new Error('Quiz precisa de "options" (array)');
      }

      // Converter correct (string) → correta (index)
      let correctIndex = -1;
      if (typeof question.correct === 'number') {
        correctIndex = question.correct;
      } else if (typeof question.correct === 'string') {
        correctIndex = question.options.indexOf(question.correct);
      }

      if (correctIndex === -1) {
        console.warn('Resposta correta não encontrada, usando primeira opção');
        correctIndex = 0;
      }

      return {
        pergunta: question.text || '',
        alternativas: question.options,
        correta: correctIndex,
        feedback_correto: question.feedback_correct || 'Correto!',
        feedback_errado: question.feedback_wrong || 'Tente novamente!'
      };

    // ========== TRUE-FALSE ==========
    case 'true-false':
      // Converter correct → boolean
      let correctBool = false;
      if (typeof question.correct === 'boolean') {
        correctBool = question.correct;
      } else if (typeof question.correct === 'string') {
        correctBool = question.correct.toLowerCase() === 'true' || question.correct.toLowerCase() === 'verdadeiro';
      }

      return {
        afirmacao: question.text || '',
        correta: correctBool,
        feedback_correto: question.feedback_correct || 'Correto!',
        feedback_errado: question.feedback_wrong || 'Incorreto!'
      };

    // ========== FILL-BLANKS ==========
    case 'fill-blanks':
      return {
        frase: question.text || '',
        resposta: question.correct || '',
        variacoes_aceitas: question.accepted_variations || [question.correct],
        feedback_correto: question.feedback_correct || 'Correto!',
        feedback_errado: question.feedback_wrong || 'Tente novamente!',
        dica: question.hint || ''
      };

    // ========== SEQUENCE ==========
    case 'sequence':
      if (!question.items || !Array.isArray(question.items)) {
        throw new Error('Sequence precisa de "items" (array)');
      }

      if (!question.correct_order || !Array.isArray(question.correct_order)) {
        throw new Error('Sequence precisa de "correct_order" (array)');
      }

      return {
        instrucao: question.text || 'Ordene os itens:',
        itens: question.items,
        ordem_correta: question.correct_order,
        feedback_correto: question.feedback_correct || 'Ordem correta!',
        feedback_errado: question.feedback_wrong || 'Ordem incorreta!'
      };

    // ========== FALLBACK ==========
    default:
      console.warn(`⚠️ Modalidade desconhecida: ${modality}, usando quiz como fallback`);
      return {
        pergunta: question.text || 'Pergunta sem texto',
        alternativas: question.options || ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        correta: 0,
        feedback_correto: 'Correto!',
        feedback_errado: 'Tente novamente!'
      };
  }
}

// ========== GERAÇÃO DE HTML ==========
/**
 * Gera divs das fases dinamicamente
 */
function generatePhasesHTML(fases) {
  let html = '';

  fases.forEach((fase, index) => {
    // Pular fase 0 (welcome já está hardcoded no HTML)
    if (index === 0) return;

    html += `<div id="phase-${index}" class="phase"></div>\n`;
  });

  return html;
}

/**
 * Monta HTML completo do jogo
 */
function buildHTML(adaptedConfig, originalConfig, metadata) {
  const phasesHTML = generatePhasesHTML(adaptedConfig.fases);
  const modalityName = originalConfig.modality?.name || 'quiz';

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${adaptedConfig.tema}</title>

    <!-- CDN Styles -->
    <link rel="stylesheet" href="${CDN_BASE}base.css">

    <!-- CDN Scripts -->
    <script src="${CDN_BASE}base.js"></script>
    <script src="${CDN_BASE}game-engine.js"></script>
    <script src="${CDN_BASE}bubble-integration.js"></script>
    <script src="${CDN_BASE}mechanics/${adaptedConfig.mecanica}.js"></script>
    <script src="${CDN_BASE}modalities/${modalityName}.js"></script>
</head>
<body>
    <div class="game-container">
        <!-- Header -->
        <div class="header">
            <h1 id="phase-title">BEM-VINDO!</h1>
        </div>

        <!-- Score -->
        <div class="score-container">
            <div class="score-item">
                Pontos: <span id="score">0</span>
            </div>
            <div class="score-item">
                Acertos: <span id="correct-count">0</span>
            </div>
        </div>

        <!-- Content Area -->
        <div id="content-area">
            <!-- Fase 0: Boas-vindas -->
            <div id="phase-0" class="phase active">
                <div class="lume-char">🌟</div>
                <div class="story-box">
                    <h1>${adaptedConfig.tema}</h1>
                    <p>${adaptedConfig.descricao}</p>
                    <button class="btn btn-primary" onclick="startAdventure()">
                        COMEÇAR AVENTURA
                    </button>
                </div>
            </div>

            <!-- Fases dinâmicas -->
            ${phasesHTML}
        </div>

        <!-- Feedback Zone -->
        <div id="feedback-zone"></div>
    </div>

    <!-- Game Configuration -->
    <script>
        window.GAME_CONFIG = ${JSON.stringify(adaptedConfig)};
        window.ANALYZER_DATA = ${JSON.stringify(metadata.analyzer_output || {})};

        window.addEventListener('DOMContentLoaded', function() {
            console.log('🎮 Inicializando jogo...');
            console.log('📊 Config:', window.GAME_CONFIG);

            if (typeof GAME_ENGINE === 'undefined') {
                console.error('❌ GAME_ENGINE não encontrado!');
                alert('Erro: Game Engine não carregado. Verifique o CDN.');
                return;
            }

            try {
                GAME_ENGINE.init(window.GAME_CONFIG);
                console.log('✅ Jogo inicializado com sucesso!');
            } catch (error) {
                console.error('❌ Erro ao inicializar:', error);
                alert('Erro ao inicializar jogo: ' + error.message);
            }
        });
    </script>
</body>
</html>`;

  return html;
}

// ========== EXECUÇÃO N8N ==========
try {
  console.log('🎮 Game Assembler - Iniciando...');

  // Pegar dados do input
  const item = $input.first();

  if (!item || !item.json) {
    throw new Error('Input vazio ou inválido');
  }

  const gptConfig = item.json.game_config;
  const analyzer = item.json.analyzer_output || {};
  const paginaId = item.json.pagina_id || null;

  if (!gptConfig) {
    console.error('❌ game_config não encontrado. Input recebido:', JSON.stringify(item.json, null, 2));
    throw new Error('game_config não encontrado no input');
  }

  if (!gptConfig.questions || !Array.isArray(gptConfig.questions) || gptConfig.questions.length === 0) {
    console.error('❌ questions inválido ou vazio');
    throw new Error('game_config.questions está vazio ou não é um array');
  }

  console.log('📥 Input recebido');
  console.log('   - Mecânica:', gptConfig.mechanic?.name);
  console.log('   - Modalidade:', gptConfig.modality?.name);
  console.log('   - Perguntas:', gptConfig.questions?.length);

  // Adaptar configuração
  const adaptedConfig = adaptConfig(gptConfig);

  // Gerar HTML
  const html = buildHTML(adaptedConfig, gptConfig, { analyzer_output: analyzer });

  console.log('✅ HTML gerado:', html.length, 'caracteres');

  // Retornar
  return {
    json: {
      game_html: html,
      pagina_id: paginaId,
      metadata: {
        mechanic: adaptedConfig.mecanica,
        modality: gptConfig.modality?.name || 'quiz',
        character: gptConfig.character?.name || 'Lume',
        total_questions: adaptedConfig.fases.filter(f => f.modalidade).length,
        total_fases: adaptedConfig.fases.length,
        estimated_duration: gptConfig.metadata?.estimated_duration || '3-5 minutos',
        timestamp: new Date().toISOString()
      }
    }
  };

} catch (error) {
  console.error('❌ ERRO no Game Assembler:', error.message);
  console.error('Stack:', error.stack);

  return {
    json: {
      error: error.message,
      status: 'error_assembler',
      timestamp: new Date().toISOString()
    }
  };
}
