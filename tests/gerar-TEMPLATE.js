/**
 * 🎮 TEMPLATE - GERADOR DE JOGO
 * 
 * COMO USAR:
 * 1. Copie este arquivo: cp gerar-TEMPLATE.js gerar-meu-jogo.js
 * 2. Edite a seção CONFIG abaixo
 * 3. Execute: node gerar-meu-jogo.js
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

// ========================================
// 📝 CONFIGURAÇÃO (EDITE AQUI!)
// ========================================

const config = {
    // Título do jogo
    tema: 'Meu Jogo Educativo',
    
    // Descrição que aparece na tela inicial
    descricao: 'Complete as fases e ajude Lume!',
    
    // Mecânica (sempre 'escalada' por enquanto)
    mechanic: 'escalada',
    
    // Lista de fases
    fases: [
        // ⚠️ SEMPRE incluir fase 0 (boas-vindas)
        {
            type: 'welcome'
        },
        
        // Adicione suas fases aqui!
        // Exemplo de quiz:
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Sua pergunta aqui?',
                alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
                correta: 0,  // Índice da resposta correta (0=A, 1=B, 2=C, 3=D)
                feedback_correto: '✅ Muito bem!',
                feedback_errado: '❌ Tente novamente!'
            }
        }
        
        // Adicione mais fases copiando o bloco acima
    ]
};

// Nome do arquivo que será gerado
const outputFilename = 'meu-jogo.html';

// ========================================
// 🚀 GERAÇÃO (NÃO MEXA AQUI!)
// ========================================

async function gerar() {
    console.log('🎮 Gerando jogo:', config.tema);
    console.log('📊 Fases:', config.fases.length - 1, 'questões + 1 boas-vindas');
    
    const assembler = new GameAssembler();
    const outputPath = path.join(__dirname, outputFilename);
    
    try {
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ SUCESSO!');
        console.log('📁', outputPath);
        console.log('\n🚀 Para abrir: open', outputPath);
        
    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error.stack);
    }
}

gerar();
