/**
 * 🎮 GAME ASSEMBLER LOCAL - PARA TESTES
 *
 * Versão que usa arquivos locais em vez do CDN
 * Use este para testar antes de fazer deploy
 */

/**
 * Gera HTML completo do jogo usando arquivos locais
 * @param {Object} config - Configuração do jogo
 * @returns {string} HTML completo
 */
function gerarJogoCompleto(config) {
  // ✅ Tratamento de analyzer undefined
  const safeAnalyzer = config.analyzer || null;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.tema || 'Jogo IAlume'}</title>

    <!-- CSS LOCAL -->
    <link rel="stylesheet" href="../base/styles/base.css">

    <style>
        /* Loader enquanto carrega scripts */
        #loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        }
        .spinner {
            border: 8px solid rgba(255,255,255,0.3);
            border-top: 8px solid white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* ✨ CÂMERA INTRO: Zoom in suave (3s) */
        @keyframes cameraZoomIn {
            0% { transform: scale(0.6); }
            100% { transform: scale(1); }
        }
        .game-container.camera-intro {
            animation: cameraZoomIn 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            transform-origin: center center;
        }
    </style>
</head>
<body>
    <!-- Loading overlay -->
    <div id="loading-overlay">
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 1.2rem;">Carregando jogo...</p>
    </div>

    <!-- Container do jogo -->
    <div class="game-container" style="display: none;">
        <!-- Feedback Zone -->
        <div id="feedback-zone" class="feedback"></div>
    </div>

    <!-- Scripts LOCAIS -->
    <!-- Core -->
    <script src="../base/scripts/particles.js"></script>
    <script src="../base/scripts/audio.js"></script>
    <script src="../base/scripts/decorations.js"></script>
    <script src="../base/scripts/base.js"></script>
    <script src="../base/scripts/game-engine.js"></script>
    <script src="../base/scripts/bubble-integration.js"></script>

    <!-- Mechanics -->
    <script src="../mechanics/escalada.js"></script>
    <script src="../mechanics/perseguicao.js"></script>

    <!-- Modalities -->
    <script src="../modalities/quiz.js"></script>
    <script src="../modalities/true-false.js"></script>
    <script src="../modalities/fill-blanks.js"></script>
    <script src="../modalities/sequence.js"></script>

    <!-- Configuração e Inicialização -->
    <script>
        // Dados do jogo injetados
        const GAME_CONFIG = ${JSON.stringify(config, null, 2)};
        const ANALYZER_DATA = ${JSON.stringify(safeAnalyzer)};

        // Configuração Supabase
        const SUPABASE_URL = 'https://snashefcgefkhyuzqpoz.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYXNoZWZjZ2Vma2h5dXpxcG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE4MDYsImV4cCI6MjA3ODA0NzgwNn0.M3Apme4fyAn8QESnLf-0IMTGoCbt4AWSiCWJ3vnYfyc';

        /**
         * Buscar dados do Supabase
         */
        async function fetchSupabase(table, query = '') {
            const url = \`\${SUPABASE_URL}/rest/v1/\${table}?\${query}\`;
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`
                }
            });

            if (!response.ok) {
                throw new Error(\`Erro ao buscar \${table}: \${response.statusText}\`);
            }

            return response.json();
        }

        /**
         * Carregar assets do Supabase baseado no cenário
         */
        async function loadAssets(cenario) {
            console.log(\`📦 Carregando assets do Supabase para cenário: \${cenario}\`);

            try {
                // Buscar em paralelo
                const [decorations, sceneryData, audios] = await Promise.all([
                    // Decorations
                    fetchSupabase('scenery_decorations', \`scenery_id=eq.\${cenario}&is_active=eq.true\`),

                    // Scenery backgrounds
                    fetchSupabase('scenery_assets', \`scenery_id=eq.\${cenario}&is_active=eq.true\`),

                    // Audios (todos, não específicos do cenário)
                    fetchSupabase('media_assets', 'is_active=eq.true')
                ]);

                console.log(\`✅ Assets carregados:\`);
                console.log(\`   - \${decorations.length} decorações\`);
                console.log(\`   - \${sceneryData.length} cenário\`);
                console.log(\`   - \${audios.length} áudios\`);

                return { decorations, scenery: sceneryData[0] || null, audios };

            } catch (error) {
                console.warn('⚠️ Erro ao carregar assets do Supabase:', error.message);
                console.warn('   Jogo continuará sem assets dinâmicos');
                return { decorations: [], scenery: null, audios: [] };
            }
        }

        /**
         * Inicializar jogo com assets
         */
        async function initGame() {
            console.log('🎮 Todos os scripts carregados');
            console.log('📋 Config:', GAME_CONFIG);

            try {
                // Carregar assets do Supabase se houver cenário
                if (GAME_CONFIG.cenario) {
                    const assets = await loadAssets(GAME_CONFIG.cenario);

                    // Adicionar assets ao config
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
                    window.gameConfig = GAME_CONFIG;
                }

                // Remove loading
                document.getElementById('loading-overlay').style.display = 'none';
                document.querySelector('.game-container').style.display = 'block';

                // Inicializa o jogo
                if (typeof GAME_ENGINE !== 'undefined') {
                    GAME_ENGINE.init(window.gameConfig);
                    console.log('✅ Jogo inicializado com sucesso!');
                } else {
                    throw new Error('GAME_ENGINE não encontrado');
                }

            } catch (error) {
                console.error('❌ Erro ao inicializar:', error);
                document.getElementById('loading-overlay').style.display = 'none';
                const container = document.querySelector('.game-container');
                container.style.display = 'block';
                container.innerHTML =
                    '<div style="text-align: center; padding: 40px; color: #e74c3c;">' +
                    '<h2>Erro ao carregar jogo</h2>' +
                    '<p>' + error.message + '</p>' +
                    '</div>';
            }
        }

        // Aguarda todos os scripts carregarem
        window.addEventListener('load', initGame);

        // Debug: Log de erros de carregamento
        window.addEventListener('error', function(e) {
            if (e.target.tagName === 'SCRIPT') {
                console.error('❌ Erro ao carregar script:', e.target.src);
            }
        });
    </script>
</body>
</html>`;
}

// ========== EXPORTAÇÃO ==========

// Para uso no Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gerarJogoCompleto };
}
