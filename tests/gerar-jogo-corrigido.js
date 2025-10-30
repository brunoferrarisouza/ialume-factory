/**
 * Script para gerar um jogo de teste com as correções aplicadas
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

async function gerarJogoTeste() {
    console.log('🎮 Gerando jogo de teste com correções...\n');
    
    const assembler = new GameAssembler();
    
    // Configuração do jogo de teste - FORMATO CORRETO
    const config = {
        tema: 'IAlume - Teste Corrigido',
        descricao: 'Teste o jogo com as correções aplicadas!',
        mechanic: 'escalada',
        fases: [
            // Fase 0: Boas-vindas (será ignorada pelo game-engine, conteúdo estático no HTML)
            {
                type: 'welcome',
                titulo: 'Bem-vindo!',
                mensagem: 'Teste o jogo com as correções aplicadas!'
            },
            // Fase 1: Quiz 1
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
            // Fase 2: Quiz 2
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
            // Fase 3: Quiz 3
            {
                modalidade: 'quiz',
                dados: {
                    pergunta: 'Quanto é 4 × 5?',
                    alternativas: ['15', '20', '25', '30'],
                    correta: 1,
                    feedback_correto: '✅ Muito bem! 4 × 5 = 20',
                    feedback_errado: '❌ Revise a tabuada.'
                }
            },
            // Fase 4: Quiz 4 - ADICIONADO!
            {
                modalidade: 'quiz',
                dados: {
                    pergunta: 'Quanto é 20 ÷ 4?',
                    alternativas: ['3', '4', '5', '6'],
                    correta: 2,
                    feedback_correto: '✅ Perfeito! 20 ÷ 4 = 5',
                    feedback_errado: '❌ Revise a divisão.'
                }
            }
        ]
    };
    
    try {
        // Montar o jogo
        const outputPath = path.join(__dirname, 'jogo-teste-CORRIGIDO.html');
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ ========== JOGO GERADO COM SUCESSO! ==========');
        console.log('📁 Arquivo:', outputPath);
        console.log('\n🚀 Para testar:');
        console.log('   open', outputPath);
        console.log('\nOu use:');
        console.log('   open -a "Google Chrome"', outputPath);
        
    } catch (error) {
        console.error('\n❌ ERRO ao gerar jogo:', error.message);
        console.error(error.stack);
    }
}

// Executar
gerarJogoTeste();
