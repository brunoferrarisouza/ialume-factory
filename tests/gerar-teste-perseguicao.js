#!/usr/bin/env node
/**
 * 🏃‍♂️ GERADOR DE TESTE - MECÂNICA PERSEGUIÇÃO
 *
 * Este script usa o GameAssembler para gerar um jogo HTML completo testando:
 * 1. ✅ As 4 modalidades (quiz, true-false, fill-blanks, sequence)
 * 2. ✅ Mecânica da PERSEGUIÇÃO (Lume foge do dragão da ignorância)
 * 3. ✅ Integração com Bubble (bubble-integration.js)
 * 4. ✅ Sistema de callback central (onAnswerChecked)
 * 5. ✅ Tela final com pontuação
 */

const path = require('path');
const GameAssembler = require('../tools/assembly/game_assembler');

// Configuração do jogo de teste
const testGameConfig = {
    tema: "🏃‍♂️ Teste Perseguição - IAlume Factory",
    descricao: "Teste da mecânica de perseguição: Lume foge do dragão da ignorância!",
    mecanica: "perseguicao",
    fases: [
        // ========== FASE 0: BOAS-VINDAS ==========
        // Esta fase usa o conteúdo estático do HTML (não é injetada pelo Game Engine)
        // MAS precisa estar no array para que totalSteps seja calculado corretamente!
        {
            type: "welcome"
            // Sem modalidade nem dados - o Game Engine pula esta fase
        },

        // ========== FASE 1: QUIZ ==========
        {
            modalidade: "quiz",
            dados: {
                pergunta: "🏃‍♂️ Qual animal é mais rápido em terra?",
                alternativas: ["Leão", "Guepardo", "Cavalo", "Lobo"],
                correta: 1,
                feedback_correto: "✅ Isso! O guepardo é o mais rápido! 🐆",
                feedback_errado: "❌ O guepardo é o mais rápido em terra!"
            }
        },

        // ========== FASE 2: VERDADEIRO OU FALSO ==========
        {
            modalidade: "true-false",
            dados: {
                afirmacao: "🐉 Dragões existiram de verdade na pré-história.",
                correta: false,
                feedback_correto: "✅ Correto! Dragões são apenas lendas!",
                feedback_errado: "❌ Dragões são criaturas mitológicas, não reais!"
            }
        },

        // ========== FASE 3: PREENCHER LACUNAS ==========
        {
            modalidade: "fill-blanks",
            dados: {
                frase: "⚡ A velocidade da luz é aproximadamente ____ km/s.",
                resposta: "300000",
                variacoes_aceitas: ["300000", "300.000", "300 mil"],
                dica: "Um número bem grande!",
                feedback_correto: "✅ Perfeito! A luz viaja a 300.000 km/s!",
                feedback_errado: "❌ A velocidade da luz é 300.000 km/s."
            }
        },

        // ========== FASE 4: SEQUÊNCIA ==========
        {
            modalidade: "sequence",
            dados: {
                instrucao: "🏃‍♂️ Ordene estas ações de uma corrida:",
                itens: ["Chegada", "Partida", "Aceleração", "Respiração final"],
                ordem_correta: ["Partida", "Aceleração", "Respiração final", "Chegada"],
                feedback_correto: "✅ Excelente! Você escapou do dragão! 🎉",
                feedback_errado: "❌ A ordem correta é diferente!"
            }
        }
    ]
};

// Main
async function main() {
    console.log('\n🏃‍♂️ ========================================');
    console.log('   GERADOR DE TESTE - PERSEGUIÇÃO');
    console.log('========================================\n');

    console.log('📋 Configuração do jogo:');
    console.log('   - Tema:', testGameConfig.tema);
    console.log('   - Mecânica:', testGameConfig.mecanica);
    console.log('   - Total de fases no array:', testGameConfig.fases.length);
    console.log('   - Fases jogáveis:', testGameConfig.fases.length - 1, '(excluindo fase 0 - boas-vindas)');
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
    console.log('   ✅ Mecânica PERSEGUIÇÃO (Lume foge do dragão)');
    console.log('   ✅ Movimento horizontal (left CSS)');
    console.log('   ✅ Perigo avança ao errar');
    console.log('   ✅ Lume avança ao acertar');
    console.log('   ✅ Callback central onAnswerChecked()');
    console.log('   ✅ GAME_ENGINE.recordResult()');
    console.log('   ✅ Bubble integration (sendResultToBubble)');
    console.log('   ✅ Tela final com pontuação correta');

    try {
        // Criar assembler
        const assembler = new GameAssembler();

        // Definir caminho de saída
        const outputPath = path.join(__dirname, 'teste-perseguicao-assembler.html');

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
        console.log('   4. Observe a mecânica:');
        console.log('      - 🌟 Lume começa em 20% (esquerda)');
        console.log('      - 🐉 Dragão começa em 0%');
        console.log('      - ✅ Acertou → Lume avança 15%');
        console.log('      - ❌ Errou → Dragão avança 10%');
        console.log('      - 🏁 Meta: Lume chegar em 80% (zona segura)');
        console.log('   5. Verifique os logs no console:');
        console.log('      - "🎯 onAnswerChecked chamado"');
        console.log('      - "✅ Resultado registrado no Game Engine"');
        console.log('      - "🏃‍♂️ Acionando mecânica PERSEGUIÇÃO"');
        console.log('      - "🏃‍♂️ Posições - Lume: X% | Perigo: Y%"');
        console.log('   6. Na tela final, veja:');
        console.log('      - Pontos finais: 400 (se acertar tudo)');
        console.log('      - Acertos: 4');
        console.log('\n💡 Dica: Simule Bubble adicionando parâmetros na URL:');
        console.log('   ?pagina_id=test123&sessao_id=sess456&aluno_id=aluno789');
        console.log('\n🎮 Estratégia do jogo:');
        console.log('   - Acertar todas: Lume chega em 80% (4 × 15% = 60% + 20% inicial)');
        console.log('   - Errar muito: Dragão alcança Lume (game tension!)');
        console.log('   - Balance: Metáfora de "fugir da ignorância com conhecimento"');
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
