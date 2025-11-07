/**
 * 🎮 GAME ASSEMBLER N8N - VERSÃO FINAL
 *
 * Aceita AMBOS os formatos:
 * 1. Formato novo (Claude atual): {titulo, tema, mecanica, fases: [...]}
 * 2. Formato antigo (se vier): {mechanic, questions: [...]}
 *
 * COMO USAR:
 * 1. Copie TODO este código
 * 2. Cole no Code Node "Game Assembler" no N8N
 * 3. Salve e teste
 */

// ========== CONFIGURAÇÃO CDN ==========
const CDN_BASE_URL = 'https://brunoferrarisouza.github.io/ialume-factory';
const VERSION = '1.0.0';
const CDN_PATH = `${CDN_BASE_URL}/${VERSION}`;

// ========== CONFIGURAÇÃO SUPABASE ==========
const SUPABASE_URL = 'https://snashefcgefkhyuzqpoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYXNoZWZjZ2Vma2h5dXpxcG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE4MDYsImV4cCI6MjA3ODA0NzgwNn0.M3Apme4fyAn8QESnLf-0IMTGoCbt4AWSiCWJ3vnYfyc';

// ========== PEGAR INPUT N8N ==========
const item = $input.first();
const inputConfig = item.json.config;
const analyzer = item.json.analyzer_output || {};
const paginaId = item.json.pagina_id || null;

console.log('🎮 Game Assembler N8N FINAL iniciando...');
console.log('📦 Chaves no config:', Object.keys(inputConfig).join(', '));

// ========== DETECTAR FORMATO E ADAPTAR ==========
let adaptedConfig;

