#!/usr/bin/env node
/**
 * 🎮 GERADOR DE TESTE COMPLETO
 *
 * Este script usa o GameAssembler para gerar um jogo HTML completo testando:
 * 1. ✅ As 4 modalidades (quiz, true-false, fill-blanks, sequence)
 * 2. ✅ Mecânica da escalada
 * 3. ✅ Integração com Bubble (bubble-integration.js)
 * 4. ✅ Sistema de callback central (onAnswerChecked)
 * 5. ✅ Tela final com pontuação
 */

const path = require('path');
const GameAssembler = require('../tools/assembly/game_assembler');

// Configuração do jogo de teste
const testGameConfig = {
    tema: "🧪 Teste Completo - IAlume Factory",
    descricao: "Teste integrado: 4 modalidades + escalada + Bubble + callback central",
    mechanic: "escalada",
    fases: [
        // ========== FASE 0: BOAS-VINDAS ==========
        // Esta fase usa o conteúdo estático do HTML (não é injetada pelo Game Engine)
        // MAS precisa estar no array para que totalSteps seja calculado corretamente!
        // totalSteps = fases.length = 5 → cria 5 andares (0, 1, 2, 3, 4)
        // Assim, 4 fases jogáveis → 4 subidas possíveis (0→1→2→3→4) ✅
        {
            type: "welcome"
            // Sem modalidade nem dados - o Game Engine pula esta fase
        },

        // ========== FASE 1: QUIZ ==========
        {
            modalidade: "quiz",
            dados: {
                pergunta: "🧮 Qual é o resultado de 7 × 8?",
                alternativas: ["54", "56", "63", "72"],
                correta: 1,
                feedback_correto: "✅ Perfeito! 7 × 8 = 56",
                feedback_errado: "❌ Ops! A resposta correta é 56."
            }
        },

        // ========== FASE 2: VERDADEIRO OU FALSO ==========
        {
            modalidade: "true-false",
            dados: {
                afirmacao: "🌍 A Terra gira ao redor do Sol.",
                correta: true,
                feedback_correto: "✅ Correto! A Terra orbita o Sol!",
                feedback_errado: "❌ Na verdade, isso é verdadeiro! A Terra orbita o Sol."
            }
        },

        // ========== FASE 3: PREENCHER LACUNAS ==========
        {
            modalidade: "fill-blanks",
            dados: {
                frase: "🦖 Os dinossauros viveram na Era ____.",
                resposta: "Mesozoica",
                variacoes_aceitas: ["mesozoica", "Mesozoica", "mesozóica", "Mesozóica"],
                dica: "Começou há cerca de 252 milhões de anos",
                feedback_correto: "✅ Isso mesmo! Era Mesozoica!",
                feedback_errado: "❌ A resposta correta é Mesozoica."
            }
        },

        // ========== FASE 4: SEQUÊNCIA ==========
        {
            modalidade: "sequence",
            dados: {
                instrucao: "🔢 Ordene os planetas do mais próximo ao mais distante do Sol:",
                itens: ["Saturno", "Terra", "Mercúrio", "Marte"],
                ordem_correta: ["Mercúrio", "Terra", "Marte", "Saturno"],
                feedback_correto: "✅ Perfeito! Ordem planetária correta!",
                feedback_errado: "❌ Ops! Veja a ordem correta dos planetas."
            }
        }
    ]
};

// Main
async function main() {
    console.log('\n🎮 ========================================');
    console.log('   GERADOR DE TESTE COMPLETO');
    console.log('========================================\n');

    console.log('📋 Configuração do jogo:');
    console.log('   - Tema:', testGameConfig.tema);
    console.log('   - Mecânica:', testGameConfig.mechanic);
    console.log('   - Total de fases no array:', testGameConfig.fases.length);
    console.log('   - Fases jogáveis:', testGameConfig.fases.length - 1, '(excluindo fase 0 - boas-vindas)');
    console.log('   - Andares na escalada:', testGameConfig.fases.length, '(0 a', testGameConfig.fases.length - 1 + ')');
    console.log('   - Modalidades usadas:');
    testGameConfig.fases.forEach((fase, i) => {
        if (fase.type === 'welcome') {
            console.log(`     ${i}. welcome (fase estática - boas-vindas)`);
        } else {
            console.log(`     ${i}. ${fase.modalidade}`);
        }
    });

    console.log('\n🔧 Recursos testados:');
    console.log('   ✅ 4 modalidades (quiz, true-false, fill-blanks, sequence)');
    console.log('   ✅ Mecânica escalada (Lume sobe montanha)');
    console.log('   ✅ Callback central onAnswerChecked()');
    console.log('   ✅ GAME_ENGINE.recordResult()');
    console.log('   ✅ Bubble integration (sendResultToBubble)');
    console.log('   ✅ Tela final com pontuação correta');

    try {
        // Criar assembler
        const assembler = new GameAssembler();

        // Definir caminho de saída
        const outputPath = path.join(__dirname, 'teste-completo-assembler.html');

        console.log('\n🏗️  Montando jogo...\n');

        // Montar e salvar jogo
        await assembler.assembleAndSave(testGameConfig, outputPath);

        console.log('\n✅ ========================================');
        console.log('   JOGO GERADO COM SUCESSO!');
        console.log('========================================\n');

        console.log('📂 Arquivo gerado:', outputPath);
        console.log('\n🧪 Como testar:');
        console.log('   1. Abra o arquivo no navegador');
        console.log('   2. Abra o Console (F12)');
        console.log('   3. Jogue as 4 fases');
        console.log('   4. Verifique os logs no console:');
        console.log('      - "🎯 onAnswerChecked chamado"');
        console.log('      - "✅ Resultado registrado no Game Engine"');
        console.log('      - "🏔️ Acionando mecânica ESCALADA"');
        console.log('   5. Na tela final, veja:');
        console.log('      - Pontos finais: 400 (se acertar tudo)');
        console.log('      - Acertos: 4');
        console.log('\n💡 Dica: Simule Bubble adicionando parâmetros na URL:');
        console.log('   ?pagina_id=test123&sessao_id=sess456&aluno_id=aluno789');
        console.log('');

    } catch (error) {
        console.error('\n❌ ========================================');
        console.error('   ERRO AO GERAR JOGO');
        console.error('========================================\n');
        console.error(error);
        process.exit(1);
    }
}

// Executar
main();
