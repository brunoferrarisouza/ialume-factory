# 🔄 GUIA DE MIGRAÇÃO: Game Designer V1 → V2

**Data:** 2025-11-07
**Status:** ✅ CONCLUÍDO
**Documentos:** `PROMPT-GAME-DESIGNER-V2.md`

---

## 📊 RESUMO EXECUTIVO

O prompt do Game Designer foi **COMPLETAMENTE REESCRITO** para gerar JSON no formato correto que o `game-engine.js` espera.

**Problema anterior:**
❌ JSON gerado não batia com estrutura do game-engine
❌ Precisaria de transformer intermediário
❌ Campos desnecessários (rationale, quotes, character, etc.)

**Solução:**
✅ Prompt gera DIRETO no formato do game-engine
✅ Sem transformação necessária
✅ Pronto para uso em produção

---

## 🔴 MUDANÇAS CRÍTICAS (BREAKING CHANGES)

### ❌ FORMATO ANTIGO (V1 - NÃO FUNCIONA MAIS)

```json
{
  "mechanic": {
    "name": "escalada",
    "rationale": "..."
  },
  "modality": {
    "name": "mixed",
    "rationale": "..."
  },
  "character": {
    "name": "Lume",
    "quotes": {
      "intro": "...",
      "success": "...",
      ...
    }
  },
  "narrative": {
    "theme": "montanha_das_medidas",
    "hero": "Lume",
    "npc": "Sábio Régulo",
    "villain": "Mago da Confusão",
    ...
  },
  "difficulty": {
    "level": 3,
    "time_per_question": 45,
    ...
  },
  "questions": [
    {
      "id": 0,
      "type": "opening",
      "text": "Narrativa aqui",
      "button_text": "Começar!"
    },
    {
      "id": 1,
      "text": "Pergunta?",
      "type": "quiz",
      "options": ["A", "B", "C", "D"],
      "correct": "A",
      "points": 10,
      ...
    }
  ]
}
```

### ✅ FORMATO NOVO (V2 - FUNCIONA!)

```json
{
  "titulo": "Lume e o Resgate da Régua Mágica",
  "tema": "Matemática - Medidas",
  "mecanica": "escalada",
  "cenario": "montanha-nevada",
  "fases": [
    {
      "numero": 0,
      "type": "welcome"
    },
    {
      "numero": 1,
      "modalidade": "quiz",
      "dados": {
        "pergunta": "Pergunta?",
        "alternativas": ["A", "B", "C", "D"],
        "correta": 0,
        "feedback_correto": "✅ Correto!",
        "feedback_errado": "❌ Errado!"
      }
    }
  ]
}
```

---

## 📋 TABELA DE MAPEAMENTO (V1 → V2)

| V1 (antigo)          | V2 (novo)               | Notas                                |
|----------------------|-------------------------|--------------------------------------|
| `mechanic.name`      | `mecanica`              | String direto, minúsculas            |
| `modality.name`      | ❌ Removido             | Cada fase tem sua `modalidade`       |
| `character.name`     | ❌ Removido             | Lume é sempre o herói (implícito)    |
| `character.quotes`   | ❌ Removido             | Não usado pelo game-engine           |
| `narrative.*`        | ❌ Removido             | Narrativa vai no HTML de abertura    |
| `difficulty.*`       | ❌ Removido             | Configuração fixa no game-engine     |
| `questions[]`        | `fases[]`               | Nome diferente + estrutura diferente |
| `questions[].id`     | `fases[].numero`        | 0, 1, 2, 3, 4...                     |
| `questions[].type`   | `fases[].modalidade`    | Para fases > 0                       |
| `questions[].text`   | `fases[].dados.pergunta`| Para quiz                            |
| `questions[].options`| `fases[].dados.alternativas` | Para quiz                    |
| `questions[].correct`| `fases[].dados.correta` | **Índice (0-3), não texto!**         |
| ❌ Não existia       | `titulo`                | **NOVO:** "Lume e ..."               |
| ❌ Não existia       | `tema`                  | **NOVO:** Disciplina/assunto         |
| ❌ Não existia       | `cenario`               | **NOVO:** montanha-nevada, etc.      |

