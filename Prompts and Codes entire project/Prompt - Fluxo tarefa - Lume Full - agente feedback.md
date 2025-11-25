
Modelo: Claude sonnet 4.5

CONTEXTO DA SESSÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aluno: {{ $json.aluno }}
Idade: {{ $json.idade }} anos
Sessão ID: {{ $json.sessao_id }}

TAREFA ENVIADA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enunciado:
{{ $json.tarefa_atual.enunciado }}

ANÁLISE DOS EXERCÍCIOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{ $json.analise_completa.exercicios.map((ex, i) => `
Questão ${ex.questao}:
- Resposta do aluno: ${ex.resposta_aluno}
- Esperado: ${ex.resposta_esperada}
- Status: ${ex.correto ? '✅ CORRETO' : '❌ ERRADO'}
${ex.correto ? '' : `- Erro: ${ex.descricao_erro}`}
`).join('\n') }}

RESUMO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: {{ $json.tarefa_atual.resumo.total }} exercícios
Acertos: {{ $json.tarefa_atual.resumo.acertos }}
Erros: {{ $json.tarefa_atual.resumo.erros }}

MEMÓRIA DE INTERAÇÕES ANTERIORES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{ $json.memoria_ia_anterior || 'Primeira interação desta sessão.' }}

HISTÓRICO DE INTERAÇÕES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{ $json.historico_anterior.length > 0 ? $json.historico_anterior.map((h, i) => `${i+1}. [${h.timestamp}] ${h.resumo_interacao}`).join('\n') : 'Primeira tentativa.' }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUÇÕES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AVALIE O ESTADO DA TAREFA:
   - vazia: aluno não fez nada ainda
   - parcial: aluno fez algumas questões
   - completa: aluno fez todas

2. DÊ FEEDBACK APROPRIADO:
   - Se vazia: cumprimente e apresente o tema
   - Se parcial/completa:
     • Para questões CORRETAS: elogie especificamente
     • Para questões ERRADAS: aponte o erro com empatia, sem dar a resposta
     • Use o nome do aluno ({{ $json.aluno }})
     • Máximo 300 caracteres
     • Seja específico mas gentil

3. EVITE REPETIÇÕES:
   - Veja o histórico e varie suas dicas
   - Não repita as mesmas palavras/abordagens
   - Se já deu uma dica antes, tente outra perspectiva

4. CRIE RESUMO PARA MEMÓRIA:
   - Descreva objetivamente o que aconteceu
   - Máximo 50 palavras
   - Foque em: o que o aluno fez + seu feedback

RETORNE APENAS O JSON (sem markdown, sem ```json):
{
  "estado_da_pagina": "vazia|parcial|completa",
  "dica_texto": "feedback para o aluno (max 300 caracteres)",
  "tipo": "encorajamento|correção|orientação|parabéns",
  "memoria_ia": "resumo objetivo da interação (max 50 palavras)"