/**
 * Teste de jogo LINEAR (sem mecânica visual)
 * Valida que o sistema funciona com mechanic: 'none'
 * Compatível com formato Bubble!
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

async function gerarJogoLinear() {
    console.log('🎮 Gerando jogo LINEAR (sem mecânica visual)...\n');
    
    const assembler = new GameAssembler();
    
    const config = {
        tema: 'Teste Linear - Sem Mecânica',
        descricao: 'Jogo linear sem escalada, compatível com Bubble!',
        mechanic: 'none',  // ← SEM MECÂNICA!
        fases: [
            // Fase 0: Boas-vindas (estático)
            {
                type: 'welcome',
                titulo: 'Bem-vindo!',
                mensagem: 'Jogo linear - sem mecânica visual!'
            },
            // Fase 1: Quiz
            {
                modalidade: 'quiz',
                dados: {
                    pergunta: '🧮 Quanto é 10 ÷ 2?',
                    alternativas: ['3', '4', '5', '6'],
                    correta: 2,
                    feedback_correto: '✅ Correto! 10 ÷ 2 = 5',
                    feedback_errado: '❌ Tente novamente.'
                }
            },
            // Fase 2: True-False
            {
                modalidade: 'true-false',
                dados: {
                    afirmacao: '🌍 A Terra é plana.',
                    correta: false,
                    feedback_correto: '✅ Correto! A Terra é redonda.',
                    feedback_errado: '❌ A Terra é redonda!'
                }
            },
            // Fase 3: Fill-Blanks
            {
                modalidade: 'fill-blanks',
                dados: {
                    frase: '☀️ O Sol nasce no ____.',
                    resposta: 'Leste',
                    feedback_correto: '✅ Excelente! Nasce no Leste!',
                    feedback_errado: '❌ Era Leste!'
                }
            },
            // Fase 4: Sequence
            {
                modalidade: 'sequence',
                dados: {
                    instrucao: '🔢 Ordene as estações do ano:',
                    itens: ['Verão', 'Inverno', 'Primavera', 'Outono'],
                    ordem_correta: ['Primavera', 'Verão', 'Outono', 'Inverno'],
                    feedback_correto: '✅ Perfeito! Ordem correta!',
                    feedback_errado: '❌ Veja a ordem correta.'
                }
            }
        ]
    };
    
    try {
        const outputPath = path.join(__dirname, 'jogo-linear-sem-mecanica.html');
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ ========== JOGO LINEAR GERADO! ==========');
        console.log('📁 Arquivo:', outputPath);
        console.log('\n🎯 VALIDAÇÕES A FAZER:');
        console.log('   ✓ Jogo funciona normalmente?');
        console.log('   ✓ NÃO aparece escalada (lado direito vazio)?');
        console.log('   ✓ Todas as modalidades funcionam?');
        console.log('   ✓ Tela de vitória aparece?');
        console.log('   ✓ Console sem erros de ESCALADA?');
        console.log('\n🚀 Para testar:');
        console.log('   open', outputPath);
        console.log('\n💡 ESTE FORMATO É COMPATÍVEL COM BUBBLE!');
        
    } catch (error) {
        console.error('\n❌ ERRO ao gerar jogo:', error.message);
        console.error(error.stack);
    }
}

// Executar
gerarJogoLinear();
