/**
 * 📋 CODE NODE PARA N8N - COPIAR/COLAR
 * 
 * INSTRUÇÕES:
 * 1. Crie um Code Node no N8N
 * 2. Copie TODO este arquivo
 * 3. Cole no Code Node
 * 4. Ajuste CDN_BASE_URL com seu usuário GitHub
 * 5. Pronto!
 * 
 * INPUT esperado ($input.item.json):
 * {
 *   "tema": "Matemática Básica",
 *   "fases": [...],
 *   "mecanica": "escalada",
 *   "pagina_id": "abc123",
 *   "sessao_id": "xyz789",
 *   "aluno_id": "def456"
 * }
 * 
 * OUTPUT:
 * {
 *   "html": "<html>...</html>",
 *   "config": {...},
 *   "status": "success"
 * }
 */

// ========== CONFIGURAÇÃO ==========
// ⚠️ AJUSTE AQUI COM SEU USUÁRIO GITHUB!
const CDN_BASE_URL = 'https://SEU-USUARIO.github.io/ialume-factory';
const VERSION = '1.0.0';

// ========== FUNÇÃO PRINCIPAL ==========
function gerarJogoCompleto(config) {
  const cdnPath = `${CDN_BASE_URL}/${VERSION}`;
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.tema || 'Jogo IAlume'}</title>
    <link rel="stylesheet" href="${cdnPath}/base.css">
    <style>
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
    <div id="loading-overlay">
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 1.2rem;">Carregando jogo...</p>
    </div>
    <div id="game-container" style="display: none;"></div>

    <script src="${cdnPath}/base.js"></script>
    <script src="${cdnPath}/game-engine.js"></script>
    <script src="${cdnPath}/bubble-integration.js"></script>
    <script src="${cdnPath}/mechanics/escalada.js"></script>
    <script src="${cdnPath}/mechanics/perseguicao.js"></script>
    <script src="${cdnPath}/modalities/quiz.js"></script>
    <script src="${cdnPath}/modalities/true-false.js"></script>
    <script src="${cdnPath}/modalities/fill-blanks.js"></script>
    <script src="${cdnPath}/modalities/sequence.js"></script>
    
    <script>
        const GAME_CONFIG = ${JSON.stringify(config, null, 2)};
        
        window.addEventListener('load', function() {
            document.getElementById('loading-overlay').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            
            try {
                if (typeof GAME_ENGINE !== 'undefined') {
                    GAME_ENGINE.init(GAME_CONFIG);
                } else {
                    throw new Error('GAME_ENGINE não encontrado');
                }
            } catch (error) {
                console.error('❌ Erro:', error);
                document.getElementById('game-container').innerHTML = 
                    '<div style="text-align: center; padding: 40px; color: #e74c3c;">' +
                    '<h2>Erro ao carregar jogo</h2><p>' + error.message + '</p></div>';
                document.getElementById('game-container').style.display = 'block';
            }
        });
    </script>
</body>
</html>`;
}

// ========== EXECUÇÃO N8N ==========
try {
  // Pega config do input
  const config = $input.item.json;
  
  // Valida
  if (!config.tema || !config.fases) {
    throw new Error('Config inválido: faltam tema ou fases');
  }
  
  // Gera HTML
  const html = gerarJogoCompleto(config);
  
  // Retorna
  return {
    json: {
      html: html,
      config: config,
      status: 'success',
      timestamp: new Date().toISOString()
    }
  };
  
} catch (error) {
  return {
    json: {
      error: error.message,
      status: 'error',
      timestamp: new Date().toISOString()
    }
  };
}
