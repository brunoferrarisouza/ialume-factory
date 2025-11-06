// ===== MECÂNICA: PERSEGUIÇÃO/FUGA =====
// Lume foge horizontalmente de um perigo (dragão da ignorância)

const PERSEGUICAO = {
    name: 'perseguicao',
    currentStep: 0,
    totalSteps: 5, // Fase 0-4
    lumePosition: 20, // Começa em 20% da esquerda
    dangerPosition: 0, // Perigo começa em 0%

    // Inicializar mecânica
    init: function(config) {
        console.log('🏃‍♂️ PERSEGUICAO.init() chamado com config:', config);

        if (!config || !config.totalSteps) {
            console.error('❌ ERRO: config.totalSteps não fornecido!');
            return;
        }

        this.totalSteps = config.totalSteps;
        this.currentStep = 0;
        this.lumePosition = 20; // Reset
        this.dangerPosition = 0; // Reset

        console.log('✅ Mecânica PERSEGUIÇÃO inicializada');
        console.log('   Total de fases:', this.totalSteps);
        console.log('   Fase atual:', this.currentStep);
        console.log('   Posição inicial de Lume:', this.lumePosition + '%');
        console.log('   Posição inicial do perigo:', this.dangerPosition + '%');

        this.injectHTML();
        this.injectCSS();
        this.updatePositions();
    },

    // Injetar HTML da pista de fuga
    injectHTML: function() {
        const container = document.querySelector('.game-container');

        // Verificar se container existe (importante para Bubble SPA)
        if (!container) {
            console.warn('⚠️ .game-container não encontrado ainda, tentando novamente em 100ms...');
            setTimeout(() => this.injectHTML(), 100);
            return;
        }

        // Criar container da mecânica
        const mechanicHTML = `
            <div id="perseguicao-container" class="mechanic-container">
                <!-- Pista/Caminho -->
                <div class="chase-track">
                    <!-- Marcadores de progresso -->
                    <div class="progress-markers">
                        ${this.generateMarkers()}
                    </div>

                    <!-- Linha de perigo (quando perigo alcança, game over) -->
                    <div class="danger-line" id="danger-line"></div>
                </div>

                <!-- Lume fugindo -->
                <div id="lume-runner" class="lume-runner">
                    🌟
                </div>

                <!-- Perigo perseguindo -->
                <div id="danger-chaser" class="danger-chaser">
                    🐉
                </div>

                <!-- Zona segura (chegada) -->
                <div class="safe-zone">
                    <div class="safe-zone-flag">🏁</div>
                    <span class="safe-zone-label">SEGURANÇA!</span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', mechanicHTML);
    },

    // Gerar marcadores de progresso
    generateMarkers: function() {
        console.log('📍 Gerando marcadores de progresso...');

        // Calcular posições dinâmicas baseadas no movimento real
        // Lume começa em 20% e avança 15% por fase jogável
        const startPosition = 20;
        const advancePerStep = 15;
        const playablePhases = this.totalSteps - 1; // -1 porque fase 0 é welcome

        console.log('   Fases jogáveis:', playablePhases);
        console.log('   Posição inicial:', startPosition + '%');
        console.log('   Avanço por fase:', advancePerStep + '%');

        let markersHTML = '';

        // Gerar marcador para cada posição que Lume alcança
        for (let i = 0; i <= playablePhases; i++) {
            const position = startPosition + (i * advancePerStep);

            let label;
            if (i === 0) {
                label = 'INÍCIO';
            } else if (i === playablePhases) {
                label = 'META';
            } else {
                label = `${position}%`;
            }

            console.log(`   Marcador ${i}: ${position}% (${label})`);

            markersHTML += `
                <div class="marker" style="left: ${position}%">
                    <div class="marker-line"></div>
                    <span class="marker-label">${label}</span>
                </div>
            `;
        }

        console.log('✅ Marcadores gerados!');
        return markersHTML;
    },

    // Injetar CSS
    injectCSS: function() {
        if (document.getElementById('perseguicao-styles')) return;

        console.log('🎨 Criando CSS para mecânica de perseguição');

        const style = document.createElement('style');
        style.id = 'perseguicao-styles';
        style.textContent = `
            /* Container da mecânica */
            #perseguicao-container {
                position: absolute;
                left: 40px;
                right: 40px;
                bottom: 40px;
                height: 150px;
                z-index: 100;
                pointer-events: none;
            }

            /* Pista de fuga */
            .chase-track {
                position: absolute;
                bottom: 60px;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(to right,
                    #ff4444 0%,
                    #ffaa00 20%,
                    #ffff00 40%,
                    #88ff00 60%,
                    #00ff00 80%,
                    #00ff00 100%
                );
                border-radius: 2px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }

            /* Marcadores de progresso */
            .progress-markers {
                position: absolute;
                top: -30px;
                left: 0;
                right: 0;
                height: 30px;
            }

            .marker {
                position: absolute;
                transform: translateX(-50%);
            }

            .marker-line {
                width: 2px;
                height: 20px;
                background: rgba(255,255,255,0.5);
                margin: 0 auto;
            }

            .marker-label {
                display: block;
                font-size: 0.6rem;
                color: rgba(255,255,255,0.8);
                text-align: center;
                margin-top: 2px;
                white-space: nowrap;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }

            /* Linha de perigo */
            .danger-line {
                position: absolute;
                left: 70%;
                top: -10px;
                bottom: -10px;
                width: 2px;
                background: rgba(255,0,0,0.3);
                border-left: 2px dashed rgba(255,0,0,0.6);
            }

            /* Lume correndo */
            .lume-runner {
                position: absolute;
                left: 20%;
                bottom: 30px;
                font-size: 3rem;
                filter: drop-shadow(0 0 20px #fff8dc);
                transition: left 1s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                            transform 0.3s ease;
                z-index: 103;
                pointer-events: none;
            }

            /* Perigo perseguindo */
            .danger-chaser {
                position: absolute;
                left: 0%;
                bottom: 30px;
                font-size: 3rem;
                filter: drop-shadow(0 0 20px #ff4444);
                transition: left 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                            transform 0.3s ease;
                z-index: 102;
                pointer-events: none;
                animation: dangerFloat 2s ease-in-out infinite;
            }

            @keyframes dangerFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-10px) scale(1.1); }
            }

            /* Zona segura (chegada) */
            .safe-zone {
                position: absolute;
                right: 10px;
                bottom: 20px;
                width: 80px;
                height: 100px;
                background: linear-gradient(to top,
                    rgba(0,255,0,0.2),
                    rgba(0,255,0,0.05)
                );
                border: 3px solid rgba(0,255,0,0.5);
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 101;
            }

            .safe-zone-flag {
                font-size: 2.5rem;
                animation: wave 1s ease-in-out infinite;
            }

            .safe-zone-label {
                font-size: 0.7rem;
                font-weight: bold;
                color: #00ff00;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
                margin-top: 5px;
            }

            @keyframes wave {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
            }

            /* Animação de corrida */
            .lume-runner.running {
                animation: run 0.8s ease-in-out;
            }

            @keyframes run {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.15) rotate(-5deg); }
                50% { transform: scale(1.1) rotate(3deg); }
                75% { transform: scale(1.15) rotate(-3deg); }
            }

            /* Animação de avanço do perigo */
            .danger-chaser.advancing {
                animation: dangerAdvance 1s ease-in-out;
            }

            @keyframes dangerAdvance {
                0%, 100% { transform: scale(1) translateY(0); }
                25% { transform: scale(1.2) translateY(-5px); }
                50% { transform: scale(1.15) translateY(0); }
                75% { transform: scale(1.2) translateY(-5px); }
            }

            /* Animação de tremor (erro) */
            @keyframes tremble {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
            }

            /* Partículas ao correr */
            .run-particle {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                animation: particleFade 0.8s ease-out forwards;
            }

            @keyframes particleFade {
                0% {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50px) scale(0);
                }
            }

            /* Efeito de vitória */
            .victory-burst {
                position: fixed;
                font-size: 2rem;
                z-index: 1000;
                pointer-events: none;
                animation: burstOut 1.5s ease-out forwards;
            }

            @keyframes burstOut {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
                }
            }

            /* Responsivo */
            @media (max-width: 768px) {
                #perseguicao-container {
                    left: 50%;
                    transform: translateX(-50%);
                    right: auto;
                    width: 85%;
                    max-width: 400px;
                    bottom: 60px;
                    height: 100px;
                }

                .lume-runner,
                .danger-chaser {
                    font-size: 2rem;
                    bottom: 20px;
                }

                .safe-zone {
                    width: 60px;
                    height: 80px;
                }

                .safe-zone-flag {
                    font-size: 2rem;
                }

                .safe-zone-label {
                    font-size: 0.6rem;
                }

                .marker-label {
                    font-size: 0.5rem;
                }
            }
        `;

        document.head.appendChild(style);
    },

    // Atualizar posições de Lume e do perigo
    updatePositions: function() {
        const lume = document.getElementById('lume-runner');
        const danger = document.getElementById('danger-chaser');

        if (!lume || !danger) return;

        // Garantir que não ultrapassa limites
        this.lumePosition = Math.max(0, Math.min(80, this.lumePosition));
        this.dangerPosition = Math.max(0, Math.min(70, this.dangerPosition));

        lume.style.left = this.lumePosition + '%';
        danger.style.left = this.dangerPosition + '%';

        console.log(`🏃‍♂️ Posições - Lume: ${this.lumePosition}% | Perigo: ${this.dangerPosition}%`);
        console.log(`   Distância: ${this.lumePosition - this.dangerPosition}%`);

        // Verificar se perigo alcançou Lume
        if (this.dangerPosition >= this.lumePosition - 5) {
            console.warn('⚠️ PERIGO MUITO PRÓXIMO!');
            this.onDangerClose();
        }
    },

    // Lume avança (quando acerta)
    runForward: function() {
        console.log('⬆️ runForward() chamado. Fase atual:', this.currentStep, '/ Total:', this.totalSteps);

        if (this.currentStep >= this.totalSteps - 1) {
            console.log('🚫 Lume já completou todas as fases!');
            return;
        }

        this.currentStep++;

        // Avançar 15% por acerto
        this.lumePosition += 15;

        console.log('✅ Lume avançou para:', this.lumePosition + '%');

        // Adicionar classe de animação
        const lume = document.getElementById('lume-runner');
        lume.classList.add('running');

        // Criar partículas
        this.createRunParticles();

        // Atualizar posição
        this.updatePositions();

        // Remover classe após animação
        setTimeout(() => {
            lume.classList.remove('running');
        }, 800);

        // Verificar se chegou na zona segura (80%)
        if (this.lumePosition >= 80) {
            console.log('🎉 LUME CHEGOU NA ZONA SEGURA!');
            setTimeout(() => {
                this.onReachSafety();
            }, 1000);
        }
    },

    // Perigo avança (quando erra)
    dangerAdvances: function() {
        console.log('❌ dangerAdvances() chamado');

        // Perigo avança 10% por erro
        this.dangerPosition += 10;

        console.log('🐉 Perigo avançou para:', this.dangerPosition + '%');

        // Adicionar classe de animação
        const danger = document.getElementById('danger-chaser');
        danger.classList.add('advancing');

        // Atualizar posição
        this.updatePositions();

        // Remover classe após animação
        setTimeout(() => {
            danger.classList.remove('advancing');
        }, 1000);
    },

    // Criar partículas de corrida
    createRunParticles: function() {
        const lume = document.getElementById('lume-runner');
        const rect = lume.getBoundingClientRect();

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'run-particle';
                particle.style.left = rect.left + 'px';
                particle.style.top = (rect.top + rect.height / 2) + 'px';
                particle.style.position = 'fixed';

                document.body.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 800);
            }, i * 50);
        }
    },

    // Quando perigo fica muito próximo
    onDangerClose: function() {
        console.warn('⚠️ PERIGO MUITO PRÓXIMO DE LUME!');

        const lume = document.getElementById('lume-runner');
        lume.style.animation = 'tremble 0.3s';

        setTimeout(() => {
            lume.style.animation = '';
        }, 300);
    },

    // Quando chega na zona segura
    onReachSafety: function() {
        console.log('🎉 Lume chegou na zona segura!');

        const lume = document.getElementById('lume-runner');
        lume.style.transform = 'scale(1.5)';

        // Efeito de vitória
        this.createVictoryEffect();
    },

    // Efeito de vitória
    createVictoryEffect: function() {
        const emojis = ['⭐', '🌟', '✨', '💫', '🎉', '🎊'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                particle.className = 'victory-burst';

                // Posição inicial (perto da zona segura)
                const startX = window.innerWidth - 100;
                const startY = window.innerHeight - 100;

                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';

                // Direção aleatória
                const tx = (Math.random() - 0.5) * 300;
                const ty = (Math.random() - 0.5) * 300;
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');

                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 1500);
            }, i * 80);
        }
    },

    // Mostrar mecânica (mobile: trazer para frente)
    showMechanic: function() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer && window.innerWidth <= 768) {
            console.log('📱 Mostrando mecânica (mobile)');
            gameContainer.classList.add('showing-mechanic');
        }
    },

    // Esconder mecânica (mobile: voltar para fundo)
    hideMechanic: function() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer && window.innerWidth <= 768) {
            console.log('📱 Escondendo mecânica (mobile)');
            gameContainer.classList.remove('showing-mechanic');
        }
    },

    // Feedback de acerto
    onCorrect: function() {
        console.log('✅ Resposta correta! Lume avança...');

        // Mobile: mostrar mecânica antes da animação
        this.showMechanic();

        // Pequeno delay para transição de opacity
        setTimeout(() => {
            this.runForward();
            // ✅ CORREÇÃO: Não esconde mais automaticamente
            // base.js vai esconder no timing certo (após trocar fase)
        }, 100);
    },

    // Feedback de erro
    onWrong: function() {
        console.log('❌ Resposta errada! Perigo avança...');

        // Mobile: mostrar mecânica antes da animação
        this.showMechanic();

        setTimeout(() => {
            this.dangerAdvances();

            // Shake effect em Lume
            const lume = document.getElementById('lume-runner');
            lume.style.animation = 'tremble 0.5s';
            setTimeout(() => {
                lume.style.animation = '';
                // ✅ CORREÇÃO: Não esconde mais automaticamente
                // base.js vai esconder no timing certo
            }, 1100);
        }, 100);
    },

    // Resetar mecânica
    reset: function() {
        this.currentStep = 0;
        this.lumePosition = 20;
        this.dangerPosition = 0;
        this.updatePositions();

        const lume = document.getElementById('lume-runner');
        if (lume) {
            lume.style.transform = 'scale(1)';
        }
    },

    // Destruir mecânica
    destroy: function() {
        const container = document.getElementById('perseguicao-container');
        if (container) {
            container.remove();
        }

        const styles = document.getElementById('perseguicao-styles');
        if (styles) {
            styles.remove();
        }
    }
};

// Expor globalmente
window.PERSEGUICAO = PERSEGUICAO;

console.log('🏃‍♂️ perseguicao.js carregado!');
