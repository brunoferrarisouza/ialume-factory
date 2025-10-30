// ===== BUBBLE INTEGRATION =====
// Código de integração com Bubble.io
// Injeta CONFIG, envia resultados, auto-close

// ========== CONFIGURAÇÃO BUBBLE ==========
const BUBBLE_CONFIG = {
    bubbleApiUrl: 'https://ialume.bubbleapps.io/api/1.1',
    bubbleApiKey: '%%BUBBLE_API_KEY%%',  // Substituir no Bubble
    paginaId: null,
    sessaoId: null,
    alunoId: null
};

// ========== LER PARÂMETROS DA URL ==========
function initBubbleParams() {
    console.log('🔗 Inicializando parâmetros Bubble...');
    
    const params = getURLParams();
    console.log('📋 URL Params:', params);
    
    // Configurar IDs
    if (params.pagina_id) {
        BUBBLE_CONFIG.paginaId = params.pagina_id;
        console.log('✅ pagina_id:', BUBBLE_CONFIG.paginaId);
    }
    if (params.sessao_id) {
        BUBBLE_CONFIG.sessaoId = params.sessao_id;
        console.log('✅ sessao_id:', BUBBLE_CONFIG.sessaoId);
    }
    if (params.aluno_id) {
        BUBBLE_CONFIG.alunoId = params.aluno_id;
        console.log('✅ aluno_id:', BUBBLE_CONFIG.alunoId);
    }
    
    // Verificar API Key
    if (BUBBLE_CONFIG.bubbleApiKey.includes('%%')) {
        console.warn('⚠️ API Key não configurada! Rodando em modo demo.');
    } else {
        console.log('✅ API Key configurada');
    }
}

function getURLParams() {
    const inIframe = window.self !== window.top;
    let search = '';
    
    try {
        if (inIframe) {
            console.log('🔍 Detectado iframe, lendo URL da janela pai');
            search = window.parent.location.search;
        } else {
            search = window.location.search;
        }
    } catch (e) {
        console.warn('⚠️ Erro ao acessar parent:', e.message);
        search = window.location.search;
    }
    
    if (!search || search === '') {
        try {
            const href = inIframe ? window.parent.location.href : window.location.href;
            const questionMarkIndex = href.indexOf('?');
            if (questionMarkIndex !== -1) {
                search = href.substring(questionMarkIndex);
            }
        } catch (e) {
            console.warn('⚠️ Não conseguiu extrair params:', e.message);
        }
    }
    
    const params = new URLSearchParams(search);
    const result = {};
    for (const [key, value] of params) {
        if (value && value !== '') {
            result[key] = value;
        }
    }
    
    return result;
}

// ========== ENVIAR RESULTADO PARA BUBBLE ==========
function sendResultToBubble(resultado) {
    if (!BUBBLE_CONFIG.bubbleApiUrl || !BUBBLE_CONFIG.bubbleApiKey) {
        console.warn('⚠️ API Bubble não configurada');
        console.log('Resultado (não enviado):', resultado);
        return;
    }

    if (BUBBLE_CONFIG.bubbleApiKey.includes('%%')) {
        console.warn('⚠️ API Key placeholder - não enviando');
        return;
    }

    // Formatar dados para Bubble
    const bubbleData = {
        pagina: BUBBLE_CONFIG.paginaId,
        sessao: BUBBLE_CONFIG.sessaoId,
        aluno: BUBBLE_CONFIG.alunoId,
        pontos: resultado.pontosTotais || resultado.pontos || 0,
        acertos: resultado.acertos || 0,
        erros: resultado.erros || 0,
        percentual: resultado.percentualAcerto || resultado.percentual || 0,
        total_fases: resultado.totalFases || 0,
        detalhes: JSON.stringify(resultado.detalhes || []),
        data_jogo: resultado.timestamp || new Date().toISOString()
    };

    console.log('📤 Enviando para Bubble:', bubbleData);

    fetch(BUBBLE_CONFIG.bubbleApiUrl + '/obj/resultado_jogo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + BUBBLE_CONFIG.bubbleApiKey
        },
        body: JSON.stringify(bubbleData)
    })
    .then(response => {
        console.log('📥 Resposta HTTP:', response.status);
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Resultado salvo no Bubble!', data);
    })
    .catch(error => {
        console.error('❌ Erro ao enviar resultado:', error);
    });
}

