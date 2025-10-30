/**
 * TESTE DO GAME ASSEMBLER
 * Testa a montagem de um jogo simples
 */

const GameAssembler = require('../tools/assembly/game_assembler');
const path = require('path');

async function testarAssembler() {
    console.log('🧪 Iniciando teste do Game Assembler...\n');

    const assembler = new GameAssembler();

    // Configuração de teste
    const config = {
        tema: "Teste de Matemática",
        descricao: "Teste do assembler com 2 questões!",
        mechanic: "escalada",
        fases: [
            {
                modalidade: "quiz",
                dados: {
                    pergunta: "Quanto é 2 + 2?",
                    alternativas: ["3", "4", "5", "6"],
                    correta: 1,
                    feedback_correto: "Correto! 2 + 2 = 4",
                    feedback_errado: "Ops! Tente novamente."
                }
            },
            {
                modalidade: "quiz",
                dados: {
                    pergunta: "Quanto é 10 - 5?",
                    alternativas: ["3", "4", "5", "6"],
                    correta: 2,
                    feedback_correto: "Isso! 10 - 5 = 5",
                    feedback_errado: "Revise a subtração!"
                }
            }
        ]
    };

    try {
        // Montar jogo
        const outputPath = path.join(__dirname, 'game-teste.html');
        await assembler.assembleAndSave(config, outputPath);

        console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
        console.log(`📁 Arquivo gerado: ${outputPath}`);
        console.log('\n💡 Abra o arquivo no navegador para testar!');

    } catch (error) {
        console.error('\n❌ TESTE FALHOU:', error.message);
        console.error(error);
    }
}

// Executar teste
testarAssembler();