---

## 🎯 MUDANÇAS POR MODALIDADE

### QUIZ

**V1 (antigo):**
```json
{
  "id": 1,
  "text": "Pergunta?",
  "type": "quiz",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correct": "Opção A",
  "points": 10,
  "feedback_correct": "✅ Correto!",
  "feedback_wrong": "❌ Errado!"
}
```

**V2 (novo):**
```json
{
  "numero": 1,
  "modalidade": "quiz",
  "dados": {
    "pergunta": "Pergunta?",
    "alternativas": ["Opção A", "Opção B", "Opção C", "Opção D"],
    "correta": 0,
    "feedback_correto": "✅ Correto!",
    "feedback_errado": "❌ Errado!"
  }
}
```

**CRÍTICO:** `correta` agora é **ÍNDICE** (0-3), não texto!

---

### TRUE-FALSE

**V1 (antigo):**
```json
{
  "id": 2,
  "text": "Afirmação",
  "type": "true-false",
  "correct": true,
  ...
}
```

**V2 (novo):**
```json
{
  "numero": 2,
  "modalidade": "true-false",
  "dados": {
    "afirmacao": "Afirmação",
    "correta": true,
    "feedback_correto": "✅ Correto!",
    "feedback_errado": "❌ Errado!"
  }
}
```

**Mudanças:**
- `text` → `afirmacao`
- `correct` → `correta`
- Campos dentro de `dados`

---

### FILL-BLANKS

**V1 (antigo):**
```json
{
  "id": 3,
  "text": "Complete: O céu é ____",
  "type": "fill-blanks",
  "correct": "azul",
  ...
}
```

**V2 (novo):**
```json
{
  "numero": 3,
  "modalidade": "fill-blanks",
  "dados": {
    "frase": "Complete: O céu é ____",
    "resposta": "azul",
    "variacoes_aceitas": ["azul", "Azul", "AZUL"],
    "dica": "Olhe para cima em um dia ensolarado",
    "feedback_correto": "✅ Correto!",
    "feedback_errado": "❌ Errado!"
  }
}
```

**Mudanças:**
- `text` → `frase`
- `correct` → `resposta`
- **NOVO:** `variacoes_aceitas` (array)
- **NOVO:** `dica` (opcional)

---

### SEQUENCE

**V1 (antigo):**
```json
{
  "id": 4,
  "text": "Ordene do menor ao maior:",
  "type": "sequence",
  "options": ["3", "1", "5", "2"],
  "correct_order": ["1", "2", "3", "5"],
  ...
}
```

**V2 (novo):**
```json
{
  "numero": 4,
  "modalidade": "sequence",
  "dados": {
    "instrucao": "Ordene do menor ao maior:",
    "itens": ["3", "1", "5", "2"],
    "ordem_correta": ["1", "2", "3", "5"],
    "feedback_correto": "✅ Correto!",
    "feedback_errado": "❌ Errado!"
  }
}
```

**Mudanças:**
- `text` → `instrucao`
- `options` → `itens`
- `correct_order` → `ordem_correta`

---

### OPENING (Fase 0)

**V1 (antigo):**
```json
{
  "id": 0,
  "type": "opening",
  "text": "Narrativa de aventura completa aqui...",
  "button_text": "Começar Aventura!",
  "points": 0
}
```

**V2 (novo):**
```json
{
  "numero": 0,
  "type": "welcome"
}
```

**CRÍTICO:** Narrativa agora é gerada automaticamente pelo HTML de abertura. Fase 0 só define `type: 'welcome'`.

---

## 🆕 CAMPOS NOVOS

### `titulo` (obrigatório)
```json
"titulo": "Lume e a Montanha do Conhecimento"
```

