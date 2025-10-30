/**
 * 🎮 GERADOR DE JOGO - MATEMÁTICA BÁSICA
 * Edite a configuração abaixo para criar diferentes jogos
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

// ========================================
// 📝 CONFIGURAÇÃO DO JOGO (EDITE AQUI!)
// ========================================

const config = {
    tema: 'Aventura Matemática',
    descricao: 'Ajude Lume a resolver os enigmas matemáticos!',
    mechanic: 'escalada',
    fases: [
        // Fase 0: Boas-vindas (sempre incluir)
        {
            type: 'welcome'
        },
        
        // Fase 1: Adição
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Quanto é 5 + 3?',
                alternativas: ['6', '7', '8', '9'],
                correta: 2,
                feedback_correto: '✅ Perfeito! 5 + 3 = 8',
                feedback_errado: '❌ Ops! Revise a adição.'
            }
        },
        
        // Fase 2: Subtração
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Quanto é 12 - 7?',
                alternativas: ['3', '4', '5', '6'],
                correta: 2,
                feedback_correto: '✅ Excelente! 12 - 7 = 5',
                feedback_errado: '❌ Quase! Tente novamente.'
            }
        },
        
        // Fase 3: Multiplicação
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Quanto é 4 × 5?',
                alternativas: ['15', '20', '25', '30'],
                correta: 1,
                feedback_correto: '✅ Muito bem! 4 × 5 = 20',
                feedback_errado: '❌ Revise a tabuada.'
            }
        }
    ]
};

// Nome do arquivo de saída
const outputFilename = 'matematica-basica.html';

// ========================================
// 🚀 GERAÇÃO (NÃO MEXA DAQUI PRA BAIXO)
// ========================================

async function gerar() {
    console.log('🎮 Gerando jogo:', config.tema);
    console.log('📊 Total de fases:', config.fases.length);
    
    const assembler = new GameAssembler();
    const outputPath = path.join(__dirname, outputFilename);
    
    try {
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ JOGO GERADO COM SUCESSO!');
        console.log('📁 Arquivo:', outputPath);
        console.log('\n🚀 Para abrir:');
        console.log('   open', outputPath);
        
    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
    }
}

gerar();
