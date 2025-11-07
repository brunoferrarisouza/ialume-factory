#!/usr/bin/env node

/**
 * GERAR JOGO DE TESTE COM SUPABASE
 *
 * Usa o game_assembler_cdn.js para gerar um jogo que
 * busca assets automaticamente do Supabase
 */

const fs = require('fs');
const path = require('path');

// Importar game assembler LOCAL (usa arquivos locais em vez de CDN)
const { gerarJogoCompleto } = require('../tools/assembly/game_assembler_local');

// Config de teste (SIMPLES - só o essencial)
const config = {
  titulo: "Lume e a Montanha do Conhecimento",
  tema: "Geografia",
  mecanica: "escalada",
  cenario: "montanha-nevada",  // ← Supabase vai buscar assets deste cenário!

  fases: [
    {
      numero: 0,
      type: "welcome",
      narrativa: "🗺️ Lume descobriu que os segredos da Geografia estão escondidos no topo da Montanha do Conhecimento! Ajude Lume a escalar e desvendar os mistérios do mundo!",
      botao: "Começar Aventura!"
    },
    {
      numero: 1,
      modalidade: "quiz",
      dados: {
        pergunta: "Qual é o maior país do mundo?",
        alternativas: ["Rússia", "Canadá", "China", "EUA"],
        correta: 0,
        feedback_correto: "✅ Isso! A Rússia tem 17 milhões de km²!",
        feedback_errado: "❌ Era Rússia! É enorme!"
      }
    },
    {
      numero: 2,
      modalidade: "fill-blanks",
      dados: {
        frase: "A capital do Brasil é ____",
        resposta: "Brasília",
        variacoes_aceitas: ["Brasília", "brasilia", "Brasilia"],
        dica: "Cidade planejada no Centro-Oeste",
        feedback_correto: "✅ Perfeito! Brasília é a capital desde 1960!",
        feedback_errado: "❌ A capital do Brasil é Brasília!"
      }
    },
    {
      numero: 3,
      modalidade: "true-false",
      dados: {
        afirmacao: "O Rio Nilo está localizado no continente africano",
        correta: true,
        feedback_correto: "✅ Verdadeiro! O Nilo passa por 11 países da África!",
        feedback_errado: "❌ É verdadeiro! O Nilo fica na África."
      }
    },
    {
      numero: 4,
      modalidade: "sequence",
      dados: {
        instrucao: "Ordene os países por população (maior → menor):",
        itens: ["Japão", "China", "Índia"],
        ordem_correta: ["China", "Índia", "Japão"],
        feedback_correto: "✅ Ordem perfeita!",
        feedback_errado: "❌ Ordem: China, Índia, Japão"
      }
    }
  ]
};

console.log('🎮 Gerando jogo de teste com Supabase...\n');
console.log('📋 Config:');
console.log(`   Título: ${config.titulo}`);
console.log(`   Mecânica: ${config.mecanica}`);
console.log(`   Cenário: ${config.cenario} ← Assets virão do Supabase`);
console.log(`   Fases: ${config.fases.length}\n`);

// Gerar HTML
const html = gerarJogoCompleto(config);

// Salvar
const outputPath = path.join(__dirname, 'jogo-teste-supabase.html');
fs.writeFileSync(outputPath, html);

console.log('✅ Jogo gerado com sucesso!');
console.log(`📁 Arquivo: ${outputPath}\n`);

console.log('🎯 O que o jogo vai fazer ao carregar:');
console.log('   1. Carregar scripts do CDN');
console.log('   2. Buscar decorations do Supabase (cenário: montanha-nevada)');
console.log('   3. Buscar backgrounds do Supabase');
console.log('   4. Buscar áudios do Supabase');
console.log('   5. Inicializar jogo com tudo configurado\n');

console.log('🚀 Para testar:');
console.log('   open tests/jogo-teste-supabase.html\n');