if (inputConfig.fases && Array.isArray(inputConfig.fases)) {
  // ========== FORMATO NOVO (Claude atual): já tem "fases" ==========
  console.log('✅ Formato detectado: NOVO (fases prontas)');

  adaptedConfig = {
    titulo: inputConfig.titulo || 'Jogo Educativo',
    tema: inputConfig.tema || 'Jogo Educativo',
    mecanica: inputConfig.mecanica || 'escalada',
    cenario: inputConfig.cenario || 'montanha-nevada',
    fases: inputConfig.fases
  };

  console.log('📊 Total de fases:', adaptedConfig.fases.length);
  console.log('📊 Mecânica:', adaptedConfig.mecanica);
  console.log('📊 Cenário:', adaptedConfig.cenario);

} else if (inputConfig.questions && Array.isArray(inputConfig.questions)) {
  // ========== FORMATO ANTIGO: precisa converter "questions" → "fases" ==========
  console.log('✅ Formato detectado: ANTIGO (questions)');

  // Função helper
  function formatTitle(str) {
    if (!str) return 'Jogo Educativo';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  adaptedConfig = {
    titulo: formatTitle(inputConfig.narrative?.theme) || 'Jogo Educativo',
    tema: formatTitle(inputConfig.narrative?.theme) || 'Jogo Educativo',
    mecanica: inputConfig.mechanic?.name || inputConfig.mechanic || 'escalada',
    cenario: inputConfig.mechanic?.scenery || 'montanha-nevada',
    fases: []
  };

  // Converter questions → fases
  inputConfig.questions.forEach((q, i) => {
    if (q.id === 0 || q.type === 'opening') {
      adaptedConfig.fases.push({
        numero: 0,
        type: 'welcome',
        narrativa: q.text || inputConfig.narrative?.intro || 'Bem-vindo!',
        botao: 'Começar Aventura!'
      });
    } else {
      const modalityType = q.type || inputConfig.modality?.name || 'quiz';
      let dados = {};

      if (modalityType === 'quiz') {
        const correctIndex = q.options ? q.options.indexOf(q.correct) : 0;
        dados = {
          pergunta: q.text,
          alternativas: q.options || [],
          correta: correctIndex >= 0 ? correctIndex : 0,
          feedback_correto: q.feedback_correct || '✅ Correto!',
          feedback_errado: q.feedback_wrong || '❌ Errado!'
        };
      } else if (modalityType === 'true-false') {
        dados = {
          afirmacao: q.text,
          correta: q.correct === 'true' || q.correct === true,
          feedback_correto: q.feedback_correct || '✅ Verdadeiro!',
          feedback_errado: q.feedback_wrong || '❌ Falso!'
        };
      } else if (modalityType === 'fill-blanks') {
        dados = {
          frase: q.text,
          resposta: q.correct || '',
          variacoes_aceitas: q.accepted_variations || [q.correct],
          feedback_correto: q.feedback_correct || '✅ Correto!',
          feedback_errado: q.feedback_wrong || '❌ Errado!',
          dica: q.hint || ''
        };
      } else if (modalityType === 'sequence') {
        dados = {
          instrucao: q.text,
          itens: q.options || q.items || [],
          ordem_correta: q.correct_order || q.options || [],
          feedback_correto: q.feedback_correct || '✅ Correto!',
          feedback_errado: q.feedback_wrong || '❌ Errado!'
        };
      }

      adaptedConfig.fases.push({
        numero: q.id,
        modalidade: modalityType,
        dados: dados
      });
    }
  });

  console.log('📊 Questions convertidas:', inputConfig.questions.length);
  console.log('📊 Fases geradas:', adaptedConfig.fases.length);

} else {
  throw new Error('Formato inválido: esperado "fases" ou "questions". Recebido: ' + Object.keys(inputConfig).join(', '));
}

// ========== DETECTAR MODALIDADES USADAS ==========
const modalitiesUsed = new Set();
adaptedConfig.fases.forEach(fase => {
  if (fase.modalidade) {
    modalitiesUsed.add(fase.modalidade);
  }
});

console.log('🎯 Modalidades detectadas:', Array.from(modalitiesUsed).join(', '));

// ========== GERAR SCRIPTS TAGS ==========
const modalityScripts = Array.from(modalitiesUsed)
  .map(mod => `<script src="${CDN_PATH}/modalities/${mod}.js"></script>`)
  .join('\n    ');

// ========== GERAR HTML COMPLETO ==========
const htmlGerado = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${adaptedConfig.tema}</title>

    <!-- CSS do CDN -->
    <link rel="stylesheet" href="${CDN_PATH}/base.css">

    <style>
        #loading-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 9999; color: white;
        }
        .spinner {
            border: 8px solid rgba(255,255,255,0.3); border-top: 8px solid white;
            border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes cameraZoomIn { 0% { transform: scale(0.6); } 100% { transform: scale(1); } }
        .game-container.camera-intro {
            animation: cameraZoomIn 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            transform-origin: center center;
        }
    </style>
</head>
<body>
    <div id="loading-overlay">
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 1.2rem;">Carregando jogo...</p>
    </div>

    <div class="game-container" style="display: none;">
        <div id="feedback-zone" class="feedback"></div>
    </div>

    <script src="${CDN_PATH}/particles.js"></script>
    <script src="${CDN_PATH}/audio.js"></script>
    <script src="${CDN_PATH}/decorations.js"></script>
    <script src="${CDN_PATH}/base.js"></script>
    <script src="${CDN_PATH}/game-engine.js"></script>
    <script src="${CDN_PATH}/bubble-integration.js"></script>
    <script src="${CDN_PATH}/mechanics/escalada.js"></script>
    <script src="${CDN_PATH}/mechanics/perseguicao.js"></script>
    ${modalityScripts}

    <script>
        // 🛡️ Proteção contra re-injeção do Bubble SPA
        if (window.gameState?.initialized) {
            console.log('🧹 Limpando jogo anterior (re-injeção detectada)');
            window.gameState = null;
        }

        // 🎮 Configurações (var permite redeclaração em Bubble SPA reativo)
        var GAME_CONFIG = ${JSON.stringify(adaptedConfig, null, 2)};
        var ANALYZER_DATA = ${JSON.stringify(analyzer)};
        var SUPABASE_URL = '${SUPABASE_URL}';
        var SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';

        async function fetchSupabase(table, query = '') {
            const url = \`\${SUPABASE_URL}/rest/v1/\${table}?\${query}\`;
            const response = await fetch(url, {
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\` }
            });
            if (!response.ok) throw new Error(\`Erro ao buscar \${table}: \${response.statusText}\`);
            return response.json();
        }

        async function loadAssets(cenario) {
            console.log(\`📦 Carregando assets do Supabase: \${cenario}\`);
            try {
                const [decorations, sceneryData, audios] = await Promise.all([
                    fetchSupabase('scenery_decorations', \`scenery_id=eq.\${cenario}&is_active=eq.true\`),
                    fetchSupabase('scenery_assets', \`scenery_id=eq.\${cenario}&is_active=eq.true\`),
                    fetchSupabase('media_assets', 'is_active=eq.true')
                ]);
                console.log(\`✅ Assets: \${decorations.length} decorações, \${audios.length} áudios\`);
                return { decorations, scenery: sceneryData[0] || null, audios };
            } catch (error) {
                console.warn('⚠️ Erro ao carregar assets:', error.message);
                return { decorations: [], scenery: null, audios: [] };
            }
        }

        console.log('🔧 Script inline iniciando...');
        console.log('📦 GAME_CONFIG:', GAME_CONFIG);

        async function initGame() {
            console.log('🎮 initGame() CHAMADO!');
            console.log('🔍 GAME_ENGINE disponível?', typeof GAME_ENGINE !== 'undefined');

            try {
                console.log('📋 Configuração recebida:', GAME_CONFIG);

                if (GAME_CONFIG.cenario) {
                    console.log('🎨 Carregando assets para cenário:', GAME_CONFIG.cenario);
                    const assets = await loadAssets(GAME_CONFIG.cenario);
                    console.log('✅ Assets carregados:', assets);

                    window.gameConfig = {
                        ...GAME_CONFIG,
                        decorations: assets.decorations,
                        scenery: assets.scenery,
                        audio: assets.audios.length > 0 ? {
                            musicUrl: assets.audios.find(a => a.media_id === 'musica-principal')?.file_url,
                            windUrl: assets.audios.find(a => a.media_id === 'som-vento')?.file_url,
                            coinUrl: assets.audios.find(a => a.media_id === 'som-moeda')?.file_url,
                            flightUrl: assets.audios.find(a => a.media_id === 'som-voo-lume')?.file_url,
                            questionUrl: assets.audios.find(a => a.media_id === 'som-nova-pergunta')?.file_url
                        } : undefined
                    };
                } else {
                    console.log('⏭️ Sem cenário configurado, usando config direto');
                    window.gameConfig = GAME_CONFIG;
                }

                console.log('🎮 Removendo loading overlay...');
                document.getElementById('loading-overlay').style.display = 'none';
                document.querySelector('.game-container').style.display = 'block';

                console.log('🚀 Inicializando GAME_ENGINE...');
                if (typeof GAME_ENGINE !== 'undefined') {
                    GAME_ENGINE.init(window.gameConfig);
                    console.log('✅ Jogo inicializado com sucesso!');
                } else {
                    throw new Error('GAME_ENGINE não encontrado');
                }
            } catch (error) {
                console.error('❌ Erro em initGame():', error);
                console.error('Stack:', error.stack);
                document.getElementById('loading-overlay').style.display = 'none';
                const container = document.querySelector('.game-container');
                container.style.display = 'block';
                container.innerHTML = '<div style="text-align: center; padding: 40px; color: #e74c3c;"><h2>Erro ao carregar jogo</h2><p>' + error.message + '</p></div>';
            }
        }

        // ✅ MÚLTIPLAS ESTRATÉGIAS para garantir que initGame() seja chamado

        // 1. Evento load (padrão)
        window.addEventListener('load', function() {
            console.log('🎯 Evento LOAD disparado');
            initGame();
        });

        // 2. DOMContentLoaded (mais rápido, para iframes)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🎯 Evento DOMContentLoaded disparado');
                setTimeout(initGame, 100); // 100ms para garantir que scripts carregaram
            });
        } else {
            // DOM já carregado, chamar imediatamente
            console.log('🎯 DOM já carregado, chamando initGame() em 100ms');
            setTimeout(initGame, 100);
        }

        // 3. Fallback: tentar após 500ms
        setTimeout(function() {
            if (!window.gameConfig) {
                console.log('⚠️ FALLBACK: Jogo ainda não inicializou após 500ms, tentando agora...');
                initGame();
            }
        }, 500);

        // Log de erros de scripts
        window.addEventListener('error', function(e) {
            if (e.target.tagName === 'SCRIPT') {
                console.error('❌ Erro ao carregar script:', e.target.src);
            }
        });
    </script>
</body>
</html>`;

console.log('\n✅ HTML gerado com sucesso!');
console.log('📦 Tamanho:', htmlGerado.length, 'caracteres');

// ========== RETORNO NO FORMATO N8N ==========
return [{
  json: {
    html: htmlGerado,
    success: true,
    timestamp: new Date().toISOString(),
    config: {
      titulo: adaptedConfig.titulo,
      tema: adaptedConfig.tema,
      mecanica: adaptedConfig.mecanica,
      cenario: adaptedConfig.cenario,
      totalFases: adaptedConfig.fases.length,
      modalidades: Array.from(modalitiesUsed)
    },
    pagina_id: paginaId
  }
}];
