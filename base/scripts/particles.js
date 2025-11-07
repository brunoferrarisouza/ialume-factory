/**
 * PARTICLES.JS - Sistema de Partículas de Recompensa
 * Explosões douradas ao acertar respostas
 */

const PARTICLES = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrame: null,

    /**
     * Inicializar sistema de partículas
     */
    init: function() {
        // Criar canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        // Iniciar loop de animação
        this.animate();

        console.log('✨ Sistema de partículas inicializado!');
    },

    resize: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    /**
     * Criar explosão de partículas
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} count - Número de partículas
     */
    createExplosion: function(x, y, count = 60) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y));
        }
    },

    /**
     * Criar múltiplas explosões na tela
     */
    createMultipleExplosions: function() {
        const explosionPoints = [
            { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            { x: window.innerWidth / 4, y: window.innerHeight / 3 },
            { x: (3 * window.innerWidth) / 4, y: window.innerHeight / 3 },
            { x: window.innerWidth / 3, y: (2 * window.innerHeight) / 3 },
            { x: (2 * window.innerWidth) / 3, y: (2 * window.innerHeight) / 3 }
        ];

        explosionPoints.forEach((point, index) => {
            setTimeout(() => {
                this.createExplosion(point.x, point.y, 50);
            }, index * 80);
        });
    },

    /**
     * Loop de animação
     */
    animate: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Remover partículas mortas
        this.particles = this.particles.filter(particle => particle.isAlive());

        // Atualizar e desenhar partículas vivas
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    },

    /**
     * Destruir sistema (cleanup)
     */
    destroy: function() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }
};

/**
 * Classe Particle - Partícula individual
 */
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 15;
        this.speedY = (Math.random() - 0.5) * 15;
        this.gravity = 0.3;
        this.life = 100;
        this.maxLife = 100;

        // Cores douradas vibrantes
        const colors = [
            '#FFD700', // Dourado
            '#FFA500', // Laranja
            '#FFFF00', // Amarelo
            '#FFE55C', // Amarelo claro
            '#FFC125', // Dourado escuro
            '#FFEC8B'  // Amarelo pálido
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.glowSize = this.size * 3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.life -= 2;

        // Reduz tamanho gradualmente
        if (this.life < this.maxLife / 2) {
            this.size *= 0.97;
            this.glowSize *= 0.97;
        }
    }

    draw(ctx) {
        const opacity = this.life / this.maxLife;

        // Brilho externo
        ctx.save();
        ctx.globalAlpha = opacity * 0.3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Partícula principal
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isAlive() {
        return this.life > 0;
    }
}

// Expor globalmente
window.PARTICLES = PARTICLES;

console.log('✨ particles.js carregado!');