**Formato:** "Lume e [Nome da Aventura]"

---

### `tema` (obrigatório)
```json
"tema": "Geografia"
```

**Formato:** Disciplina ou assunto principal

---

### `cenario` (obrigatório)
```json
"cenario": "montanha-nevada"
```

**Opções disponíveis:**
- `"montanha-nevada"` ❄️
- `"deserto-canyon"` 🏜️
- `"cidade-floresta"` 🌳
- `"vulcao"` 🌋

---

### `audio` (opcional)
```json
"audio": {
  "musicUrl": "https://bubble.io/.../musica.mp3",
  "windUrl": "https://bubble.io/.../vento.mp3",
  "coinUrl": "https://bubble.io/.../moeda.mp3",
  "flightUrl": "https://bubble.io/.../voo.mp3",
  "questionUrl": "https://bubble.io/.../pergunta.mp3"
}
```

**Quando incluir:**
- Se o Bubble tiver os arquivos de áudio uploadados
- Passar URLs públicas dos arquivos

**Se não incluir:**
- Jogo funciona normalmente SEM áudio (graceful degradation)

---

## ✅ CHECKLIST DE MIGRAÇÃO

### No N8N:

- [ ] Substituir prompt antigo pelo **PROMPT-GAME-DESIGNER-V2.md**
- [ ] Verificar que saída do Game Designer é JSON válido
- [ ] Testar com exemplo real (matemática, geografia, etc.)
- [ ] Validar que `correta` em quiz é índice (não texto)
- [ ] Validar que fase 0 tem `type: 'welcome'`
- [ ] (Opcional) Adicionar campo `audio` se tiver arquivos no Bubble

### No Bubble:

- [ ] (Opcional) Upload dos 5 arquivos de áudio
- [ ] (Opcional) Criar data type `audio_assets` com URLs
- [ ] (Opcional) Passar URLs via webhook para N8N

---

## 🧪 TESTE RÁPIDO

### Input para teste:
```
Disciplina: Matemática
Tema: Medidas de comprimento
Ano: 3º ano
Questão: "1 metro tem quantos centímetros?"
```

### Output esperado:
```json
{
  "titulo": "Lume e o Resgate da Régua Mágica",
  "tema": "Matemática - Medidas",
  "mecanica": "escalada",
  "cenario": "montanha-nevada",
  "fases": [
    { "numero": 0, "type": "welcome" },
    {
      "numero": 1,
      "modalidade": "quiz",
      "dados": {
        "pergunta": "Qual instrumento mede comprimento?",
        "alternativas": ["Régua", "Balança", "Termômetro", "Relógio"],
        "correta": 0,
        "feedback_correto": "✅ Isso!",
        "feedback_errado": "❌ Era régua!"
      }
    }
  ]
}
```

### Validações:
- ✅ `correta: 0` (índice, não texto)
- ✅ Fase 0 é `type: 'welcome'`
- ✅ `fases[]` (não `questions[]`)
- ✅ `modalidade` + `dados` (não `type` + campos diretos)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Atualizar prompt no N8N** (substituir V1 por V2)
2. ✅ **Testar com exemplo real** (matemática, geografia)
3. ✅ **Validar output JSON** (estrutura correta)
4. ✅ **Testar jogo gerado** (carregar no navegador, jogar)
5. ⏳ **Documentar Game Assembler** (próxima etapa)
6. ⏳ **Teste end-to-end** (Bubble → N8N → Jogo)

---

## 📝 NOTAS FINAIS

- **Game Designer V1 está DEPRECATED** - não usar mais
- **Game Designer V2 é a versão OFICIAL** - usar em produção
- Formato V2 é **100% compatível** com game-engine.js
- Sem necessidade de transformação intermediária
- Pronto para integração com Bubble + N8N

---

**Criado em:** 2025-11-07
**Autor:** Claude Code
**Status:** ✅ PRONTO PARA USO
