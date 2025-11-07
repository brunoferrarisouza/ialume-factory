// ===== MOTOR DO JOGO - GAME ENGINE (VERSÃO FINAL CORRIGIDA) =====

const GAME_ENGINE = {
    config: null,
    currentPhaseIndex: 0,
    results: [],
    
    // Inicializar jogo com configuração
    init: function(gameConfig) {
        // Evitar reinicialização duplicada
        if (window.gameState && window.gameState.initialized) {
            console.log('⏭️ Game Engine já inicializado, pulando...');
            return true;
        }

        console.log('🎮 Iniciando Game Engine...', gameConfig);

        this.config = gameConfig;
        this.currentPhaseIndex = 0;
        this.results = [];

        // Validar configuração
        if (!this.validateConfig(gameConfig)) {
            console.error('❌ Configuração inválida!');
            return false;
        }

        // Configurar sistema base
        // ✅ CORREÇÃO: Fase 0 é só abertura, não conta no totalPhases
        // totalPhases = número de fases JOGÁVEIS (não inclui fase 0)
        window.totalPhases = gameConfig.fases.length - 1;

        // Total de andares na montanha = número de fases jogáveis
        const totalSteps = gameConfig.fases.length - 1;
        
        console.log('📊 Total de fases no array:', gameConfig.fases.length);
        console.log('🎮 Fases jogáveis (sem contar fase 0):', totalSteps);
        console.log('🏔️ Total de andares na escalada:', totalSteps);
        console.log('✅ window.totalPhases configurado:', window.totalPhases);
        
        // Configurar mecânica (se existir e não for 'none') - ANTES de injetar fases
        if (gameConfig.mecanica && gameConfig.mecanica !== 'none') {
            const Mechanic = this.getMechanic(gameConfig.mecanica);
            if (Mechanic) {
                console.log('🎮 Inicializando mecânica:', gameConfig.mecanica);

                // ✅ NOVO: Passar cenário para mecânicas com parallax
                const mechanicConfig = {
                    totalSteps: totalSteps
                };

                // Se tiver cenário definido, passar para a mecânica
                if (gameConfig.cenario) {
                    mechanicConfig.cenario = gameConfig.cenario;
                    console.log('🎨 Cenário definido:', gameConfig.cenario);
                }

                Mechanic.init(mechanicConfig);
            } else {
                console.warn('⚠️ Mecânica não encontrada:', gameConfig.mecanica);
            }
        } else {
            console.log('⏭️  Jogo linear (sem mecânica visual)');
        }

        // Inicializar sistema de áudio (se houver configuração)
        if (gameConfig.audio && typeof window.AUDIO !== 'undefined') {
            console.log('🎵 Inicializando sistema de áudio...');
            window.AUDIO.init(gameConfig.audio);
        }

        // Inicializar sistema de partículas (se disponível)
        if (typeof window.PARTICLES !== 'undefined' && typeof PARTICLES.init === 'function') {
            console.log('✨ Inicializando sistema de partículas...');
            PARTICLES.init();
        }

        // Injetar todas as fases
        this.injectAllPhases();

        // Marcar como inicializado
        if (!window.gameState) {
            window.gameState = {};
        }
        window.gameState.initialized = true;

        console.log('✅ Game Engine inicializado!');
        return true;
    },
    
    // Validar configuração
    validateConfig: function(config) {
        if (!config) {
            console.error('Config é null/undefined');
            return false;
        }
        
        if (!config.fases || !Array.isArray(config.fases)) {
            console.error('Fases não é um array');
            return false;
        }
        
        if (config.fases.length === 0) {
            console.error('Nenhuma fase definida');
            return false;
        }
        
        // Validar cada fase
        for (let i = 0; i < config.fases.length; i++) {
            const fase = config.fases[i];
            
            // ✅ PULAR FASE 0 (boas-vindas) - Ela é estática no HTML
            if (i === 0 && (fase.type === 'welcome' || !fase.modalidade)) {
                console.log('⏭️ Fase 0 (boas-vindas) detectada - pulando validação');
                continue;
            }
            
            if (!fase.modalidade) {
                console.error('Fase ' + (i+1) + ' sem modalidade');
                return false;
            }
            
            if (!this.getModalidade(fase.modalidade)) {
                console.error('Modalidade não existe: ' + fase.modalidade);
                return false;
            }
        }
        
        return true;
    },
    
    // Injetar todas as fases
    injectAllPhases: function() {
        console.log('📦 Injetando fases...');

        const container = document.querySelector('.game-container');
        if (!container) {
            console.error('❌ .game-container não encontrado!');
            return;
        }

        let numeroFase = 1; // ✅ Contador separado começa em 1

        this.config.fases.forEach((faseConfig, index) => {
            // ✅ FASE 0 (welcome) - Renderizar tela de boas-vindas
            if (index === 0 && (faseConfig.type === 'welcome' || !faseConfig.modalidade)) {
                console.log('🎬 Renderizando fase 0 (welcome)...');
                this.injectWelcomeScreen(faseConfig, container);
                return; // Pula incremento de numeroFase
            }

            // ✅ CRIAR elemento phase-X se não existir
            let phaseElement = document.getElementById('phase-' + numeroFase);
            if (!phaseElement) {
                phaseElement = document.createElement('div');
                phaseElement.id = 'phase-' + numeroFase;
                phaseElement.className = 'phase'; // ✅ Classe correta para CSS funcionar
                container.appendChild(phaseElement);
                console.log('✅ Criado elemento phase-' + numeroFase);
            }

            // ✅ Usa numeroFase (contador), não index+1
            console.log('📦 Injetando fase', index, 'no elemento phase-' + numeroFase);
            this.injectPhase(numeroFase, faseConfig);
            numeroFase++; // Incrementa só quando injeta
        });

        console.log('✅ Todas as fases injetadas!');
    },

    // Injetar tela de welcome (fase 0)
    injectWelcomeScreen: function(faseConfig, container) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'welcome-screen';
        welcomeDiv.className = 'welcome-screen';
        welcomeDiv.style.cssText = `
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
            z-index: 1000;
            color: white;
            padding: 40px;
            text-align: center;
        `;

        const narrativa = faseConfig.narrativa || 'Bem-vindo ao jogo!';
        const textoBotao = faseConfig.botao || 'Começar';

        welcomeDiv.innerHTML = `
            <div style="max-width: 600px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ${this.config.titulo || 'Jogo iAlume'}
                </h1>
                <p style="font-size: 1.3rem; line-height: 1.6; margin-bottom: 40px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
                    ${narrativa}
                </p>
                <button id="start-game-btn" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 18px 50px;
                    font-size: 1.3rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    ${textoBotao}
                </button>
            </div>
        `;

        container.appendChild(welcomeDiv);

        // Adicionar evento ao botão
        const startBtn = document.getElementById('start-game-btn');
        startBtn.addEventListener('click', () => {
            console.log('🚀 Botão "Começar" clicado!');

            // Iniciar música (se houver)
            if (window.AUDIO && window.AUDIO.playMusic) {
                window.AUDIO.playMusic();
                console.log('🎵 Música iniciada');
            }

            // Esconder welcome screen com fade out
            welcomeDiv.style.transition = 'opacity 0.5s';
            welcomeDiv.style.opacity = '0';

            setTimeout(() => {
                welcomeDiv.remove();
                console.log('✅ Welcome screen removida');

                // ✨ INTRO ZOOM: Zoom in em todo o jogo (igual jogo antigo)
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    console.log('🎬 Iniciando câmera intro (zoom in)...');
                    gameContainer.classList.add('camera-intro');

                    // Após 3s: remover classe, iniciar vento e mostrar fase 1
                    setTimeout(() => {
                        console.log('✅ Zoom in completo!');
                        gameContainer.classList.remove('camera-intro');

                        // 💨 INICIAR SOM DO VENTO COM FADE IN
                        if (window.AUDIO && typeof AUDIO.playWind === 'function') {
                            AUDIO.playWind();
                            console.log('💨 Som do vento iniciado!');
                        }

                        // 🦅 INICIAR DECORAÇÕES (nuvens, pássaros, etc)
                        if (window.DECORATIONS && typeof DECORATIONS.init === 'function') {
                            // Pegar decorações do gameConfig (vem do Supabase)
                            const decorations = window.gameConfig?.decorations || [];
                            if (decorations.length > 0) {
                                DECORATIONS.init(decorations);
                                console.log('🦅 Decorações iniciadas:', decorations.length);
                            } else {
                                console.log('⏭️ Sem decorações configuradas para este cenário');
                            }
                        }

                        // Mostrar primeira fase
                        if (typeof goToPhase !== 'undefined') {
                            goToPhase(1);
                            console.log('🎮 Indo para fase 1');
                        } else {
                            console.error('❌ goToPhase() não encontrado');
                        }
                    }, 3000); // 3s de animação
                } else {
                    console.warn('⚠️ .game-container não encontrado, pulando intro');
                    if (typeof goToPhase !== 'undefined') {
                        goToPhase(1);
                    }
                }
            }, 500);
        });

        console.log('✅ Welcome screen injetada');
    },

    // Injetar uma fase específica
    injectPhase: function(numeroFase, faseConfig) {
        const faseElement = document.getElementById('phase-' + numeroFase);
        
        if (!faseElement) {
            console.error('Elemento phase-' + numeroFase + ' não encontrado!');
            return;
        }
        
        // Limpar fase
        faseElement.innerHTML = '';
        
        // Obter modalidade
        const Modalidade = this.getModalidade(faseConfig.modalidade);
        
        if (!Modalidade) {
            console.error('Modalidade não encontrada: ' + faseConfig.modalidade);
            faseElement.innerHTML = '<p style="color:red;">Erro: Modalidade não encontrada</p>';
            return;
        }
        
        // Criar UI da modalidade
        const ui = Modalidade.createUI(faseConfig.dados);
        faseElement.appendChild(ui);
        
        console.log('✅ Fase ' + numeroFase + ' injetada (' + faseConfig.modalidade + ')');
    },
    
    // Obter objeto da modalidade
    getModalidade: function(nome) {
        const modalidades = {
            'quiz': window.QUIZ,
            'true-false': window.TRUE_FALSE,
            'verdadeiro-falso': window.TRUE_FALSE,
            'fill-blanks': window.FILL_BLANKS,
            'lacunas': window.FILL_BLANKS,
            'sequence': window.SEQUENCE,
            'sequencia': window.SEQUENCE
        };
        
        return modalidades[nome.toLowerCase()];
    },
    
    // Obter objeto da mecânica
    getMechanic: function(nome) {
        const mechanics = {
            'escalada': window.ESCALADA,
            'perseguicao': window.PERSEGUICAO,
            'corrida': window.CORRIDA,  // futuro
            'labirinto': window.LABIRINTO  // futuro
        };

        return mechanics[nome.toLowerCase()];
    },
    
    // Registrar resultado de uma fase
    recordResult: function(phaseNumber, correct, points) {
        this.results.push({
            fase: phaseNumber,
            acertou: correct,
            pontos: points,
            timestamp: new Date().toISOString()
        });
        
        console.log('📊 Resultado registrado:', this.results[this.results.length - 1]);
    },
    
    // Obter resultado final
    getFinalResult: function() {
        const totalFases = this.results.length;
        const acertos = this.results.filter(r => r.acertou).length;
        const pontosTotais = this.results.reduce((sum, r) => sum + r.pontos, 0);
        
        return {
            tema: this.config.tema || 'Sem tema',
            totalFases: totalFases,
            acertos: acertos,
            erros: totalFases - acertos,
            pontosTotais: pontosTotais,
            percentualAcerto: Math.round((acertos / totalFases) * 100),
            detalhes: this.results,
            timestamp: new Date().toISOString()
        };
    },
    
    // Finalizar jogo
    finish: function() {
        const resultado = this.getFinalResult();
        
        console.log('🏁 JOGO FINALIZADO!', resultado);
        
        // Salvar no localStorage (temporário)
        localStorage.setItem('ultimo_resultado', JSON.stringify(resultado));
        
        // Callback para Bubble (se existir)
        if (window.sendResultToBubble) {
            window.sendResultToBubble(resultado);
        }
        
        // Mostrar tela final
        this.showFinalScreen(resultado);
        
        return resultado;
    },
    
    // Mostrar tela final
    showFinalScreen: function(resultado) {
        const container = document.getElementById('phase-' + window.totalPhases);
        
        if (!container) return;
        
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; color: white;">
                <h1 style="font-size: 2.5rem; margin-bottom: 20px;">🎉 PARABÉNS!</h1>
                <h2 style="font-size: 1.8rem; margin-bottom: 30px;">${resultado.tema}</h2>
                
                <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
                    <div style="font-size: 3rem; font-weight: 700; margin-bottom: 10px;">
                        ${resultado.pontosTotais} PONTOS
                    </div>
                    <div style="font-size: 1.3rem;">
                        ✅ ${resultado.acertos} acertos | ❌ ${resultado.erros} erros
                    </div>
                    <div style="font-size: 1.5rem; margin-top: 15px; font-weight: 600;">
                        ${resultado.percentualAcerto}% de aproveitamento
                    </div>
                </div>
                
                <button onclick="location.reload()" style="
                    padding: 20px 40px;
                    font-size: 1.3rem;
                    font-weight: 700;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                ">
                    🔄 JOGAR NOVAMENTE
                </button>
            </div>
        `;
    }
};

// Expor globalmente
window.GAME_ENGINE = GAME_ENGINE;

console.log('🎮 game-engine.js carregado!');
