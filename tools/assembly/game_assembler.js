/**
 * GAME ASSEMBLER - VERSÃO CORRIGIDA
 * Monta jogos HTML completos a partir de componentes modulares
 */

const fs = require('fs').promises;
const path = require('path');

class GameAssembler {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '../..');
        this.componentsPath = {
            base: path.join(this.projectRoot, 'base'),
            mechanics: path.join(this.projectRoot, 'mechanics'),
            modalities: path.join(this.projectRoot, 'modalities'),
            juice: path.join(this.projectRoot, 'juice')
        };
        
        console.log('📁 Project root:', this.projectRoot);
        console.log('📁 Components paths:', this.componentsPath);
    }

    /**
     * Monta um jogo completo a partir de uma configuração
     */
    async assembleGame(config) {
        console.log('\n🎮 ========== INICIANDO MONTAGEM ==========');
        console.log('Config:', JSON.stringify(config, null, 2));

        try {
            // 1. Carregar componentes base
            console.log('\n📦 Carregando componentes base...');
            const baseCSS = await this.loadBaseCSS();
            const baseJS = await this.loadBaseJS();

            // 2. Carregar mecânica
            console.log('\n🏔️ Carregando mecânica...');
            const mechanicJS = await this.loadMechanic(config.mechanic || 'escalada');

            // 3. Carregar modalidades necessárias
            console.log('\n🎯 Carregando modalidades...');
            const modalitiesJS = await this.loadModalities(config);

            // 4. Preparar dados do jogo
            const gameData = this.prepareGameData(config);

            // 5. Montar HTML final
            console.log('\n🔨 Montando HTML final...');
            const finalHTML = this.buildHTML({
                baseCSS,
                baseJS,
                mechanicJS,
                modalitiesJS,
                gameData,
                config
            });

            console.log('\n✅ ========== JOGO MONTADO COM SUCESSO! ==========\n');
            return finalHTML;

        } catch (error) {
            console.error('\n❌ ========== ERRO NA MONTAGEM ==========');
            console.error(error);
            throw error;
        }
    }

    /**
     * Template HTML padrão
     */
    getDefaultHTMLTemplate() {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lume - Jogo Educativo</title>
    <style>
        {CSS_PLACEHOLDER}
    </style>
</head>
<body>
    <div class="game-container">
        <!-- Header -->
        <div class="header">
            <h1 id="phase-title">BEM-VINDO!</h1>
        </div>

        <!-- Score -->
        <div class="score-container">
            <div class="score-item">
                Pontos: <span id="score">0</span>
            </div>
            <div class="score-item">
                Acertos: <span id="correct-count">0</span>
            </div>
        </div>

        <!-- Content Area -->
        <div id="content-area">
            <!-- Fase 0: Boas-vindas -->
            <div id="phase-0" class="phase active">
                <div class="lume-char">🌟</div>
                <div class="story-box">
                    <h1>{GAME_TITLE}</h1>
                    <p>{GAME_DESCRIPTION}</p>
                    <button class="btn btn-primary" onclick="startAdventure()">
                        COMEÇAR AVENTURA
                    </button>
                </div>
            </div>

            <!-- Fases dinâmicas -->
            {PHASES_PLACEHOLDER}
        </div>

        <!-- Feedback Zone -->
        <div id="feedback-zone"></div>
    </div>

    <script>
        {JS_PLACEHOLDER}
    </script>
</body>
</html>`;
    }

    /**
     * Carrega CSS base
     */
    async loadBaseCSS() {
        const cssPath = path.join(this.componentsPath.base, 'styles', 'base.css');
        console.log('   Loading CSS:', cssPath);
        const content = await fs.readFile(cssPath, 'utf-8');
        console.log('   ✅ CSS loaded:', content.length, 'chars');
        return content;
    }

    /**
     * Carrega scripts base
     */
    async loadBaseJS() {
        const scripts = ['base.js', 'game-engine.js', 'questoes.js'];
        let combinedJS = '';

        for (const script of scripts) {
            const scriptPath = path.join(this.componentsPath.base, 'scripts', script);
            console.log('   Loading:', scriptPath);
            
            try {
                const content = await fs.readFile(scriptPath, 'utf-8');
                combinedJS += `\n// ===== ${script} =====\n${content}\n`;
                console.log('   ✅', script, 'loaded:', content.length, 'chars');
            } catch (error) {
                console.warn('   ⚠️', script, 'not found, skipping...');
            }
        }

        return combinedJS;
    }

    /**
     * Carrega mecânica especificada
     */
    async loadMechanic(mechanicName) {
        const mechanicPath = path.join(this.componentsPath.mechanics, `${mechanicName}.js`);
        console.log('   Loading mechanic:', mechanicPath);
        
        try {
            const content = await fs.readFile(mechanicPath, 'utf-8');
            console.log('   ✅ Mechanic loaded:', content.length, 'chars');
            return content;
        } catch (error) {
            console.warn('   ⚠️ Mechanic not found:', mechanicName);
            return '// Mecânica não carregada';
        }
    }

    /**
     * Carrega TODAS as 4 modalidades (biblioteca completa)
     * Cada jogo usa apenas as que precisa, mas todas ficam disponíveis
     */
    async loadModalities(config) {
        // ✅ SEMPRE carregar todas as 4 modalidades
        const allModalities = ['quiz', 'true-false', 'fill-blanks', 'sequence'];
        
        console.log('   📚 Carregando biblioteca completa de modalidades...');

        let combinedJS = '';

        for (const modality of allModalities) {
            const modalityPath = path.join(this.componentsPath.modalities, `${modality}.js`);
            console.log('   Loading:', modalityPath);
            
            try {
                const content = await fs.readFile(modalityPath, 'utf-8');
                combinedJS += `\n// ===== ${modality}.js =====\n${content}\n`;
                console.log('   ✅', modality, 'loaded:', content.length, 'chars');
            } catch (error) {
                console.error(`   ❌ ERRO ao carregar ${modality}.js`);
                console.error('      Path:', modalityPath);
                console.error('      Error:', error.message);
            }
        }

        if (combinedJS === '') {
            console.error('   ❌ NENHUMA MODALIDADE CARREGADA!');
            throw new Error('Falha ao carregar modalidades');
        }
        
        console.log('   ✅ Biblioteca completa carregada: 4 modalidades disponíveis');

        return combinedJS;
    }

    /**
     * Prepara dados do jogo em formato JSON
     */
    prepareGameData(config) {
        return {
            tema: config.tema || 'Jogo Educativo',
            descricao: config.descricao || 'Complete as fases e ajude Lume a chegar ao topo!',
            mecanica: config.mechanic || 'escalada',
            fases: config.fases || []
        };
    }

    /**
     * Gera HTML das fases
     */
    generatePhasesHTML(config) {
        if (!config.fases || config.fases.length === 0) {
            return '';
        }

        let phasesHTML = '';

        config.fases.forEach((fase, index) => {
            const phaseNumber = index + 1;
            phasesHTML += `
            <!-- Fase ${phaseNumber} -->
            <div id="phase-${phaseNumber}" class="phase">
                <!-- Conteúdo será injetado dinamicamente pelo Game Engine -->
            </div>
            `;
        });

        return phasesHTML;
    }

    /**
     * Monta HTML final
     */
    buildHTML(components) {
        let html = this.getDefaultHTMLTemplate();

        // Substituir placeholders
        html = html.replace('{CSS_PLACEHOLDER}', components.baseCSS);
        html = html.replace('{GAME_TITLE}', components.gameData.tema);
        html = html.replace('{GAME_DESCRIPTION}', components.gameData.descricao);
        html = html.replace('{PHASES_PLACEHOLDER}', this.generatePhasesHTML(components.config));

        // Montar JavaScript na ORDEM CORRETA
        const allJS = `
            // ========== BASE SCRIPTS ==========
            ${components.baseJS}
            
            // ========== MECHANIC ==========
            ${components.mechanicJS}
            
            // ========== MODALITIES ==========
            ${components.modalitiesJS}
            
            // ========== GAME DATA ==========
            const GAME_CONFIG = ${JSON.stringify(components.gameData, null, 2)};
            
            // ========== INITIALIZATION ==========
            window.totalPhases = ${components.config.fases ? components.config.fases.length : 4};
            
            console.log('🎮 Inicializando jogo...');
            console.log('📊 Total de fases:', window.totalPhases);
            console.log('📋 Config:', GAME_CONFIG);
            
            // Aguardar DOM carregar
            window.addEventListener('DOMContentLoaded', function() {
                console.log('✅ DOM carregado!');
                
                // Verificar se Game Engine existe
                if (!window.GAME_ENGINE) {
                    console.error('❌ GAME_ENGINE não encontrado!');
                    alert('Erro: Game Engine não carregado!');
                    return;
                }
                
                // Verificar se modalidades existem
                console.log('Modalidades disponíveis:', {
                    QUIZ: typeof window.QUIZ,
                    TRUE_FALSE: typeof window.TRUE_FALSE,
                    FILL_BLANKS: typeof window.FILL_BLANKS,
                    SEQUENCE: typeof window.SEQUENCE
                });
                
                // Inicializar jogo
                console.log('🚀 Iniciando Game Engine...');
                GAME_ENGINE.init(GAME_CONFIG);
            });
        `;

        html = html.replace('{JS_PLACEHOLDER}', allJS);

        return html;
    }

    /**
     * Salva jogo montado em arquivo
     */
    async saveGame(html, outputPath) {
        await fs.writeFile(outputPath, html, 'utf-8');
        console.log(`\n💾 Jogo salvo em: ${outputPath}`);
        return outputPath;
    }

    /**
     * Monta e salva jogo completo
     */
    async assembleAndSave(config, outputPath) {
        const html = await this.assembleGame(config);
        await this.saveGame(html, outputPath);
        return outputPath;
    }
}

module.exports = GameAssembler;

// Exemplo de uso como script standalone
if (require.main === module) {
    const assembler = new GameAssembler();
    
    const exampleConfig = {
        tema: "Matemática Básica - TESTE",
        descricao: "Teste do assembler corrigido!",
        mechanic: "escalada",
        fases: [
            {
                modalidade: "quiz",
                dados: {
                    pergunta: "Quanto é 2 + 2?",
                    alternativas: ["3", "4", "5", "6"],
                    correta: 1,
                    feedback_correto: "Perfeito! 2 + 2 = 4",
                    feedback_errado: "Ops! Tente novamente."
                }
            }
        ]
    };

    const outputPath = path.join(__dirname, '../../tests/game-teste.html');
    
    assembler.assembleAndSave(exampleConfig, outputPath)
        .then(path => console.log('\n✅ Teste concluído! Abra:', path))
        .catch(err => console.error('\n❌ Erro:', err));
}
