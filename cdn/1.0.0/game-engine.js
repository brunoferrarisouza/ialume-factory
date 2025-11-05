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
        window.totalPhases = gameConfig.fases.length;
        
        // CORREÇÃO DEFINITIVA: Total de andares = número de fases
        // O array fases[] JÁ inclui a fase 0 (boas-vindas), então NÃO soma +1
        const totalSteps = gameConfig.fases.length;
        
        console.log('📊 Total de fases no array:', gameConfig.fases.length);
        console.log('🏔️ Total de andares na escalada:', totalSteps);
        console.log('✅ Cálculo correto: fases.length =', totalSteps, '(fase 0 já está incluída)');
        
        // Configurar mecânica (se existir e não for 'none') - ANTES de injetar fases
        if (gameConfig.mecanica && gameConfig.mecanica !== 'none') {
            const Mechanic = this.getMechanic(gameConfig.mecanica);
            if (Mechanic) {
                console.log('🎮 Inicializando mecânica:', gameConfig.mecanica);
                Mechanic.init({
                    totalSteps: totalSteps
                });
            } else {
                console.warn('⚠️ Mecânica não encontrada:', gameConfig.mecanica);
            }
        } else {
            console.log('⏭️  Jogo linear (sem mecânica visual)');
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
        
        let numeroFase = 1; // ✅ Contador separado começa em 1
        
        this.config.fases.forEach((faseConfig, index) => {
            // ✅ PULAR FASE 0 (boas-vindas) - Ela já está no HTML
            if (index === 0 && (faseConfig.type === 'welcome' || !faseConfig.modalidade)) {
                console.log('⏭️ Fase 0 (boas-vindas) - usando conteúdo estático do HTML');
                return; // Pula essa fase, numeroFase continua 1
            }
            
            // ✅ Usa numeroFase (contador), não index+1
            console.log('📦 Injetando fase', index, 'no elemento phase-' + numeroFase);
            this.injectPhase(numeroFase, faseConfig);
            numeroFase++; // Incrementa só quando injeta
        });
        
        console.log('✅ Todas as fases injetadas!');
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
