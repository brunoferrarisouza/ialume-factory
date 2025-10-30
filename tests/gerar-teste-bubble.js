/**
 * 🧪 TESTE DE INTEGRAÇÃO BUBBLE
 * Gera jogo simples para testar se Bubble integration está funcionando
 */

const GameAssembler = require('../tools/assembly/game_assembler.js');
const path = require('path');

const config = {
    tema: '🧪 Teste Bubble Integration',
    descricao: 'Jogo simples para testar integração com Bubble',
    mechanic: 'none', // Sem mecânica visual (como será no Bubble)
    fases: [
        // Fase 1: Quiz simples
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Quanto é 2 + 2?',
                alternativas: ['3', '4', '5', '6'],
                correta: 1,
                feedback_correto: '✅ Correto!',
                feedback_errado: '❌ Tente novamente!'
            }
        },
        
        // Fase 2: Verdadeiro ou Falso
        {
            modalidade: 'true-false',
            dados: {
                afirmacao: 'O Brasil foi descoberto em 1500',
                correta: true,
                feedback_correto: '✅ Verdadeiro!',
                feedback_errado: '❌ Falso!'
            }
        },
        
        // Fase 3: Complete
        {
            modalidade: 'fill-blanks',
            dados: {
                texto: 'A capital do Brasil é ___',
                resposta: 'Brasília',
                feedback_correto: '✅ Isso mesmo!',
                feedback_errado: '❌ Tente de novo!'
            }
        }
    ]
};

async function gerar() {
    console.log('\n🧪 ========================================');
    console.log('   TESTE DE INTEGRAÇÃO BUBBLE');
    console.log('========================================\n');
    
    console.log('📋 Configuração:');
    console.log('   • Tema:', config.tema);
    console.log('   • Mecânica:', config.mechanic, '(linear)');
    console.log('   • Fases:', config.fases.length);
    console.log('   • Bubble: ATIVO (sempre)\n');
    
    const assembler = new GameAssembler();
    const outputPath = path.join(__dirname, 'teste-bubble.html');
    
    try {
        await assembler.assembleAndSave(config, outputPath);
        
        console.log('\n✅ ========================================');
        console.log('   JOGO GERADO COM SUCESSO!');
        console.log('========================================\n');
        console.log('📁 Arquivo:', outputPath);
        console.log('\n🧪 COMO TESTAR:\n');
        console.log('1. TESTE LOCAL (sem enviar dados):');
        console.log('   open', outputPath);
        console.log('   • Jogue até o final');
        console.log('   • Abra Console (Cmd+Option+J)');
        console.log('   • Veja logs de Bubble Integration');
        console.log('   • API Key é placeholder, NÃO envia\n');
        
        console.log('2. TESTE COM PARAMS (simula Bubble):');
        console.log('   open "' + outputPath + '?pagina_id=teste123&sessao_id=sessao456&aluno_id=bruno"\n');
        console.log('   • Console mostrará params lidos');
        console.log('   • Ainda não envia (API key placeholder)\n');
        
        console.log('3. TESTE REAL (com API key):');
        console.log('   • Edite base/scripts/bubble-integration.js');
        console.log('   • Substitua %%BUBBLE_API_KEY%% pela key real');
        console.log('   • Regenere o jogo');
        console.log('   • Abra com params');
        console.log('   • Dados serão enviados!\n');
        
        console.log('📋 CHECKLIST:');
        console.log('   [ ] Console mostra "bubble-integration.js carregado"');
        console.log('   [ ] Console mostra params da URL');
        console.log('   [ ] Ao terminar, mostra tela de vitória Bubble');
        console.log('   [ ] Botão VOLTAR funciona');
        console.log('   [ ] Auto-redirect após 10s');
        console.log('   [ ] Console mostra "Resultado (não enviado)" (se API key placeholder)\n');
        
    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error.stack);
    }
}

gerar();
