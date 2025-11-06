/**
 * N8N GAME ASSEMBLER V3.2 - SUPORTA MÚLTIPLAS MODALIDADES + 5 QUESTIONS
 *
 * NOVIDADES V3.2:
 * - Suporta múltiplas modalidades diferentes no mesmo jogo
 * - Question id=0 como "opening" (narrativa inicial)
 * - Questions id=1-4 como perguntas jogáveis
 * - Carrega apenas os scripts necessários (não todos)
 * - Detecta modalidade de cada question individualmente
 *
 * INSTRUÇÕES:
 * 1. Copie TODO este código
 * 2. Cole no Code Node "Game Assembler" no N8N
 * 3. Salve e teste
 *
 * Última atualização: 2025-11-05
 */

// ========== CDN ==========
const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/1.0.0/";

// ========== PEGAR INPUT ==========
const item = $input.first();
const gptConfig = item.json.game_config;
const analyzer = item.json.analyzer_output || {};
const paginaId = item.json.pagina_id || null;

console.log('🎮 Game Assembler V3.2 iniciando...');
console.log('📋 Total de questions recebidas:', gptConfig.questions?.length);

// ========== DETECTAR MODALIDADES USADAS ==========
const modalitiesUsed = new Set();

gptConfig.questions.forEach((q, i) => {
  // Question 0 é "opening", pular
  if (q.id === 0 || q.type === 'opening') {
    console.log(`⏭️ Question ${i} (id=${q.id}) é opening, pulando`);
    return;
  }

  // Detectar modalidade desta question
  const modalityType = q.type || gptConfig.modality?.name || 'quiz';
  modalitiesUsed.add(modalityType);
  console.log(`📝 Question ${i} (id=${q.id}): type="${modalityType}"`);
});

console.log('🎯 Modalidades detectadas:', Array.from(modalitiesUsed));

