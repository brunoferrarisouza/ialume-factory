// ===== MECÂNICA: ESCALADA =====
// Lume sobe uma montanha/torre conforme completa as fases

const ESCALADA = {
    name: 'escalada',
    currentStep: 0,
    totalSteps: 5, // Fase 0-4
    cenario: 'montanha-nevada', // ← NOVO: Cenário padrão
    checkpoints: {}, // ← NOVO: Rastrear elementos que já apareceram

    // Inicializar mecânica
    init: function(config) {
        console.log('🏔️ ESCALADA.init() chamado com config:', config);

        if (!config || !config.totalSteps) {
            console.error('❌ ERRO: config.totalSteps não fornecido!');
            return;
        }

        this.totalSteps = config.totalSteps;
        this.currentStep = 0;
        this.cenario = config.cenario || 'montanha-nevada'; // ← NOVO: Pegar cenário do config
        this.checkpoints = {}; // ← NOVO: Resetar checkpoints

        console.log('✅ Mecânica ESCALADA inicializada');
        console.log('   Total de andares (totalSteps):', this.totalSteps);
        console.log('   Andar atual (currentStep):', this.currentStep);
        console.log('   🎨 Cenário escolhido:', this.cenario);
        console.log('   ✅ OPÇÃO A: 4 fases = 4 andares (BASE=0, ANDAR 1, ANDAR 2, TOPO=3)');
        console.log('   Andares a criar: BASE (0) até TOPO (' + (this.totalSteps - 1) + ')');

        this.injectBackground(); // ← Injetar backgrounds PRIMEIRO
        this.injectProgressBar(); // ← NOVO: Barra de progresso
        this.injectHTML();
        this.injectCSS();
        this.updatePosition();
        this.updateVisibleFloors(); // ← Mostrar degraus iniciais (1,2,3)
        this.applySkyGraduation(0); // ← Estado inicial (manhã)
    },

    // ===== NOVO: Sistema de Parallax =====
    // Injetar backgrounds com 3 camadas
    injectBackground: function() {
        const container = document.querySelector('.game-container');

        // Verificar se container existe
        if (!container) {
            console.warn('⚠️ .game-container não encontrado, tentando novamente...');
            setTimeout(() => this.injectBackground(), 100);
            return;
        }

        // Verificar se já existe (evitar duplicação)
        if (document.getElementById('escalada-background')) {
            console.log('⏭️ Background já injetado');
            return;
        }

        console.log('🎨 Injetando backgrounds mockados (cenário:', this.cenario + ')');

        // Definir cores por cenário (mockup com gradientes CSS)
        const cenarios = {
            'montanha-nevada': {
                layer1: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)', // Céu azul
                layer2: 'linear-gradient(180deg, #708090 0%, #A9A9A9 60%)', // Montanhas cinzas
                layer3: 'linear-gradient(180deg, transparent 0%, #F5F5F5 80%)' // Neve
            },
            'vulcao': {
                layer1: 'linear-gradient(180deg, #FF4500 0%, #8B0000 100%)', // Céu laranja/vermelho
                layer2: 'linear-gradient(180deg, #2F4F4F 0%, #696969 60%)', // Rochas escuras
                layer3: 'linear-gradient(180deg, transparent 0%, #FF6347 80%)' // Lava
            }
        };

        const bg = cenarios[this.cenario] || cenarios['montanha-nevada'];

        // Criar estrutura HTML dos backgrounds
        const bgHTML = `
            <div id="escalada-background" class="escalada-background">
                <div class="bg-layer bg-layer-1" style="background: ${bg.layer1}"></div>
                <div class="bg-layer bg-layer-2" style="background: ${bg.layer2}"></div>
                <div class="bg-layer bg-layer-3" style="background: ${bg.layer3}"></div>
            </div>
        `;

        // Injetar ANTES de tudo (para ficar atrás)
        container.insertAdjacentHTML('afterbegin', bgHTML);

        console.log('✅ Backgrounds mockados injetados (3 camadas)');
    },

    // ===== BARRA DE PROGRESSO =====

    injectProgressBar: function() {
        const container = document.querySelector('.game-container');
        if (!container) return;

        // Verificar se já existe
        if (document.getElementById('escalada-progress')) {
            console.log('⏭️ Barra de progresso já injetada');
            return;
        }

        const progressHTML = `
            <div id="escalada-progress" class="progress-bar">
                <div class="progress-track">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <span class="progress-text" id="progress-text">Questão 1/${this.totalSteps}</span>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', progressHTML);
        console.log('✅ Barra de progresso injetada');
    },

    updateProgressBar: function() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill && progressText) {
            const percentage = (this.currentStep / (this.totalSteps - 1)) * 100;
            progressFill.style.width = percentage + '%';

            // Questão atual (currentStep vai de 0 a totalSteps-1, mas questões vão de 1 a totalSteps)
            const currentQuestion = this.currentStep + 1;
            progressText.textContent = `Questão ${currentQuestion}/${this.totalSteps}`;

            console.log(`📊 Barra atualizada: ${currentQuestion}/${this.totalSteps} (${Math.round(percentage)}%)`);
        }
    },


    // Atualizar janela móvel de 3 degraus
    updateVisibleFloors: function() {
        // Determinar grupo atual (0, 1, ou 2)
        const groupIndex = Math.floor(this.currentStep / 3);
        const firstFloor = groupIndex * 3 + 1; // 1, 4, ou 7

        // Degraus visíveis do grupo atual
        const visibleFloors = [firstFloor, firstFloor + 1, firstFloor + 2];

        console.log(`🪟 Janela móvel: Grupo ${groupIndex + 1}, mostrando degraus ${visibleFloors.join(', ')}`);

        // Mostrar/esconder degraus
        const allFloors = document.querySelectorAll('.floor');
        allFloors.forEach(floor => {
            const floorNumber = parseInt(floor.dataset.floor);

            if (visibleFloors.includes(floorNumber)) {
                // Mostrar (com transição)
                floor.classList.add('visible');
            } else {
                // Esconder (com transição)
                floor.classList.remove('visible');
            }
        });
    },

    // Mover backgrounds com parallax + graduação de 8 faixas
    moveParallax: function() {
        // Calcular progresso (0 a 1)
        const progress = this.currentStep / (this.totalSteps - 1);

        // Porcentagem de movimento (0% a 100%)
        const movePercent = progress * 100;

        // Aplicar parallax com velocidades diferentes
        const layer1 = document.querySelector('.bg-layer-1');
        const layer2 = document.querySelector('.bg-layer-2');
        const layer3 = document.querySelector('.bg-layer-3');

        if (layer1) {
            // Fundo: move devagar (20%)
            layer1.style.transform = `translateY(-${movePercent * 0.2}%)`;
        }

        if (layer2) {
            // Meio: move médio (50%)
            layer2.style.transform = `translateY(-${movePercent * 0.5}%)`;
        }

        if (layer3) {
            // Frente: move rápido (100%)
            layer3.style.transform = `translateY(-${movePercent * 1.0}%)`;
        }

        console.log(`🎬 Parallax: progresso ${Math.round(progress * 100)}%, move ${Math.round(movePercent)}%`);
    },

    // Aplicar graduação do céu (8 cores fixas)
    applySkyGraduation: function(step) {
        const layer1 = document.querySelector('.bg-layer-1');
        if (!layer1) return;

        // 8 cores representando manhã → noite
        const skyColors = [
            '#87CEEB', // 0 - Azul claro (manhã)
            '#6FB1D8', // 1 - Azul médio (meio da manhã)
            '#5A9BC5', // 2 - Azul (tarde)
            '#FF8C42', // 3 - Laranja (pôr do sol)
            '#FF6B6B', // 4 - Vermelho/rosa (entardecer)
            '#4A5899', // 5 - Roxo escuro (crepúsculo)
            '#2E3A59', // 6 - Azul escuro (noite inicial)
            '#1A1F3A'  // 7 - Quase preto (noite profunda)
        ];

        // Garantir que step está no range
        const currentColor = skyColors[Math.min(step, 7)];

        // Aplicar cor com transição suave
        layer1.style.transition = 'background 1.5s ease';
        layer1.style.background = currentColor;

        console.log(`🌈 Céu atualizado: Step ${step} → ${currentColor}`);
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
    
    // Gerar 9 degraus físicos (para 8 questões + chegada)
    generateFloors: function() {
        console.log('🏭️ Gerando 9 degraus físicos (janela móvel de 3)...');

        let floorsHTML = '';

        // Criar 9 degraus (numerados de 1 a 9)
        for (let i = 9; i >= 1; i--) {
            const isTop = i === 9;

            floorsHTML += `
                <div class="floor" data-floor="${i}">
                    <div class="floor-platform ${isTop ? 'top' : ''}">
                        <span class="floor-label">DEGRAU ${i}</span>
                        ${isTop ? '<span class="victory-flag">🚩</span>' : ''}
                    </div>
                </div>
            `;
        }

        console.log('✅ 9 degraus físicos gerados (1-9)');
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
            /* ===== SISTEMA DE BACKGROUNDS PARALLAX ===== */

            /* Container dos backgrounds */
            .escalada-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                z-index: 0; /* Atrás de tudo */
            }

            /* Camadas de parallax */
            .bg-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 120%; /* Extra 20% para movimento */
                background-size: cover;
                background-position: center bottom;
                transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1);
                will-change: transform; /* GPU acceleration */
            }

            /* Z-index de cada camada */
            .bg-layer-1 { z-index: 1; } /* Fundo (mais longe) */
            .bg-layer-2 { z-index: 2; } /* Meio */
            .bg-layer-3 { z-index: 3; } /* Frente (mais perto) */

            /* ===== MECÂNICA ESCALADA ===== */

            /* Container da mecânica - OCUPA 100% DA TELA */
            #escalada-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                z-index: 1; /* Atrás dos popups */
                pointer-events: none;
            }
            
            /* Montanha - CENTRALIZADA HORIZONTALMENTE */
            .mountain {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 0;
                bottom: 0;
                width: 250px;
                pointer-events: none;
            }

            /* Floor - POSIÇÃO ABSOLUTA COM TRANSIÇÃO */
            .floor {
                position: absolute;
                left: 0;
                right: 0;
                height: 40px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.6s ease, visibility 0.6s ease;
            }

            /* Posições dos 3 degraus visíveis (margem simétrica 10%) */
            .floor[data-floor="1"], .floor[data-floor="4"], .floor[data-floor="7"] {
                bottom: 10%; /* INFERIOR */
            }

            .floor[data-floor="2"], .floor[data-floor="5"], .floor[data-floor="8"] {
                bottom: 50%; /* MÉDIO (centro) */
                transform: translateY(50%);
            }

            .floor[data-floor="3"], .floor[data-floor="6"], .floor[data-floor="9"] {
                bottom: 90%; /* SUPERIOR */
                transform: translateY(50%);
            }

            /* Quando visível */
            .floor.visible {
                opacity: 1;
                visibility: visible;
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

            /* ===== ANIMAÇÕES DOS CHECKPOINTS ===== */

            /* Pássaros voando horizontal */
            @keyframes voar-horizontal {
                0%, 100% {
                    transform: translateX(0) translateY(0) rotate(-5deg);
                }
                25% {
                    transform: translateX(-15px) translateY(-8px) rotate(-10deg);
                }
                50% {
                    transform: translateX(-30px) translateY(5px) rotate(0deg);
                }
                75% {
                    transform: translateX(-15px) translateY(-3px) rotate(5deg);
                }
            }

            /* Nuvens flutuando lento */
            @keyframes flutuar-lento {
                0%, 100% {
                    transform: translateX(0) translateY(0);
                }
                50% {
                    transform: translateX(20px) translateY(-10px);
                }
            }

            /* Nuvens flutuando médio */
            @keyframes flutuar-medio {
                0%, 100% {
                    transform: translateX(0) translateY(0);
                }
                33% {
                    transform: translateX(15px) translateY(-15px);
                }
                66% {
                    transform: translateX(-10px) translateY(-8px);
                }
            }

            /* Urubus voando circular */
            @keyframes voar-circular {
                0% {
                    transform: translateX(0) translateY(0) rotate(0deg);
                }
                25% {
                    transform: translateX(30px) translateY(-20px) rotate(-15deg);
                }
                50% {
                    transform: translateX(40px) translateY(10px) rotate(10deg);
                }
                75% {
                    transform: translateX(10px) translateY(20px) rotate(-5deg);
                }
                100% {
                    transform: translateX(0) translateY(0) rotate(0deg);
                }
            }

            /* Estrelas piscando */
            @keyframes piscar {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.3;
                    transform: scale(0.8);
                }
            }

            /* Twinkle para estrelas do céu */
            @keyframes twinkle {
                0%, 100% {
                    opacity: inherit;
                    transform: scale(1);
                }
                50% {
                    opacity: calc(inherit * 0.5);
                    transform: scale(1.2);
                }
            }

            /* Estilos dos elementos checkpoint */
            .checkpoint-element {
                transition: opacity 0.5s ease-in-out;
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
    
    // Atualizar posição do Lume - BASEADO NO DEGRAU ATUAL
    updatePosition: function() {
        const lume = document.getElementById('lume-climber');
        if (!lume) return;

        // Número do degrau atual (1-9)
        const currentFloor = this.currentStep + 1;

        // Posição dentro do grupo (0=inferior, 1=médio, 2=superior)
        const positionInGroup = this.currentStep % 3;

        // Determinar posição vertical
        let targetBottom;
        let positionName;

        if (positionInGroup === 0) {
            // INFERIOR
            targetBottom = 'calc(10% + 40px)'; // 10% + altura da plataforma
            positionName = 'INFERIOR';
        } else if (positionInGroup === 1) {
            // MÉDIO
            targetBottom = '50%';
            positionName = 'MÉDIO';
        } else {
            // SUPERIOR
            targetBottom = 'calc(90% + 20px)';
            positionName = 'SUPERIOR';
        }

        // Posicionar Lume
        lume.style.bottom = targetBottom;

        console.log(`🏔️ Lume no degrau ${currentFloor} (posição ${positionName} do grupo)`);
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

        // ✅ Atualizar janela móvel (mostrar degraus corretos)
        this.updateVisibleFloors();

        // ✅ Mover backgrounds em parallax
        this.moveParallax();

        // ✅ Atualizar graduação do céu (baseado no step)
        this.applySkyGraduation(this.currentStep);

        // ✅ NOVO: Atualizar barra de progresso
        this.updateProgressBar();

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
    
    // Feedback de acerto
    onCorrect: function() {
        console.log('✅ Resposta correta! Subindo...');

        // Pequeno delay para animação
        setTimeout(() => {
            this.climb();
        }, 100);
    },

    // Feedback de erro - AGORA TAMBÉM SOBE
    onWrong: function() {
        console.log('❌ Resposta errada, mas Lume sobe mesmo assim!');

        // Shake effect rápido antes de subir
        const lume = document.getElementById('lume-climber');
        lume.style.animation = 'shake 0.3s';

        setTimeout(() => {
            lume.style.animation = '';
            // SOBE mesmo com erro
            this.climb();
        }, 300);
    },
    
    // Resetar mecânica
    reset: function() {
        this.currentStep = 0;
        this.checkpoints = {}; // Resetar checkpoints
        this.updatePosition();

        const lume = document.getElementById('lume-climber');
        if (lume) {
            lume.style.transform = 'translateX(-50%) scale(1)';
        }

        // Remover todos os elementos checkpoint
        const checkpointElements = document.querySelectorAll('.checkpoint-element');
        checkpointElements.forEach(el => el.remove());

        // Restaurar brilho do céu
        const layer1 = document.querySelector('.bg-layer-1');
        if (layer1) {
            layer1.style.filter = 'brightness(1)';
        }

        // Resetar parallax
        const layer2 = document.querySelector('.bg-layer-2');
        const layer3 = document.querySelector('.bg-layer-3');
        if (layer1) layer1.style.transform = 'translateY(0)';
        if (layer2) layer2.style.transform = 'translateY(0)';
        if (layer3) layer3.style.transform = 'translateY(0)';

        // ✅ NOVO: Resetar barra de progresso
        this.updateProgressBar();

        console.log('🔄 Reset completo (checkpoints + elementos + parallax + barra)');
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
