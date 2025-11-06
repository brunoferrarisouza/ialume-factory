// ===== MECÂNICA: ESCALADA =====
// Lume sobe uma montanha/torre conforme completa as fases

const ESCALADA = {
    name: 'escalada',
    currentStep: 0,
    totalSteps: 5, // Fase 0-4
    
    // Inicializar mecânica
    init: function(config) {
        console.log('🏔️ ESCALADA.init() chamado com config:', config);
        
        if (!config || !config.totalSteps) {
            console.error('❌ ERRO: config.totalSteps não fornecido!');
            return;
        }
        
        this.totalSteps = config.totalSteps;
        this.currentStep = 0;
        
        console.log('✅ Mecânica ESCALADA inicializada');
        console.log('   Total de andares (totalSteps):', this.totalSteps);
        console.log('   Andar atual (currentStep):', this.currentStep);
        console.log('   ✅ OPÇÃO A: 4 fases = 4 andares (BASE=0, ANDAR 1, ANDAR 2, TOPO=3)');
        console.log('   Andares a criar: BASE (0) até TOPO (' + (this.totalSteps - 1) + ')');
        
        this.injectHTML();
        this.injectCSS();
        this.updatePosition();
    },
    
    // Injetar HTML da montanha
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
            <div id="escalada-container" class="mechanic-container">
                <!-- Montanha com andares -->
                <div class="mountain">
                    ${this.generateFloors()}
                </div>

                <!-- Lume escalador -->
                <div id="lume-climber" class="lume-climber">
                    🌟
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', mechanicHTML);
    },
    
    // Gerar andares da montanha
    generateFloors: function() {
        console.log('🏭️ Gerando andares da montanha...');
        console.log('   Criando', this.totalSteps, 'andares (BASE=0 até TOPO=' + (this.totalSteps - 1) + ')');
        
        let floorsHTML = '';
        
        // ✅ Loop de (totalSteps - 1) até 0
        for (let i = this.totalSteps - 1; i >= 0; i--) {
            const floorNumber = i;
            
            // ✅ Label: BASE para 0, "ANDAR X" para os outros
            const floorLabel = i === 0 ? 'BASE' : `ANDAR ${i}`;
            
            // ✅ Topo é o último andar (totalSteps - 1)
            const isTop = i === this.totalSteps - 1;
            
            console.log('   Criando:', floorLabel, '(índice', i + ')', isTop ? '🏆 TOPO' : '');
            
            floorsHTML += `
                <div class="floor" data-floor="${floorNumber}">
                    <div class="floor-platform ${isTop ? 'top' : ''}">
                        <span class="floor-label">${floorLabel}</span>
                        ${isTop ? '<span class="victory-flag">🚩</span>' : ''}
                    </div>
                </div>
            `;
        }
        
        console.log('✅ Todos os', this.totalSteps, 'andares gerados!');
        return floorsHTML;
    },
    
    // Injetar CSS
    injectCSS: function() {
        if (document.getElementById('escalada-styles')) return;
        
        // ✅ Calcular altura dinâmica dos andares
        const numAndares = this.totalSteps; // OPÇÃO A: totalSteps = número de andares
        const floorHeightPercent = 100 / numAndares;
        
        console.log('🎨 Criando CSS com', numAndares, 'andares, altura de cada:', floorHeightPercent + '%');
        
        const style = document.createElement('style');
        style.id = 'escalada-styles';
        style.textContent = `
            /* Container da mecânica */
            #escalada-container {
                position: absolute;
                right: 40px;
                top: 100px;
                bottom: 40px;
                width: 200px;
                z-index: 100;
                pointer-events: none;
            }
            
            /* Montanha */
            .mountain {
                position: relative;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            /* Andar - ✅ ALTURA DINÂMICA */
            .floor {
                position: relative;
                height: ${floorHeightPercent}%; /* Calculado dinamicamente! */
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }
            
            /* Plataforma do andar */
            .floor-platform {
                width: 100%;
                height: 40px;
                background: linear-gradient(to bottom, #8b7355, #654321);
                border-radius: 10px 10px 0 0;
                border: 3px solid #5a3a1a;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .floor-platform:hover {
                transform: scale(1.05);
            }
            
            /* Plataforma do topo (vitória) */
            .floor-platform.top {
                background: linear-gradient(to bottom, #ffd700, #ff8c00);
                border-color: #cc6600;
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            }
            
            /* Label do andar */
            .floor-label {
                font-size: 0.7rem;
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                letter-spacing: 1px;
            }
            
            /* Bandeira de vitória */
            .victory-flag {
                position: absolute;
                top: -30px;
                font-size: 2rem;
                animation: wave 1s ease-in-out infinite;
            }
            
            @keyframes wave {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
            }
            
            /* Lume escalador - CORRIGIDO */
            .lume-climber {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                font-size: 3rem;
                filter: drop-shadow(0 0 20px #fff8dc);
                transition: bottom 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
                            transform 0.3s ease;
                z-index: 101;
                pointer-events: none;
            }
            
            /* Animação de subida */
            .lume-climber.climbing {
                animation: climb 1s ease-in-out;
            }
            
            @keyframes climb {
                0%, 100% { transform: translateX(-50%) scale(1); }
                25% { transform: translateX(-50%) scale(1.2) rotate(-10deg); }
                50% { transform: translateX(-50%) scale(1.1) rotate(5deg); }
                75% { transform: translateX(-50%) scale(1.2) rotate(-5deg); }
            }
            
            /* Shake animation */
            @keyframes shake {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                25% { transform: translateX(-50%) translateY(-10px); }
                50% { transform: translateX(-50%) translateY(5px); }
                75% { transform: translateX(-50%) translateY(-5px); }
            }
            
            /* Partículas ao subir */
            .climb-particle {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                animation: particleRise 1s ease-out forwards;
            }
            
            @keyframes particleRise {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0);
                }
            }
            
            /* Responsivo */
            @media (max-width: 768px) {
                #escalada-container {
                    left: 50%;
                    transform: translateX(-50%);
                    right: auto;
                    top: 80px;
                    bottom: 80px;
                    width: 60%;
                    max-width: 300px;
                }
                
                .floor-platform {
                    height: 30px;
                }
                
                .floor-label {
                    font-size: 0.6rem;
                }
                
                .lume-climber {
                    font-size: 2rem;
                }
                
                .victory-flag {
                    font-size: 1.5rem;
                    top: -25px;
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Atualizar posição do Lume - CORRIGIDO
    updatePosition: function() {
        const lume = document.getElementById('lume-climber');
        if (!lume) return;
        
        // Calcular posição (0 = base, 4 = topo)
        // Lume fica EM CIMA da plataforma
        const floorHeight = 100 / this.totalSteps;
        const platformHeight = 40; // Altura da plataforma em px
        const lumeOffset = 20; // Ajuste fino para centralizar
        
        const bottomPosition = (this.currentStep * floorHeight);
        
        // Posicionar em cima da plataforma
        lume.style.bottom = `calc(${bottomPosition}% + ${platformHeight - lumeOffset}px)`;
        
        console.log(`🏔️ Lume no andar ${this.currentStep}/${this.totalSteps - 1}`);
    },
    
    // Subir um andar (quando acerta)
    climb: function() {
        console.log('⬆️ climb() chamado. Andar atual:', this.currentStep, '/ Total:', this.totalSteps);
        
        if (this.currentStep >= this.totalSteps - 1) {
            console.log('🚫 Lume já está no topo! (andar', this.currentStep, '=', this.totalSteps - 1, ')');
            return;
        }
        
        this.currentStep++;
        console.log('✅ Subindo para andar', this.currentStep);
        
        // Adicionar classe de animação
        const lume = document.getElementById('lume-climber');
        lume.classList.add('climbing');
        
        // Criar partículas
        this.createParticles();
        
        // Atualizar posição
        this.updatePosition();
        
        // Remover classe após animação
        setTimeout(() => {
            lume.classList.remove('climbing');
        }, 1000);
        
        // VERIFICAÇÃO CORRETA: Chegou no topo?
        const isAtTop = this.currentStep === this.totalSteps - 1;
        console.log('🎯 Está no topo?', isAtTop, '(currentStep:', this.currentStep, '=== totalSteps-1:', this.totalSteps - 1, ')');
        
        if (isAtTop) {
            console.log('🎉 CHEGOU NO TOPO! Disparando efeito de vitória...');
            setTimeout(() => {
                this.onReachTop();
            }, 1000);
        }
    },
    
    // Descer um andar (quando erra) - opcional
    fall: function() {
        if (this.currentStep <= 0) return;
        
        this.currentStep--;
        
        const lume = document.getElementById('lume-climber');
        lume.style.transform = 'translateX(-50%) scale(0.8)';
        
        this.updatePosition();
        
        setTimeout(() => {
            lume.style.transform = 'translateX(-50%) scale(1)';
        }, 300);
    },
    
    // Criar partículas ao subir
    createParticles: function() {
        const lume = document.getElementById('lume-climber');
        const rect = lume.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'climb-particle';
                particle.style.left = (rect.left + rect.width / 2) + 'px';
                particle.style.top = (rect.top + rect.height / 2) + 'px';
                particle.style.position = 'fixed';
                
                // Posição aleatória
                const angle = (Math.random() - 0.5) * 180;
                particle.style.setProperty('--angle', angle + 'deg');
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 50);
        }
    },
    
    // Quando chega no topo
    onReachTop: function() {
        console.log('🎉 Lume chegou no topo!');
        
        const lume = document.getElementById('lume-climber');
        lume.style.transform = 'translateX(-50%) scale(1.5)';
        
        // Efeito de vitória
        this.createVictoryEffect();
    },
    
    // Efeito de vitória
    createVictoryEffect: function() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = '⭐';
                particle.style.position = 'fixed';
                particle.style.right = '140px';
                particle.style.top = '100px';
                particle.style.fontSize = '2rem';
                particle.style.zIndex = '1000';
                particle.style.pointerEvents = 'none';
                particle.style.animation = `particleRise ${1 + Math.random()}s ease-out forwards`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 100);
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
        console.log('✅ Resposta correta! Subindo...');

        // Mobile: mostrar mecânica antes da animação
        this.showMechanic();

        // Pequeno delay para transição de opacity
        setTimeout(() => {
            this.climb();
            // ✅ CORREÇÃO: Não esconde mais automaticamente
            // base.js vai esconder no timing certo (após trocar fase)
        }, 100);
    },

    // Feedback de erro
    onWrong: function() {
        console.log('❌ Resposta errada!');
        // Não desce, só não sobe

        // Mobile: mostrar mecânica antes da animação
        this.showMechanic();

        // Shake effect
        setTimeout(() => {
            const lume = document.getElementById('lume-climber');
            lume.style.animation = 'shake 0.5s';
            setTimeout(() => {
                lume.style.animation = '';
                // ✅ CORREÇÃO: Não esconde mais automaticamente
                // base.js vai esconder no timing certo
            }, 500);
        }, 100);
    },
    
    // Resetar mecânica
    reset: function() {
        this.currentStep = 0;
        this.updatePosition();
        
        const lume = document.getElementById('lume-climber');
        if (lume) {
            lume.style.transform = 'translateX(-50%) scale(1)';
        }
    },
    
    // Destruir mecânica
    destroy: function() {
        const container = document.getElementById('escalada-container');
        if (container) {
            container.remove();
        }
        
        const styles = document.getElementById('escalada-styles');
        if (styles) {
            styles.remove();
        }
    }
};

// Expor globalmente
window.ESCALADA = ESCALADA;

console.log('🏔️ escalada.js carregado!');
