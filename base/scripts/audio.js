/**
 * AUDIO.JS - Sistema de Áudio do Jogo
 * Gerencia música de fundo, efeitos sonoros e ambientes
 */

const AUDIO = {
    // Instâncias de áudio
    music: null,
    wind: null,
    coin: null,
    flight: null,
    question: null,

    // Estado
    initialized: false,
    musicStarted: false,
    windStarted: false,

    // Configurações de volume
    volumes: {
        music: 0.3,      // Música de fundo baixa
        wind: 0.2,       // Vento ambiente médio-baixo
        coin: 0.5,       // Moeda audível
        flight: 0.4,     // Voo audível mas não alto
        question: 0.4    // Nova pergunta
    },

    /**
     * Inicializar sistema de áudio
     * IMPORTANTE: Em iOS, áudio precisa ser iniciado por interação do usuário
     */
    init: function() {
        console.log('🎵 Inicializando sistema de áudio...');

        // Criar instâncias de áudio
        this.music = new Audio('../audio/musica-principal.mp3');
        this.wind = new Audio('../audio/som-vento.mp3');
        this.coin = new Audio('../audio/som-moeda.mp3');
        this.flight = new Audio('../audio/som-voo-lume.mp3');
        this.question = new Audio('../audio/som-nova-pergunta.mp3');

        // Configurar loops
        this.music.loop = true;
        this.wind.loop = true;

        // Configurar volumes
        this.music.volume = this.volumes.music;
        this.wind.volume = 0; // Começa em 0 para fade in
        this.coin.volume = this.volumes.coin;
        this.flight.volume = this.volumes.flight;
        this.question.volume = this.volumes.question;

        // Pré-carregar todos os áudios
        this.preloadAll();

        this.initialized = true;
        console.log('✅ Sistema de áudio inicializado!');
    },

    /**
     * Pré-carregar todos os áudios
     */
    preloadAll: function() {
        [this.music, this.wind, this.coin, this.flight, this.question].forEach(audio => {
            audio.load();
        });
        console.log('📦 Áudios pré-carregados');
    },

    /**
     * Iniciar música principal
     * Deve tocar desde o carregamento até o final
     */
    playMusic: function() {
        if (!this.initialized || this.musicStarted) return;

        console.log('🎵 Iniciando música principal...');

        this.music.play()
            .then(() => {
                this.musicStarted = true;
                console.log('✅ Música tocando!');
            })
            .catch(err => {
                console.warn('⚠️ Música bloqueada (iOS requer interação):', err.message);
            });
    },

    /**
     * Iniciar som do vento com fade in
     * Começa após o zoom da câmera (3s)
     */
    playWind: function() {
        if (!this.initialized || this.windStarted) return;

        console.log('💨 Iniciando som do vento com fade in...');

        this.wind.volume = 0;
        this.wind.play()
            .then(() => {
                this.windStarted = true;
                // Fade in de 2 segundos
                this.fadeIn(this.wind, this.volumes.wind, 2000);
                console.log('✅ Vento tocando!');
            })
            .catch(err => {
                console.warn('⚠️ Vento bloqueado:', err.message);
            });
    },

    /**
     * Tocar som da moeda (ao acertar)
     */
    playCoin: function() {
        if (!this.initialized) return;

        console.log('🪙 Tocando som da moeda...');

        // Resetar para início se já estiver tocando
        this.coin.currentTime = 0;

        this.coin.play()
            .catch(err => console.warn('⚠️ Erro ao tocar moeda:', err.message));
    },

    /**
     * Tocar som do voo (Lume subindo)
     * Com delay para não sobrepor a moeda
     */
    playFlight: function(delay = 300) {
        if (!this.initialized) return;

        console.log('🦅 Tocando som do voo (delay:', delay, 'ms)...');

        setTimeout(() => {
            // Resetar para início
            this.flight.currentTime = 0;

            this.flight.play()
                .catch(err => console.warn('⚠️ Erro ao tocar voo:', err.message));
        }, delay);
    },

    /**
     * Tocar som de nova pergunta
     */
    playQuestion: function() {
        if (!this.initialized) return;

        console.log('❓ Tocando som de nova pergunta...');

        // Resetar para início
        this.question.currentTime = 0;

        this.question.play()
            .catch(err => console.warn('⚠️ Erro ao tocar nova pergunta:', err.message));
    },

    /**
     * Fade in de volume
     * @param {HTMLAudioElement} audio - Elemento de áudio
     * @param {number} targetVolume - Volume alvo (0-1)
     * @param {number} duration - Duração em ms
     */
    fadeIn: function(audio, targetVolume, duration) {
        const steps = 50; // 50 passos
        const stepDuration = duration / steps;
        const volumeIncrement = targetVolume / steps;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(interval);
                audio.volume = targetVolume;
                console.log('✅ Fade in completo!');
            }
        }, stepDuration);
    },

    /**
     * Fade out de volume
     * @param {HTMLAudioElement} audio - Elemento de áudio
     * @param {number} duration - Duração em ms
     */
    fadeOut: function(audio, duration) {
        const steps = 50;
        const stepDuration = duration / steps;
        const startVolume = audio.volume;
        const volumeDecrement = startVolume / steps;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(startVolume - (volumeDecrement * currentStep), 0);

            if (currentStep >= steps) {
                clearInterval(interval);
                audio.volume = 0;
                audio.pause();
                console.log('✅ Fade out completo!');
            }
        }, stepDuration);
    },

    /**
     * Parar toda a música (usado na vitória)
     */
    stopAll: function() {
        console.log('⏹️ Parando todos os áudios...');

        if (this.music) this.fadeOut(this.music, 1000);
        if (this.wind) this.fadeOut(this.wind, 1000);
    },

    /**
     * Sequência completa ao acertar pergunta
     * Moeda → Voo (com delay para não sobrepor)
     */
    playCorrectSequence: function() {
        this.playCoin();
        this.playFlight(300); // 300ms de delay
    }
};

// Expor globalmente
window.AUDIO = AUDIO;

console.log('🎵 audio.js carregado!');
