/**
 * 🎮 GAME ASSEMBLER V2 - PARA N8N COM CDN
 * 
 * Este arquivo gera HTML completo que aponta para arquivos no CDN
 * 
 * COMO USAR NO N8N:
 *   1. Copie este código para um Code Node
 *   2. Configure a variável CDN_BASE_URL
 *   3. Passe o config via $input.item.json
 *   4. Retorne o HTML gerado
 */

// ========== CONFIGURAÇÃO ==========
const CDN_BASE_URL = 'https://brunoferrarisouza.github.io/ialume-factory';
const VERSION = '1.0.0';

/**
 * Gera HTML completo do jogo
 * @param {Object} config - Configuração do jogo
 * @returns {string} HTML completo
 */
function gerarJogoCompleto(config) {
  const cdnPath = `${CDN_BASE_URL}/${VERSION}`;
  
  // ✅ Tratamento de analyzer undefined
  const safeAnalyzer = config.analyzer || null;
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.tema || 'Jogo IAlume'}</title>
    
    <!-- CSS do CDN -->
    <link rel="stylesheet" href="${cdnPath}/base.css">
    
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
    </style>
</head>
<body>
    <!-- Loading overlay -->
    <div id="loading-overlay">
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 1.2rem;">Carregando jogo...</p>
    </div>

    <!-- Container do jogo -->
    <div id="game-container" style="display: none;"></div>

    <!-- Scripts do CDN -->
    <!-- Core -->
    <script src="${cdnPath}/particles.js"></script>
    <script src="${cdnPath}/audio.js"></script>
    <script src="${cdnPath}/base.js"></script>
    <script src="${cdnPath}/game-engine.js"></script>
    <script src="${cdnPath}/bubble-integration.js"></script>

    <!-- Mechanics -->
    <script src="${cdnPath}/mechanics/escalada.js"></script>
    <script src="${cdnPath}/mechanics/perseguicao.js"></script>

    <!-- Modalities -->
    <script src="${cdnPath}/modalities/quiz.js"></script>
    <script src="${cdnPath}/modalities/true-false.js"></script>
    <script src="${cdnPath}/modalities/fill-blanks.js"></script>
    <script src="${cdnPath}/modalities/sequence.js"></script>
    
    <!-- Configuração e Inicialização -->
    <script>
        // Dados do jogo injetados
        const GAME_CONFIG = ${JSON.stringify(config, null, 2)};
        const ANALYZER_DATA = ${JSON.stringify(safeAnalyzer)};
        
        // Aguarda todos os scripts carregarem
        window.addEventListener('load', function() {
            console.log('🎮 Todos os scripts carregados');
            console.log('📋 Config:', GAME_CONFIG);
            
            // Remove loading
            document.getElementById('loading-overlay').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            
            // Inicializa o jogo
            try {
                if (typeof GAME_ENGINE !== 'undefined') {
                    GAME_ENGINE.init(GAME_CONFIG);
                    console.log('✅ Jogo inicializado com sucesso!');
                } else {
                    throw new Error('GAME_ENGINE não encontrado');
                }
            } catch (error) {
                console.error('❌ Erro ao inicializar:', error);
                document.getElementById('game-container').innerHTML = 
                    '<div style="text-align: center; padding: 40px; color: #e74c3c;">' +
                    '<h2>Erro ao carregar jogo</h2>' +
                    '<p>' + error.message + '</p>' +
                    '</div>';
                document.getElementById('game-container').style.display = 'block';
            }
        });
        
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

// Para uso no Node.js (N8N)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gerarJogoCompleto };
}

// Para uso no browser (testes locais)
if (typeof window !== 'undefined') {
  window.GameAssembler = { gerarJogoCompleto };
}
