// ===== MECÂNICA: ESCALADA =====
// Lume sobe uma montanha/torre conforme completa as fases

const ESCALADA = {
    name: 'escalada',
    currentStep: 0,
    totalSteps: 5, // Fase 0-4
    cenario: 'montanha-nevada', // ← NOVO: Cenário padrão
    checkpoints: {}, // ← NOVO: Rastrear elementos que já apareceram
    crystalsCollected: 0, // ✅ NOVO: Contador de cristais coletados

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
        this.crystalsCollected = 0; // ✅ NOVO: Resetar cristais

        console.log('✅ Mecânica ESCALADA inicializada');
        console.log('   Total de andares (totalSteps):', this.totalSteps);
        console.log('   Andar atual (currentStep):', this.currentStep);
        console.log('   🎨 Cenário escolhido:', this.cenario);
        console.log('   ✅ OPÇÃO A: 4 fases = 4 andares (BASE=0, ANDAR 1, ANDAR 2, TOPO=3)');
        console.log('   Andares a criar: BASE (0) até TOPO (' + (this.totalSteps - 1) + ')');

        this.injectBackground(); // ← Injetar backgrounds PRIMEIRO
        this.injectDecorations(); // ← NOVO: Nuvens e preparar pássaros
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

        console.log('🎨 Injetando backgrounds REAIS com assets (cenário:', this.cenario + ')');

        // Definir assets por cenário (imagens reais do OpenGameArt)
        const cenarios = {
            'montanha-nevada': {
                layer1: '../assets/backgrounds/escalada/layer-1-sky.png',          // Céu
                layer2: '../assets/backgrounds/escalada/layer-2-mountains-far.png', // Montanhas distantes
                cliffWall: '../assets/tiles/snow/slice16_16.png',                  // Parede de gelo vertical (NOVA!)
                layer3: '../assets/backgrounds/escalada/layer-3-mountains-mid.png'  // Montanhas próximas
            },
            'deserto-canyon': {
                layer1: '../assets/backgrounds/escalada/desert-layer-1.png',  // Céu azul com nuvens
                layer2: '../assets/backgrounds/escalada/desert-layer-3.png',  // Dunas distantes
                cliffWall: '../assets/tiles/castle/slice16_16.png',          // Parede de pedra vertical (NOVA!)
                layer3: '../assets/backgrounds/escalada/desert-layer-5.png'   // Cactos próximos
            },
            'cidade-floresta': {
                layer1: '../assets/backgrounds/escalada/bg03-layer-1.png',  // Céu com nuvens
                layer2: '../assets/backgrounds/escalada/bg03-layer-2.png',  // Cidade/floresta distante
                cliffWall: '../assets/tiles/castle/slice17_17.png',         // Parede de pedra escura (NOVA!)
                layer3: '../assets/backgrounds/escalada/bg03-layer-3.png'   // Cidade/floresta próxima
            },
            'vulcao': {
                // Fallback para gradientes caso assets não existam
                layer1: 'linear-gradient(180deg, #FF4500 0%, #8B0000 100%)',
                layer2: 'linear-gradient(180deg, #2F4F4F 0%, #696969 60%)',
                cliffWall: 'linear-gradient(180deg, #8B0000 0%, #4B0000 100%)',  // Gradiente vertical escuro
                layer3: 'linear-gradient(180deg, transparent 0%, #FF6347 80%)'
            }
        };

        const bg = cenarios[this.cenario] || cenarios['montanha-nevada'];

        // Criar estrutura HTML dos backgrounds
        // Se for URL de imagem, usar background-image, senão usar background (gradiente)
        const bgHTML = `
            <div id="escalada-background" class="escalada-background">
                <!-- ✅ Fallback: Cor final do céu (preenche espaço branco) -->
                <div class="bg-sky-fallback"></div>

                <div class="bg-layer bg-layer-1" style="${bg.layer1.endsWith('.png') ? `background-image: url('${bg.layer1}')` : `background: ${bg.layer1}`}"></div>
                <div class="bg-layer bg-layer-2" style="${bg.layer2.endsWith('.png') ? `background-image: url('${bg.layer2}')` : `background: ${bg.layer2}`}"></div>

                <!-- Montanha Central Gigante com Textura Irregular -->
                <div class="bg-central-mountain">
                    <svg class="mountain-texture" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="rock-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <!-- Linhas erráticas em ângulos diferentes -->
                                <path d="M 10,20 Q 30,15 50,25" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" fill="none"/>
                                <path d="M 60,40 Q 70,35 90,45" stroke="rgba(0,0,0,0.25)" stroke-width="2" fill="none"/>
                                <path d="M 5,60 Q 25,55 45,65" stroke="rgba(0,0,0,0.15)" stroke-width="1" fill="none"/>
                                <path d="M 55,80 Q 75,70 95,85" stroke="rgba(0,0,0,0.2)" stroke-width="1.8" fill="none"/>
                                <path d="M 15,10 L 35,30" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" fill="none"/>
                                <path d="M 70,15 L 80,35" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" fill="none"/>
                                <path d="M 20,50 L 40,70" stroke="rgba(0,0,0,0.16)" stroke-width="1.3" fill="none"/>
                                <path d="M 65,60 L 85,75" stroke="rgba(0,0,0,0.19)" stroke-width="1.6" fill="none"/>
                                <!-- Linhas mais longas e diagonais -->
                                <path d="M 0,30 Q 20,25 40,35 Q 60,30 100,40" stroke="rgba(0,0,0,0.12)" stroke-width="2.5" fill="none"/>
                                <path d="M 0,70 Q 30,65 60,75 Q 80,70 100,75" stroke="rgba(0,0,0,0.14)" stroke-width="2.2" fill="none"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#rock-lines)"/>
                    </svg>
                </div>

                <div class="bg-layer bg-layer-3" style="${bg.layer3.endsWith('.png') ? `background-image: url('${bg.layer3}')` : `background: ${bg.layer3}`}"></div>
            </div>
        `;

        // Injetar ANTES de tudo (para ficar atrás)
        container.insertAdjacentHTML('afterbegin', bgHTML);

        console.log('✅ Backgrounds REAIS injetados (3 camadas com assets do OpenGameArt)');
    },

    // ===== SISTEMA DE DECORAÇÕES (Nuvens + Pássaros) =====
    injectDecorations: function() {
        const container = document.querySelector('.game-container');
        if (!container) return;

        // Verificar se já existe
        if (document.getElementById('escalada-decorations')) {
            console.log('⏭️ Decorações já injetadas');
            return;
        }

        console.log('🎨 Injetando decorações (nuvens flutuando + pássaros)');

        // Criar container de decorações
        const decorHTML = `
            <div id="escalada-decorations" class="escalada-decorations">
                <!-- Nuvens flutuantes (sempre visíveis) -->
                <img src="../assets/decorations/clouds/cloud-1.png" class="cloud cloud-1" alt="">
                <img src="../assets/decorations/clouds/cloud-2.png" class="cloud cloud-2" alt="">
                <img src="../assets/decorations/clouds/cloud-1.png" class="cloud cloud-3" alt="">

                <!-- Pássaros (aparecem em checkpoints) -->
                <img src="../assets/decorations/birds/bird_2_eagle.png" class="bird bird-eagle" alt="" style="display: none;">
                <img src="../assets/decorations/birds/bird_2_cardinal.png" class="bird bird-cardinal" alt="" style="display: none;">
                <img src="../assets/decorations/birds/bird_1_bluejay.png" class="bird bird-bluejay" alt="" style="display: none;">
            </div>
        `;

        // Injetar após backgrounds, antes das fases
        const bgDiv = document.getElementById('escalada-background');
        if (bgDiv) {
            bgDiv.insertAdjacentHTML('afterend', decorHTML);
        } else {
            container.insertAdjacentHTML('afterbegin', decorHTML);
        }

        console.log('✅ Decorações injetadas (3 nuvens + 3 pássaros)');
    },

    // Mostrar pássaros em checkpoints específicos (25%, 50%, 75%)
    showBirdsAtProgress: function(progressPercent) {
        // Águia aparece aos 25%
        if (progressPercent >= 25 && !this.checkpoints.eagle) {
            const eagle = document.querySelector('.bird-eagle');
            if (eagle) {
                eagle.style.display = 'block';
                eagle.style.animation = 'flyAcross 8s linear infinite';
                this.checkpoints.eagle = true;
                console.log('🦅 Águia apareceu! (25%)');
            }
        }

        // Cardeal aparece aos 50%
        if (progressPercent >= 50 && !this.checkpoints.cardinal) {
            const cardinal = document.querySelector('.bird-cardinal');
            if (cardinal) {
                cardinal.style.display = 'block';
                cardinal.style.animation = 'flyAcross 6s linear infinite';
                this.checkpoints.cardinal = true;
                console.log('🐦 Cardeal apareceu! (50%)');
            }
        }

        // Bluejay aparece aos 75%
        if (progressPercent >= 75 && !this.checkpoints.bluejay) {
            const bluejay = document.querySelector('.bird-bluejay');
            if (bluejay) {
                bluejay.style.display = 'block';
                bluejay.style.animation = 'flyAcross 5s linear infinite';
                this.checkpoints.bluejay = true;
                console.log('🐦 Bluejay apareceu! (75%)');
            }
        }
    },

    // ✅ NOVO: Atualizar contador de cristais
    updateCrystalCounter: function() {
        const counterElement = document.getElementById('crystal-count');
        if (counterElement) {
            counterElement.textContent = this.crystalsCollected;

            // Animação pulse
            const counter = document.getElementById('crystal-counter');
            if (counter) {
                counter.classList.add('pulse');
                setTimeout(() => counter.classList.remove('pulse'), 300);
            }

            console.log(`💎 Cristais coletados: ${this.crystalsCollected}/${this.totalSteps}`);
        }
    },

    // ✅ NOVO: Coletar cristal (animação de PULSAR GIGANTE)
    collectCrystal: function(floorNumber) {
        console.log(`🔍 Coletando cristal do degrau ${floorNumber}...`);

        // 1. Encontrar cristal original
        const crystal = document.querySelector(`.crystal[data-floor="${floorNumber}"]`);
        if (!crystal) {
            console.error(`❌ Cristal do degrau ${floorNumber} não encontrado!`);
            return;
        }

        // 2. Parar animação CSS de rotação (spin)
        crystal.style.animation = 'none';
        console.log('🛑 Animação CSS parada');

        // Som de moeda (placeholder)
        this.playSound('coin');

        // 3. ENTRADA: AUMENTAR gradualmente para 6x (2s) girando ANTI-HORÁRIO
        setTimeout(() => {
            crystal.style.transition = 'transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            crystal.style.transform = 'translateX(-50%) scale(6) rotate(-360deg)';
            console.log('📈 Cristal crescendo gradualmente para 6x (2s) girando anti-horário...');
        }, 50);

        // 4. MANTER tamanho gigante por 1 segundo
        setTimeout(() => {
            console.log('💎 Cristal GIGANTE! (mantendo por 1s)');
        }, 2000);

        // 5. SAÍDA: DIMINUIR e SUMIR (0.5s) girando HORÁRIO - após 3s (2s aumentar + 1s manter)
        setTimeout(() => {
            console.log('📉 Cristal diminuindo e sumindo (girando horário)...');
            crystal.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
            crystal.style.transform = 'translateX(-50%) scale(0) rotate(360deg)';
            crystal.style.opacity = '0';
        }, 3000);

        // 6. REMOVER cristal após animação completa (3.5s total)
        setTimeout(() => {
            crystal.remove();
            console.log(`✅ Cristal removido do degrau ${floorNumber}`);
        }, 3500);

        // Incrementar contador
        this.crystalsCollected++;
        this.updateCrystalCounter();
    },

    // ✅ NOVO: Sistema de som (placeholder)
    playSound: function(soundName) {
        // Por enquanto apenas log (sem arquivos MP3)
        console.log(`🔊 Som "${soundName}" seria tocado aqui`);

        // TODO: Quando tiver assets MP3, descomentar:
        /*
        const sounds = {
            coin: new Audio('../assets/sounds/coin.mp3'),
            success: new Audio('../assets/sounds/success.mp3'),
            error: new Audio('../assets/sounds/error.mp3')
        };

        if (sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(err => console.warn('Erro ao tocar som:', err));
        }
        */
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
                <span class="progress-text" id="progress-text">Fase 1/${this.totalSteps}</span>
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

            // Fase atual (currentStep vai de 0 a totalSteps-1, mas fases vão de 1 a totalSteps)
            const currentQuestion = this.currentStep + 1;
            progressText.textContent = `Fase ${currentQuestion}/${this.totalSteps}`;

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

        // ✅ Controlar visibilidade da coruja (só aparece no grupo 1, que contém floor 2)
        const owlContainer = document.querySelector('.owl-container[data-floor="2"]');
        if (owlContainer) {
            if (groupIndex === 0) {
                // Grupo 1 (floors 1, 2, 3) - MOSTRAR coruja
                owlContainer.classList.add('visible');
                console.log('🦉 Umbra apareceu no degrau 2!');
            } else {
                // Outros grupos - ESCONDER coruja
                owlContainer.classList.remove('visible');
                console.log('🦉 Umbra desapareceu (não está no grupo atual)');
            }
        }
    },

    // ✅ PARALLAX 50%: Ajustado para não mostrar espaço branco
    moveParallax: function() {
        // Calcular progresso (0 a 1)
        const progress = this.currentStep / (this.totalSteps - 1);

        // Porcentagem de movimento (0% a 100%)
        const movePercent = progress * 100;

        // Aplicar parallax com velocidades ajustadas (máximo 50%)
        const layer1 = document.querySelector('.bg-layer-1');
        const layer2 = document.querySelector('.bg-layer-2');
        const centralMountain = document.querySelector('.bg-central-mountain');
        const layer3 = document.querySelector('.bg-layer-3');

        if (layer1) {
            // ✅ Fundo: move devagar (5% máximo)
            layer1.style.transform = `translateY(${movePercent * 0.05}%)`;
        }

        if (layer2) {
            // ✅ Meio: move médio (15% máximo)
            layer2.style.transform = `translateY(${movePercent * 0.15}%)`;
        }

        if (centralMountain) {
            // ✅ Montanha Central: move devagar (10% máximo)
            centralMountain.style.transform = `translateX(-50%) translateY(${movePercent * 0.10}%)`;
        }

        if (layer3) {
            // ✅ Frente: move médio (25% máximo - 50% total)
            layer3.style.transform = `translateY(${movePercent * 0.25}%)`;
        }

        console.log(`🎬 Parallax: progresso ${Math.round(progress * 100)}%, máx 25% (50% total)`);
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

            <!-- ✅ Contador de Cristais (canto superior direito) -->
            <div id="crystal-counter" class="crystal-counter">
                💎 x <span id="crystal-count">0</span>/${this.totalSteps}
            </div>
        `;

        container.insertAdjacentHTML('beforeend', mechanicHTML);
    },
    
    // Gerar 9 degraus físicos (para 8 questões + chegada)
    generateFloors: function() {
        console.log('🏭️ Gerando 9 degraus físicos (janela móvel de 3)...');

        // ✅ Array de antagonistas (progressão de dificuldade)
        const antagonistas = ['🦇', '🕷️', '🐍', '🦂', '🐺', '🦉', '🐉', '👹', '😈'];

        let floorsHTML = '';

        // Criar 9 degraus (numerados de 1 a 9)
        for (let i = 9; i >= 1; i--) {
            const isTop = i === 9;
            const antagonist = antagonistas[i - 1]; // Array é 0-indexed

            floorsHTML += `
                <div class="floor" data-floor="${i}">
                    <div class="floor-platform ${isTop ? 'top' : ''}">
                        <span class="floor-label">FASE ${i}</span>
                        ${isTop ? '<span class="victory-flag">🚩</span>' : ''}
                    </div>

                    <!-- ✅ Cristal (centro, sobre a plataforma) -->
                    <div class="crystal" data-floor="${i}">💎</div>

                    <!-- ✅ Antagonista (à direita) -->
                    <div class="antagonist" data-floor="${i}">${antagonist}</div>
                </div>
            `;
        }

        console.log('✅ 9 degraus físicos gerados (1-9) com cristais e antagonistas');
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

            /* ✅ Fallback: Cor final do céu (preenche espaço branco quando imagens acabam) */
            .bg-sky-fallback {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #1A1F3A; /* Noite profunda (última cor do céu) */
                z-index: 0; /* Mais atrás que tudo */
            }

            /* Camadas de parallax */
            .bg-layer {
                position: absolute;
                top: -25%; /* ✅ Começa 25% ACIMA para cobrir topo e ter buffer para parallax */
                left: 0;
                width: 100%;
                height: 150%; /* ✅ 50% extra para buffer de parallax */
                background-size: cover;
                background-position: center top; /* ✅ Alinha pelo topo */
                transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1);
                will-change: transform; /* GPU acceleration */
            }

            /* Z-index de cada camada */
            .bg-layer-1 { z-index: 1; } /* Fundo (mais longe) */
            .bg-layer-2 { z-index: 2; } /* Meio */
            /* ✅ Montanha Central Gigante - MARROM, base LARGA (formato original) */
            .bg-central-mountain {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                width: 400px; /* Base larga */
                height: 300vh; /* MUITO alta - 3x a altura da tela! */
                z-index: 1; /* ✅ ATRÁS de tudo (mesmo nível do céu) */
                background: linear-gradient(to bottom,
                    #8B4513 0%,    /* ✅ Saddle brown (topo escuro) */
                    #A0522D 50%,   /* ✅ Sienna (meio) */
                    #D2691E 100%   /* ✅ Chocolate (base clara) */
                );
                /* ✅ FORMATO ORIGINAL: Base larga, afinando até o pico */
                clip-path: polygon(
                    50% 0%,        /* Pico no topo (centro) */
                    35% 20%,       /* Começando a alargar */
                    25% 40%,       /* Mais largo */
                    15% 60%,       /* Ainda mais largo */
                    5% 80%,        /* Quase base */
                    0% 100%,       /* Base esquerda */
                    100% 100%,     /* Base direita */
                    95% 80%,       /* Subindo direita */
                    85% 60%,
                    75% 40%,
                    65% 20%        /* Afinando até o pico */
                );
                opacity: 0.75;
                box-shadow: inset 0 0 100px rgba(0,0,0,0.3); /* Sombreamento interno */
                transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1);
                will-change: transform;
            }

            /* SVG de textura sobre a montanha */
            .mountain-texture {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                opacity: 0.6; /* Linhas sutis */
            }

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
            
            /* Montanha - CONTAINER LIVRE (sem centralização) */
            .mountain {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                width: 100%;
                pointer-events: none;
            }

            /* Floor - POSIÇÃO ABSOLUTA COM TRANSIÇÃO */
            .floor {
                position: absolute;
                width: 80px; /* Largura reduzida em 60% (200px → 80px) */
                height: 40px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.6s ease, visibility 0.6s ease;
                z-index: 100; /* ✅ NA FRENTE de tudo (montanha=4, backgrounds=1-3) */
            }

            /* ✅ JANELA MÓVEL: 3 degraus com 25% de diferença cada
               Grupos: [1,2,3], [4,5,6], [7,8,9]
               Posições: 12.5% (inferior), 37.5% (meio), 62.5% (superior) */

            /* Grupo 1: floors 1, 2, 3 */
            .floor[data-floor="1"] { bottom: 12.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="2"] { bottom: 37.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="3"] { bottom: 62.5%; left: 50%; transform: translateX(-50%); }

            /* Grupo 2: floors 4, 5, 6 (mesmas posições do grupo 1) */
            .floor[data-floor="4"] { bottom: 12.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="5"] { bottom: 37.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="6"] { bottom: 62.5%; left: 50%; transform: translateX(-50%); }

            /* Grupo 3: floors 7, 8, 9 (mesmas posições) */
            .floor[data-floor="7"] { bottom: 12.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="8"] { bottom: 37.5%; left: 50%; transform: translateX(-50%); }
            .floor[data-floor="9"] { bottom: 62.5%; left: 50%; transform: translateX(-50%); }

            /* ✅ INTRO MODE: Mostra TODOS os 9 degraus simultaneamente (câmera intro) */
            .mountain.intro-mode {
                transform-origin: center center;
                scale: 0.525; /* Zoom out 50% maior que 0.35 para não ficar muito pequeno */
            }

            /* No intro mode, todos os degraus ficam visíveis e espaçados verticalmente */
            .mountain.intro-mode .floor {
                opacity: 1 !important;
                visibility: visible !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
            }

            /* Posicionamento vertical no intro mode (200px entre cada) */
            .mountain.intro-mode .floor[data-floor="1"] { bottom: 0px; }
            .mountain.intro-mode .floor[data-floor="2"] { bottom: 200px; }
            .mountain.intro-mode .floor[data-floor="3"] { bottom: 400px; }
            .mountain.intro-mode .floor[data-floor="4"] { bottom: 600px; }
            .mountain.intro-mode .floor[data-floor="5"] { bottom: 800px; }
            .mountain.intro-mode .floor[data-floor="6"] { bottom: 1000px; }
            .mountain.intro-mode .floor[data-floor="7"] { bottom: 1200px; }
            .mountain.intro-mode .floor[data-floor="8"] { bottom: 1400px; }
            .mountain.intro-mode .floor[data-floor="9"] { bottom: 1600px; }

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
            
            /* Lume escalador - COM TRANSIÇÃO HORIZONTAL + OPACITY */
            .lume-climber {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                font-size: 3rem;
                filter: drop-shadow(0 0 20px #fff8dc);
                transition: bottom 1s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                            left 1s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                            opacity 0.6s ease,
                            transform 0.3s ease;
                z-index: 101;
                pointer-events: none;
                opacity: 1;
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

            /* Animação de pulo ao reaparecer (truque de mágica) */
            @keyframes jumpIn {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(100px) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-20px) scale(1.1);
                }
                100% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                }
            }

            .lume-climber.jumping-in {
                animation: jumpIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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

            /* ===== DECORAÇÕES (Nuvens + Pássaros) ===== */
            .escalada-decorations {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5; /* Entre backgrounds (z-index 1-3) e plataformas (z-index 100) */
                overflow: hidden;
            }

            /* Nuvens flutuantes */
            .cloud {
                position: absolute;
                opacity: 0.7;
                animation: floatSlow ease-in-out infinite;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }

            .cloud-1 {
                top: 10%;
                left: -10%;
                width: 120px;
                animation: floatAcrossHorizontal 25s linear infinite;
            }

            .cloud-2 {
                top: 30%;
                right: -10%;
                width: 80px;
                animation: floatAcrossHorizontalReverse 20s linear infinite;
            }

            .cloud-3 {
                top: 60%;
                left: -10%;
                width: 100px;
                animation: floatAcrossHorizontal 30s linear infinite;
                animation-delay: -10s;
            }

            @keyframes floatAcrossHorizontal {
                0% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(20vw) translateY(-10px); }
                50% { transform: translateX(50vw) translateY(0); }
                75% { transform: translateX(80vw) translateY(10px); }
                100% { transform: translateX(110vw) translateY(0); }
            }

            @keyframes floatAcrossHorizontalReverse {
                0% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(-20vw) translateY(10px); }
                50% { transform: translateX(-50vw) translateY(0); }
                75% { transform: translateX(-80vw) translateY(-10px); }
                100% { transform: translateX(-110vw) translateY(0); }
            }

            /* Pássaros voando */
            .bird {
                position: absolute;
                width: 60px;
                height: auto;
                opacity: 0.9;
                filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
            }

            .bird-eagle {
                top: 20%;
                left: -10%;
            }

            .bird-cardinal {
                top: 45%;
                right: -10%;
            }

            .bird-bluejay {
                top: 70%;
                left: -10%;
            }

            @keyframes flyAcross {
                0% { transform: translateX(0) translateY(0) scaleX(1); }
                48% { transform: translateX(110vw) translateY(-20px) scaleX(1); }
                50% { transform: translateX(110vw) translateY(-20px) scaleX(-1); }
                98% { transform: translateX(0) translateY(0) scaleX(-1); }
                100% { transform: translateX(0) translateY(0) scaleX(1); }
            }

            /* ===== CRISTAIS (Centralizados sobre cada degrau) ===== */
            .crystal {
                position: absolute;
                left: 50%;
                bottom: 50px; /* Acima da plataforma */
                transform: translateX(-50%);
                font-size: 2.5rem;
                z-index: 103; /* Acima de tudo (foco visual) */
                pointer-events: none;
                filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
                animation: spin 2s linear infinite, glow 1.5s ease-in-out infinite;
            }

            /* Animação: Girar 360° */
            @keyframes spin {
                0% { transform: translateX(-50%) rotate(0deg); }
                100% { transform: translateX(-50%) rotate(360deg); }
            }

            /* Animação: Brilho pulsante */
            @keyframes glow {
                0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
                50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1)); }
            }

            /* ✅ Animação: Giro rápido durante coleta (com scale 6) */
            @keyframes collectSpin {
                0% { transform: translateX(-50%) scale(6) rotate(0deg); }
                100% { transform: translateX(-50%) scale(6) rotate(360deg); }
            }

            /* ===== ANTAGONISTAS (À direita de cada degrau) ===== */
            .antagonist {
                position: absolute;
                left: calc(50% + 80px); /* 80px à direita do centro */
                bottom: 50px; /* Mesma altura do cristal */
                transform: translateX(-50%);
                font-size: 2.5rem;
                z-index: 102; /* Atrás do cristal */
                pointer-events: none;
                animation: levitate 2s ease-in-out infinite;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            }

            /* Animação: Levitação suave */
            @keyframes levitate {
                0%, 100% { transform: translateX(-50%) translateY(0px); }
                50% { transform: translateX(-50%) translateY(-12px); }
            }

            /* ===== CONTADOR DE CRISTAIS (Canto superior direito) ===== */
            .crystal-counter {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999; /* Acima de tudo */
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                font-size: 1.5rem;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                backdrop-filter: blur(5px);
                transition: transform 0.3s ease;
            }

            /* Animação pulse ao coletar */
            .crystal-counter.pulse {
                animation: counterPulse 0.3s ease;
            }

            @keyframes counterPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }

            /* Responsivo - Cristais e antagonistas menores em mobile */
            @media (max-width: 768px) {
                .crystal {
                    font-size: 1.8rem;
                    bottom: 40px;
                }

                .antagonist {
                    font-size: 1.8rem;
                    bottom: 40px;
                    left: calc(50% + 60px);
                }

                .crystal-counter {
                    font-size: 1.2rem;
                    padding: 8px 16px;
                    top: 15px;
                    right: 15px;
                }
            }

            /* ===== UMBRA - CORUJA ANTAGONISTA (REMOVIDA - substituída por emoji) ===== */

            /* Container da coruja - posicionada relativa à plataforma */
            .owl-container {
                position: absolute;
                z-index: 102;
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.6s ease, visibility 0.6s ease;
            }

            /* Coruja visível apenas quando floor 2 está ativo */
            .owl-container.visible {
                opacity: 1;
                visibility: visible;
            }

            /* Posicionar sobre a plataforma 2 (centro) */
            .owl-container[data-floor="2"] {
                left: 50%;
                bottom: 50%;
                transform: translateX(-50%) translateY(calc(50% + 100px));
            }

            /* Estrutura da coruja */
            .owl {
                position: relative;
                width: 80px;
                height: 100px;
                animation: levitate 2s ease-in-out infinite;
            }

            /* Animação de levitação */
            @keyframes levitate {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }

            /* Corpo da coruja */
            .owl .body {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 70px;
                background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5);
                z-index: 1;
            }

            /* Cabeça da coruja */
            .owl .head {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 70px;
                height: 60px;
                background: linear-gradient(135deg, #3a3a3a 0%, #2c2c2c 100%);
                border-radius: 50% 50% 40% 40%;
                box-shadow: 0 5px 15px rgba(0,0,0,0.4);
                z-index: 2;
            }

            /* Olhos da coruja */
            .owl .eye {
                position: absolute;
                top: 25px;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ffd700 0%, #ff8c00 100%);
                border-radius: 50%;
                box-shadow:
                    0 0 10px rgba(255, 215, 0, 0.6),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3);
                z-index: 3;
            }

            .owl .eye.left {
                left: 15px;
            }

            .owl .eye.right {
                right: 15px;
            }

            /* Pupila */
            .owl .pupil {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: #000;
                border-radius: 50%;
                animation: blink 4s ease-in-out infinite;
            }

            /* Animação de piscar */
            @keyframes blink {
                0%, 45%, 55%, 100% { opacity: 1; transform: translate(-50%, -50%) scaleY(1); }
                50% { opacity: 0; transform: translate(-50%, -50%) scaleY(0.1); }
            }

            /* Bico */
            .owl .beak {
                position: absolute;
                top: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid #ff8c00;
                z-index: 3;
                filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
            }

            /* Asas */
            .owl .wing {
                position: absolute;
                top: 30px;
                width: 30px;
                height: 50px;
                background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                border-radius: 50% 0 50% 50%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                z-index: 0;
            }

            .owl .wing.left {
                left: -15px;
                transform-origin: right center;
                animation: flapLeft 0.6s ease-in-out infinite;
            }

            .owl .wing.right {
                right: -15px;
                transform-origin: left center;
                transform: scaleX(-1);
                animation: flapRight 0.6s ease-in-out infinite;
            }

            /* Animações de bater asas */
            @keyframes flapLeft {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(-30deg); }
            }

            @keyframes flapRight {
                0%, 100% { transform: scaleX(-1) rotate(-10deg); }
                50% { transform: scaleX(-1) rotate(-30deg); }
            }

            /* Cauda */
            .owl .tail {
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 20px;
                background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                border-radius: 0 0 50% 50%;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                z-index: 0;
            }

            /* Tufos de penas (orelhas) */
            .owl .tuft {
                position: absolute;
                top: 5px;
                width: 15px;
                height: 25px;
                background: linear-gradient(135deg, #3a3a3a 0%, #2c2c2c 100%);
                border-radius: 50% 50% 0 0;
                z-index: 2;
            }

            .owl .tuft.left {
                left: 5px;
                transform: rotate(-15deg);
            }

            .owl .tuft.right {
                right: 5px;
                transform: rotate(15deg);
            }

            /* Responsivo - ajustar tamanho da coruja em telas menores */
            @media (max-width: 768px) {
                .owl {
                    width: 60px;
                    height: 75px;
                }

                .owl .body {
                    width: 45px;
                    height: 52px;
                }

                .owl .head {
                    width: 52px;
                    height: 45px;
                }

                .owl .eye {
                    width: 15px;
                    height: 15px;
                }

                .owl .wing {
                    width: 22px;
                    height: 37px;
                }
            }
        `;

        document.head.appendChild(style);
    },
    
    // ✅ NOVO: Atualizar posição do Lume - À ESQUERDA do degrau (25% entre cada)
    updatePosition: function() {
        const lume = document.getElementById('lume-climber');
        if (!lume) return;

        // ✅ NOVO: Lume SEMPRE à esquerda do degrau
        const horizontalPosition = 'calc(50% - 80px)'; // 80px à esquerda do centro

        // ✅ JANELA MÓVEL: Calcular posição dentro do grupo atual
        // Posição dentro do grupo (0=inferior, 1=meio, 2=superior)
        const positionInGroup = this.currentStep % 3;

        let targetBottom;
        let positionName;

        if (positionInGroup === 0) {
            // INFERIOR (12.5%)
            targetBottom = 'calc(12.5% + 40px)';
            positionName = 'INFERIOR';
        } else if (positionInGroup === 1) {
            // MEIO (37.5%)
            targetBottom = 'calc(37.5% + 40px)';
            positionName = 'MEIO';
        } else {
            // SUPERIOR (62.5%)
            targetBottom = 'calc(62.5% + 40px)';
            positionName = 'SUPERIOR';
        }

        // Posicionar Lume
        lume.style.bottom = targetBottom;
        lume.style.left = horizontalPosition;
        lume.style.transform = 'translateX(-50%)'; // Centralizar em relação à própria largura

        const currentFloor = this.currentStep + 1;
        console.log(`🏔️ Lume no degrau ${currentFloor} (${positionName}, à esquerda)`);
    },
    
    // Subir um andar (quando acerta)
    climb: function() {
        console.log('⬆️ climb() chamado. Andar atual:', this.currentStep, '/ Total:', this.totalSteps);

        if (this.currentStep >= this.totalSteps - 1) {
            console.log('🚫 Lume já está no topo! (andar', this.currentStep, '=', this.totalSteps - 1, ')');
            return;
        }

        const oldStep = this.currentStep;
        this.currentStep++;
        console.log('✅ Subindo para andar', this.currentStep);

        const lume = document.getElementById('lume-climber');

        // ✨ DETECTAR MUDANÇA DE GRUPO (3→4 ou 6→7) - "Truque de mágica"
        const isChangingGroup = (this.currentStep % 3 === 0) && (this.currentStep > 0);

        if (isChangingGroup) {
            console.log('🎩 MUDANÇA DE GRUPO! Aplicando truque de mágica...');

            // 1️⃣ Lume pula e SOME
            lume.classList.add('climbing');
            this.createParticles();

            setTimeout(() => {
                lume.style.opacity = '0';
                console.log('👻 Lume sumiu (pulou para nível invisível)');
            }, 300);

            // 2️⃣ Atualizar janela móvel e parallax ENQUANTO Lume está invisível
            setTimeout(() => {
                this.updateVisibleFloors();
                this.moveParallax();
                this.applySkyGraduation(this.currentStep);
                this.updateProgressBar();

                // Mostrar pássaros em checkpoints
                const progressPercent = (this.currentStep / (this.totalSteps - 1)) * 100;
                this.showBirdsAtProgress(progressPercent);

                console.log('🎬 Cenário mudou (novo grupo visível)');
            }, 500);

            // 3️⃣ Teleportar Lume para o degrau inferior do novo grupo (SEM transição)
            setTimeout(() => {
                lume.style.transition = 'none'; // Desativa transição
                lume.style.opacity = '0'; // Garantir invisibilidade
                this.updatePosition(); // Posiciona no degrau 4 ou 7
                console.log('📍 Lume teleportado para novo grupo (bottom: 10%)');

                // 4️⃣ REAPARECER PULANDO (animação jumpIn)
                setTimeout(() => {
                    lume.style.transition = 'bottom 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), left 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.6s ease, transform 0.3s ease';
                    lume.style.opacity = ''; // ✅ REMOVER inline style para permitir animação
                    lume.classList.remove('climbing');
                    lume.classList.add('jumping-in');
                    console.log('✨ Lume PULANDO para dentro! 🦘');

                    // Remover classe após animação
                    setTimeout(() => {
                        lume.classList.remove('jumping-in');
                    }, 600);
                }, 50);
            }, 800);

        } else {
            // ✅ TRANSIÇÃO NORMAL (dentro do mesmo grupo)
            console.log('➡️ Transição normal (mesmo grupo)');

            lume.classList.add('climbing');
            this.createParticles();
            this.updatePosition();
            this.updateVisibleFloors();
            this.moveParallax();
            this.applySkyGraduation(this.currentStep);
            this.updateProgressBar();

            // Mostrar pássaros em checkpoints
            const progressPercent = (this.currentStep / (this.totalSteps - 1)) * 100;
            this.showBirdsAtProgress(progressPercent);

            setTimeout(() => {
                lume.classList.remove('climbing');
            }, 1000);
        }

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

        // ✅ NOVO: Coletar cristal do degrau atual
        const currentFloor = this.currentStep + 1;
        this.collectCrystal(currentFloor);

        // Pequeno delay para animação (aguardar cristal começar a voar)
        setTimeout(() => {
            this.climb();
        }, 300);
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
        this.crystalsCollected = 0; // ✅ NOVO: Resetar cristais
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

        // ✅ Resetar barra de progresso
        this.updateProgressBar();

        // ✅ NOVO: Resetar contador de cristais
        this.updateCrystalCounter();

        console.log('🔄 Reset completo (checkpoints + elementos + parallax + barra + cristais)');
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