// ========== FORMATAÇÃO DE TÍTULO ==========
// Função para converter underscores em título formatado
function formatTitle(str) {
  if (!str) return 'Jogo Educativo';

  // Remover underscores e capitalizar cada palavra
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// ========== ADAPTER ==========
const adaptedConfig = {
  tema: formatTitle(gptConfig.narrative?.theme) || 'Jogo Educativo',
  descricao: gptConfig.narrative?.intro || '',
  mecanica: gptConfig.mechanic?.name || 'escalada',
  fases: []
};

// ========== PROCESSAR QUESTIONS ==========
gptConfig.questions.forEach((q, i) => {
  console.log(`\n🔍 Processando question ${i} (id=${q.id}):`);

  // ========== QUESTION 0: OPENING ==========
  if (q.id === 0 || q.type === 'opening') {
    console.log('  → Tipo: OPENING (narrativa)');
    adaptedConfig.fases.push({
      type: 'welcome',
      titulo: 'Bem-vindo!',
      mensagem: q.text || gptConfig.narrative?.intro || ''
    });
    return;
  }

  // ========== QUESTIONS 1-4: PERGUNTAS JOGÁVEIS ==========
  const modalityType = q.type || gptConfig.modality?.name || 'quiz';
  console.log(`  → Tipo: ${modalityType.toUpperCase()}`);

  let dados = {};

  // ========== SEQUENCE ==========
  if (modalityType === 'sequence') {
    dados = {
      instrucao: q.text,
      itens: q.options || q.items || [],
      ordem_correta: q.correct_order || q.options || [],
      feedback_correto: q.feedback_correct || '✅ Correto!',
      feedback_errado: q.feedback_wrong || '❌ Tente novamente!'
    };
    console.log('  → Items:', dados.itens.length);
    console.log('  → Ordem correta:', dados.ordem_correta.length);
  }
  // ========== QUIZ ==========
  else if (modalityType === 'quiz') {
    const correctIndex = q.options ? q.options.indexOf(q.correct) : 0;
    dados = {
      pergunta: q.text,
      alternativas: q.options || [],
      correta: correctIndex >= 0 ? correctIndex : 0,
      feedback_correto: q.feedback_correct || '✅ Correto!',
      feedback_errado: q.feedback_wrong || '❌ Errado!'
    };
    console.log('  → Alternativas:', dados.alternativas.length);
    console.log('  → Correta:', dados.correta);
  }
  // ========== TRUE-FALSE ==========
  else if (modalityType === 'true-false') {
    dados = {
      afirmacao: q.text,
      correta: q.correct === 'true' || q.correct === true,
      feedback_correto: q.feedback_correct || '✅ Verdadeiro!',
      feedback_errado: q.feedback_wrong || '❌ Falso!'
    };
    console.log('  → Correta:', dados.correta);
  }
  // ========== FILL-BLANKS ==========
  else if (modalityType === 'fill-blanks') {
    dados = {
      frase: q.text,
      resposta: q.correct || '',
      variacoes_aceitas: q.accepted_variations || [q.correct],
      feedback_correto: q.feedback_correct || '✅ Correto!',
      feedback_errado: q.feedback_wrong || '❌ Errado!',
      dica: q.hint || ''
    };
    console.log('  → Resposta esperada:', dados.resposta);
  }

  adaptedConfig.fases.push({
    modalidade: modalityType,
    dados: dados  // ✅ REVERTIDO: Mantém estrutura original com camada "dados"
  });
});

console.log('\n✅ Adaptação completa:');
console.log('📊 Total de fases:', adaptedConfig.fases.length);
console.log('🎯 Fases:', adaptedConfig.fases.map((f, i) => `${i}:${f.type || f.modalidade}`).join(', '));

// ========== GERAR SCRIPTS TAGS ==========
// Carregar apenas as modalidades usadas
const modalityScripts = Array.from(modalitiesUsed)
  .map(mod => `<script src="${CDN_BASE}modalities/${mod}.js"></script>`)
  .join('\n    ');

console.log('\n📦 Scripts de modalidades a carregar:');
Array.from(modalitiesUsed).forEach(mod => {
  console.log(`  - ${mod}.js`);
});

// ========== GERAR PHASES HTML ==========
let phasesHTML = '';
for (let i = 1; i < adaptedConfig.fases.length; i++) {
  phasesHTML += `<div id="phase-${i}" class="phase"></div>\n        `;
}

// ========== GERAR HTML COMPLETO ==========
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${adaptedConfig.tema}</title>

    <!-- CSS -->
    <link rel="stylesheet" href="${CDN_BASE}base.css">

    <!-- OVERRIDE: Remove body flexbox para funcionar no Bubble -->
    <style>
        body {
            background: transparent !important;
            min-height: auto !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .game-container {
            margin: 0 auto;
            max-width: 100% !important;
        }
    </style>

    <!-- Bubble API Key (injetada antes dos scripts) -->
    <script>
        window.BUBBLE_API_KEY = '88e05eb46922dfdd80c8bce8a7fea914';
    </script>

    <!-- Core Scripts -->
    <script src="${CDN_BASE}base.js"></script>
    <script src="${CDN_BASE}game-engine.js"></script>
    <script src="${CDN_BASE}bubble-integration.js"></script>

    <!-- Mechanic -->
    <script src="${CDN_BASE}mechanics/${adaptedConfig.mecanica}.js"></script>

    <!-- Modalities (apenas as usadas) -->
    ${modalityScripts}
</head>
<body>
    <div class="game-container">
        <!-- Header -->
        <div class="header">
            <h1 id="phase-title">BEM-VINDO!</h1>
        </div>

        <!-- Score -->
        <div class="score-container">
            <div class="score-item">Pontos: <span id="score">0</span></div>
            <div class="score-item">Acertos: <span id="correct-count">0</span></div>
        </div>

        <!-- Feedback Zone -->
        <div id="feedback-zone" class="feedback"></div>

        <!-- Content Area -->
        <div id="content-area">
            <!-- Phase 0: Welcome/Opening -->
            <div id="phase-0" class="phase active">
                <div class="lume-char">🌟</div>
                <div class="story-box">
                    <h1>${adaptedConfig.tema}</h1>
                    <p>${adaptedConfig.descricao}</p>
                    <button class="btn btn-primary" onclick="startAdventure()">COMEÇAR AVENTURA</button>
                </div>
            </div>

            <!-- Phases 1-N: Questions -->
            ${phasesHTML}
        </div>
    </div>

    <!-- Game Config -->
    <script>
        // ========== LIMPEZA DE JOGO ANTERIOR ==========
        // Importante para Bubble SPA que pode re-injetar HTML
        if (window.gameState && window.gameState.initialized) {
            console.log('🧹 Limpando jogo anterior...');
            window.gameState = null;
        }

        // Configuração do jogo injetada (var permite redeclaração)
        var GAME_CONFIG = ${JSON.stringify(adaptedConfig, null, 2)};

        console.log('🎮 GAME_CONFIG injetado:', GAME_CONFIG);

        // Modalidades necessárias para este jogo (var permite redeclaração)
        var REQUIRED_MODALITIES = ${JSON.stringify(Array.from(modalitiesUsed))};

        // Função de inicialização ROBUSTA (compatível com Bubble SPA)
        function initGame() {
            console.log('🔄 Tentando inicializar Game Engine...');

            // 0. Prevenir múltiplas inicializações simultâneas
            if (window.gameState && window.gameState.initializing) {
                console.log('⏭️ Já está inicializando, ignorando chamada duplicada');
                return;
            }

            // 1. Verificar se GAME_ENGINE carregou
            if (typeof GAME_ENGINE === 'undefined') {
                console.log('⏳ GAME_ENGINE ainda não carregado, tentando novamente em 100ms...');
                setTimeout(initGame, 100);
                return;
            }

            // 2. Verificar se todas as modalidades necessárias carregaram
            const modalidadesCarregadas = REQUIRED_MODALITIES.filter(mod => {
                return GAME_ENGINE.getModalidade(mod) !== undefined;
            });

            if (modalidadesCarregadas.length < REQUIRED_MODALITIES.length) {
                const faltando = REQUIRED_MODALITIES.filter(mod => {
                    return GAME_ENGINE.getModalidade(mod) === undefined;
                });
                console.log('⏳ Aguardando modalidades carregarem...');
                console.log('   Carregadas:', modalidadesCarregadas.join(', '));
                console.log('   Faltando:', faltando.join(', '));
                setTimeout(initGame, 100);
                return;
            }

            // 3. Tudo pronto! Inicializar o jogo
            console.log('✅ GAME_ENGINE e todas as modalidades carregados!');
            console.log('   Modalidades:', REQUIRED_MODALITIES.join(', '));

            // Marcar que está inicializando
            if (!window.gameState) window.gameState = {};
            window.gameState.initializing = true;

            GAME_ENGINE.init(GAME_CONFIG);
        }

        // Inicializar imediatamente (para Bubble SPA)
        initGame();

        // Fallback: também tentar no evento load (para sites estáticos)
        window.addEventListener('load', function() {
            console.log('📦 Evento load disparado');
            if (!window.gameState || !window.gameState.initialized) {
                initGame();
            }
        });

        // NOTA: startAdventure() já está definida no base.js
        // Não precisamos redefinir aqui
    </script>
</body>
</html>`;

// ========== RETORNAR RESULTADO ==========
console.log('\n✅ HTML gerado com sucesso!');
console.log('📏 Tamanho:', html.length, 'chars');

return {
  json: {
    game_html: html,
    pagina_id: paginaId,
    metadata: {
      total_fases: adaptedConfig.fases.length,
      mecanica: adaptedConfig.mecanica,
      modalidades_usadas: Array.from(modalitiesUsed),
      tema: adaptedConfig.tema,
      timestamp: new Date().toISOString()
    }
  }
};
