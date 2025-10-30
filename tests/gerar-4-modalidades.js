/**
 * Teste completo com TODAS as 4 modalidades
 * Valida que o sistema suporta: quiz, true-false, fill-blanks, sequence
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

async function gerarJogoCompleto() {
    console.log('🎮 Gerando jogo com TODAS as 4 modalidades...\n');
    
    const assembler = new GameAssembler();
    
    const config = {
        tema: 'Teste Completo - 4 Modalidades',
        descricao: 'Teste todas as modalidades do IAlume Factory!',
        mechanic: 'escalada',
        fases: [
            // Fase 0: Boas-vindas (estático)
            {
                type: 'welcome',
                titulo: 'Bem-vindo!',
                mensagem: 'Vamos testar todas as modalidades!'
            },
            // Fase 1: Quiz (múltipla escolha)
            {
                modalidade: 'quiz',
                dados: {
                    pergunta: '🧮 Quanto é 5 + 3?',
                    alternativas: ['6', '7', '8', '9'],
                    correta: 2,
                    feedback_correto: '✅ Perfeito! 5 + 3 = 8',
                    feedback_errado: '❌ Ops! Revise a adição.'
                }
            },
            // Fase 2: True-False (verdadeiro ou falso)
            {
                modalidade: 'true-false',
                dados: {
                    afirmacao: '🌍 O Brasil foi descoberto em 1500.',
                    correta: true,
                    feedback_correto: '✅ Correto! 1500 é a data oficial do descobrimento.',
                    feedback_errado: '❌ Na verdade, foi em 1500!'
                }
            },
            // Fase 3: Fill-Blanks (preencher lacunas)
            {
                modalidade: 'fill-blanks',
                dados: {
                    frase: '🏛️ A capital do Brasil é ____.',
                    resposta: 'Brasília',
                    feedback_correto: '✅ Excelente! Brasília é nossa capital!',
                    feedback_errado: '❌ Era Brasília!'
                }
            },
            // Fase 4: Sequence (ordenar sequência)
            {
                modalidade: 'sequence',
                dados: {
                    instrucao: '🔢 Ordene os números do menor ao maior:',
                    itens: ['10', '3', '7', '1'],
                    ordem_correta: ['1', '3', '7', '10'],
                    feedback_correto: '✅ Perfeito! Ordem crescente correta!',
                    feedback_errado: '❌ Veja a ordem correta.'
                }
            }
        ]
    };
    
    try {
        const outputPath = path.join(__dirname, 'jogo-4-modalidades.html');
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ ========== JOGO GERADO COM SUCESSO! ==========');
        console.log('📁 Arquivo:', outputPath);
        console.log('\n🎯 VALIDAÇÕES A FAZER:');
        console.log('   ✓ Fase 1: Quiz funciona?');
        console.log('   ✓ Fase 2: True-False funciona?');
        console.log('   ✓ Fase 3: Fill-Blanks funciona?');
        console.log('   ✓ Fase 4: Sequence funciona?');
        console.log('   ✓ Escalada sobe a cada acerto?');
        console.log('   ✓ Tela de vitória aparece?');
        console.log('\n🚀 Para testar:');
        console.log('   open', outputPath);
        
    } catch (error) {
        console.error('\n❌ ERRO ao gerar jogo:', error.message);
        console.error(error.stack);
    }
}

// Executar
gerarJogoCompleto();
