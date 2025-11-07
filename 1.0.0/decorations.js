/**
 * DECORATIONS.JS - Sistema de Decorações Animadas
 *
 * Gerencia nuvens, pássaros e outros elementos animados que dão vida aos cenários
 *
 * Tipos de decorações:
 * - clouds: Nuvens flutuando horizontalmente
 * - birds: Pássaros voando em diagonal
 *
 * Tipos de animações:
 * - float-horizontal: Flutua da direita para esquerda
 * - fly-diagonal: Voa em diagonal (baixo-direita → alto-esquerda)
 * - drift: Deriva suavemente (lento)
 */

const DECORATIONS = {
    // Estado
    initialized: false,
    activeDecorations: [], // Decorações na tela
    spawnIntervals: {}, // Intervalos de spawn
    config: null,

    // Container
    container: null,

    /**
     * Inicializar sistema de decorações
     * @param {Array} decorationsConfig - Configuração das decorações do cenário
     */
    init: function(decorationsConfig = []) {
        console.log('🦅 Inicializando sistema de decorações...');

        if (!decorationsConfig || decorationsConfig.length === 0) {
            console.log('⚠️ Nenhuma decoração configurada para este cenário');
            return;
        }

        this.config = decorationsConfig;

        // Criar container
        this.createContainer();

        // Injetar CSS
        this.injectCSS();

        // Iniciar spawns
        this.startSpawning();

        this.initialized = true;
        console.log(`✅ Sistema de decorações inicializado com ${decorationsConfig.length} tipos`);
    },

    /**
     * Criar container para decorações
     */
    createContainer: function() {
        // Verificar se já existe
        if (document.getElementById('decorations-container')) {
            this.container = document.getElementById('decorations-container');
            return;
        }

        this.container = document.createElement('div');
        this.container.id = 'decorations-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
            overflow: hidden;
        `;

        document.body.appendChild(this.container);
    },

    /**
     * Iniciar spawn automático de todas as decorações
     */
    startSpawning: function() {
        this.config.forEach(decoration => {
            // Spawn imediato do primeiro
            this.spawnDecoration(decoration);

            // Spawn periódico
            const interval = setInterval(() => {
                this.spawnDecoration(decoration);
            }, decoration.spawn_frequency || 8000);

            this.spawnIntervals[decoration.decoration_name] = interval;
        });
    },

    /**
     * Spawn de uma decoração
     * @param {Object} decoration - Configuração da decoração
     */
    spawnDecoration: function(decoration) {
        const element = document.createElement('div');
        element.className = `decoration decoration-${decoration.decoration_type}`;
        element.style.cssText = this.getDecorationStyle(decoration);

        // Adicionar imagem
        const img = document.createElement('img');
        img.src = decoration.image_url;
        img.alt = decoration.decoration_name;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';

        element.appendChild(img);
        this.container.appendChild(element);

        // Adicionar à lista
        this.activeDecorations.push(element);

        // Aplicar animação
        this.applyAnimation(element, decoration);

        // Remover após animação
        const duration = this.getAnimationDuration(decoration);
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.activeDecorations = this.activeDecorations.filter(d => d !== element);
        }, duration);
    },

    /**
     * Obter estilo base da decoração
     */
    getDecorationStyle: function(decoration) {
        const baseSize = decoration.decoration_type === 'cloud' ? 150 : 80;
        const size = baseSize * (decoration.speed_multiplier || 1);

        // Posição inicial aleatória
        const topPercent = Math.random() * 60 + 10; // 10% a 70%

        return `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: ${topPercent}%;
            right: -${size + 50}px;
            opacity: 0.8;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        `;
    },

    /**
     * Aplicar animação à decoração
     */
    applyAnimation: function(element, decoration) {
        const duration = this.getAnimationDuration(decoration);
        const animationType = decoration.animation_type || 'float-horizontal';

        switch (animationType) {
            case 'float-horizontal':
                this.animateFloatHorizontal(element, duration);
                break;

            case 'fly-diagonal':
                this.animateFlyDiagonal(element, duration);
                break;

            case 'drift':
                this.animateDrift(element, duration);
                break;

            default:
                this.animateFloatHorizontal(element, duration);
        }
    },

    /**
     * Animação: Float Horizontal (nuvens)
     */
    animateFloatHorizontal: function(element, duration) {
        const screenWidth = window.innerWidth;
        const elementWidth = element.offsetWidth;
        const distance = screenWidth + elementWidth + 100;

        element.style.transition = `
            right ${duration}ms linear,
            transform ${duration}ms ease-in-out
        `;

        // Adicionar oscilação vertical sutil
        const oscillation = Math.random() * 20 - 10; // -10px a +10px

        requestAnimationFrame(() => {
            element.style.right = `${distance}px`;
            element.style.transform = `translateY(${oscillation}px)`;
        });
    },

    /**
     * Animação: Fly Diagonal (pássaros)
     */
    animateFlyDiagonal: function(element, duration) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;

        const startTop = parseFloat(element.style.top);
        const endTop = Math.max(0, startTop - screenHeight * 0.3); // Sobe 30% da tela

        element.style.transition = `
            right ${duration}ms linear,
            top ${duration}ms ease-in-out
        `;

        // Flip horizontal para pássaros voando para esquerda
        element.style.transform = 'scaleX(-1)';

        requestAnimationFrame(() => {
            element.style.right = `${screenWidth + elementWidth + 100}px`;
            element.style.top = `${endTop}%`;
        });
    },

    /**
     * Animação: Drift (deriva lenta)
     */
    animateDrift: function(element, duration) {
        const screenWidth = window.innerWidth;
        const elementWidth = element.offsetWidth;
        const distance = screenWidth + elementWidth + 100;

        element.style.transition = `
            right ${duration}ms ease-in-out,
            transform ${duration}ms ease-in-out
        `;

        // Oscilação vertical maior
        const oscillation = Math.random() * 40 - 20; // -20px a +20px

        requestAnimationFrame(() => {
            element.style.right = `${distance}px`;
            element.style.transform = `translateY(${oscillation}px) rotate(${Math.random() * 10 - 5}deg)`;
        });
    },

    /**
     * Calcular duração da animação baseada na velocidade
     */
    getAnimationDuration: function(decoration) {
        const baseSpeed = 12000; // 12 segundos para atravessar a tela
        const speedMultiplier = decoration.speed_multiplier || 1.0;

        return baseSpeed / speedMultiplier;
    },

    /**
     * Parar todos os spawns
     */
    stopSpawning: function() {
        Object.values(this.spawnIntervals).forEach(interval => {
            clearInterval(interval);
        });
        this.spawnIntervals = {};
        console.log('⏸️ Spawn de decorações pausado');
    },

    /**
     * Limpar todas as decorações da tela
     */
    clear: function() {
        this.stopSpawning();

        this.activeDecorations.forEach(decoration => {
            if (decoration.parentNode) {
                decoration.parentNode.removeChild(decoration);
            }
        });

        this.activeDecorations = [];

        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }

        this.initialized = false;
        console.log('🧹 Decorações limpas');
    },

    /**
     * Pausar animações (útil em pause de jogo)
     */
    pause: function() {
        this.stopSpawning();
        this.activeDecorations.forEach(decoration => {
            decoration.style.animationPlayState = 'paused';
        });
    },

    /**
     * Retomar animações
     */
    resume: function() {
        this.startSpawning();
        this.activeDecorations.forEach(decoration => {
            decoration.style.animationPlayState = 'running';
        });
    },

    /**
     * Injetar CSS para decorações
     */
    injectCSS: function() {
        if (document.getElementById('decorations-styles')) return;

        const style = document.createElement('style');
        style.id = 'decorations-styles';
        style.textContent = `
            /* Container de decorações */
            #decorations-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
                overflow: hidden;
            }

            /* Decoração base */
            .decoration {
                position: absolute;
                will-change: transform, right, top;
            }

            /* Nuvens */
            .decoration-cloud {
                opacity: 0.7;
            }

            /* Pássaros */
            .decoration-bird {
                opacity: 0.9;
            }

            /* Animações suaves */
            .decoration img {
                animation: float-subtle 3s ease-in-out infinite;
            }

            @keyframes float-subtle {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-5px);
                }
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .decoration-cloud {
                    width: 100px !important;
                    height: 100px !important;
                }

                .decoration-bird {
                    width: 60px !important;
                    height: 60px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Expor globalmente
window.DECORATIONS = DECORATIONS;

console.log('🦅 decorations.js carregado!');