// ========== TELA DE VITÓRIA BUBBLE ==========
function showVictoryBubble(resultado) {
    console.log('🎉 Mostrando tela de vitória Bubble...');
    
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.style.display = 'none';
    }
    
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) {
        console.error('❌ game-container não encontrado!');
        return;
    }
    
    const victoryHTML = `
        <div id="victory-overlay" style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 200;
            padding: 40px;
            animation: fadeIn 0.5s ease;
        ">
            <div style="
                background: white;
                border-radius: 30px;
                padding: 40px 50px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 600px;
                animation: scaleIn 0.5s ease;
            ">
                <div style="font-size: 5rem; margin-bottom: 15px;">
                    🏆
                </div>
                <h1 style="
                    font-size: 2.5rem;
                    color: #ffd700;
                    margin-bottom: 15px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                ">
                    VITORIA!
                </h1>
                <p style="
                    font-size: 1.3rem;
                    color: #212529;
                    margin-bottom: 25px;
                ">
                    Voce completou todas as fases!
                </p>
                <div style="
                    background: rgba(102, 126, 234, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                ">
                    <div style="margin-bottom: 15px;">
                        <span style="font-size: 1.2rem; font-weight: bold;">Pontos finais:</span>
                        <span style="font-size: 2rem; color: #ffd700; margin-left: 10px;">
                            ${resultado.pontosTotais || resultado.pontos || 0}
                        </span>
                    </div>
                    <div>
                        <span style="font-size: 1.2rem; font-weight: bold;">Acertos:</span>
                        <span style="font-size: 2rem; color: #51cf66; margin-left: 10px;">
                            ${resultado.acertos || 0}
                        </span>
                    </div>
                </div>
                <button id="btn-voltar" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 20px 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease;
                    margin-bottom: 20px;
                ">
                    🏠 VOLTAR
                </button>
                <div id="countdown" style="font-size: 1rem; opacity: 0.6;">
                    Voltando automaticamente em <span id="seconds">10</span>s
                </div>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            #btn-voltar:hover {
                transform: translateY(-3px) scale(1.05);
            }
        </style>
    `;
    
    gameContainer.insertAdjacentHTML('beforeend', victoryHTML);
    
    // Event listener para botão VOLTAR
    const btnVoltar = document.getElementById('btn-voltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            console.log('🏠 Botão VOLTAR clicado');
            window.location.href = '/index/7';
        });
    }
    
    // Auto-redirect após 10 segundos
    let seconds = 10;
    const countdownInterval = setInterval(function() {
        seconds--;
        const secondsEl = document.getElementById('seconds');
        if (secondsEl) {
            secondsEl.textContent = seconds;
        }
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            console.log('⏱️ Tempo esgotado - redirecionando para /index/7');
            window.location.href = '/index/7';
        }
    }, 1000);
}

// ========== INICIALIZAÇÃO ==========
function setupBubbleIntegration() {
    console.log('🔗 Inicializando parâmetros Bubble...');
    initBubbleParams();
    
    // Fazer override IMEDIATAMENTE
    overrideGameEngineFinish();
}

// ========== OVERRIDE DO GAME ENGINE ==========
// Wrapper que intercepta o finish() SEMPRE
function overrideGameEngineFinish() {
    // Criar um interval que verifica se GAME_ENGINE existe
    const checkInterval = setInterval(function() {
        if (window.GAME_ENGINE && typeof window.GAME_ENGINE.finish === 'function') {
            clearInterval(checkInterval);
            
            console.log('✅ GAME_ENGINE encontrado! Aplicando override Bubble...');
            
            // Guardar referência ao método original
            const originalFinish = GAME_ENGINE.finish;
            
            // Sobrescrever com versão Bubble
            GAME_ENGINE.finish = function() {
                console.log('🏁 JOGO FINALIZADO (MODO BUBBLE)!');
                
                const resultado = this.getFinalResult();
                console.log('📊 Resultado:', resultado);
                
                // Enviar para Bubble
                console.log('📤 Tentando enviar para Bubble...');
                sendResultToBubble(resultado);
                
                // Mostrar tela Bubble
                console.log('🎉 Mostrando tela de vitória Bubble...');
                showVictoryBubble(resultado);
                
                return resultado;
            };
            
            console.log('✅ Game Engine.finish() SOBRESCRITO para modo Bubble');
        }
    }, 50); // Verifica a cada 50ms
    
    // Timeout de segurança (10 segundos)
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 10000);
}

// Inicializar assim que possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBubbleIntegration);
} else {
    setupBubbleIntegration();
}

console.log('🔗 bubble-integration.js carregado!');
