# ADR-001: Arquitetura de Modalidades - Tools vs Prompt

**Status:** 🟡 Em Decisão
**Data:** 2025-11-04
**Contexto:** Evolução do Game Designer para suportar 15+ modalidades
**Decisores:** Bruno Ferrari

---

## 📋 Contexto e Problema

### Situação Atual
O iAlume Factory evoluiu de um sistema monolítico (prompt único gerando HTML) para uma arquitetura modular:
- **Game Designer (Claude):** Gera JSON com decisões pedagógicas
- **Game Assembler (N8N):** Converte JSON → HTML
- **CDN (GitHub Pages):** Serve JS/CSS das modalidades

### Problema
Como escalar de 4 para 15+ modalidades sem causar:
- ❌ Timeout por prompt gigante
- ❌ Manutenção complexa
- ❌ Inconsistência de estrutura JSON

### Questão Central
**Onde definir a estrutura JSON de cada modalidade?**
1. No prompt (texto descritivo)
2. Em Tools (JSON Schema no N8N)
3. Híbrido

---

## 🔍 Análise Comparativa

### Opção A: Prompt Textual (atual)

```markdown
#### sequence
```json
{
  "text": "Coloque em ordem",
  "type": "sequence",
  "correct_order": ["A", "B", "C"],
  "feedback_correct": "...",
  "feedback_wrong": "..."
}
```
**CRÍTICO:** `correct_order` é OBRIGATÓRIO.
```

**Prós:**
- ✅ Setup simples (copiar/colar prompt)
- ✅ Debugging fácil (vê JSON direto)
- ✅ Claude tem flexibilidade criativa
- ✅ Fácil iterar e testar

**Contras:**
- ❌ Cresce ~10 linhas por modalidade
- ❌ Sem validação automática
- ❌ Manutenção manual de docs
- ❌ Limite ~10-12 modalidades antes de timeout

**Custos:**
| Modalidades | Linhas Prompt | Latência | Timeout? |
|-------------|---------------|----------|----------|
| 4 | ~350 | 3s | Não |
| 7 | ~420 | 3.5s | Não |
| 10 | ~500 | 4.5s | Raro |
| 15 | ~650 | 5.5s+ | Sim |

---

### Opção B: Tools (JSON Schema)

No N8N Agent → Tools → `create_game_config`:

```json
{
  "definitions": {
    "sequence_question": {
      "type": "object",
      "required": ["text", "type", "correct_order"],
      "properties": {
        "text": {"type": "string"},
        "type": {"const": "sequence"},
        "correct_order": {
          "type": "array",
          "items": {"type": "string"}
        },
        "feedback_correct": {"type": "string"},
        "feedback_wrong": {"type": "string"}
      }
    }
  }
}
```

**Prós:**
- ✅ Prompt sempre pequeno (~150 linhas)
- ✅ Validação automática (N8N rejeita JSON inválido)
- ✅ Escalabilidade infinita (15, 20, 50 modalidades)
- ✅ Separação clara: Prompt=pedagogia, Tool=estrutura
- ✅ Versionamento fácil (JSON schema)
- ✅ Reutilização entre agents

**Contras:**
- ❌ Setup inicial complexo
- ❌ Debugging mais difícil (erros de schema crípticos)
- ❌ Menos flexibilidade criativa (schema rígido)
- ❌ Curva de aprendizado (JSON Schema)
- ❌ N8N precisa suportar `oneOf` complexos

**Custos:**
| Modalidades | Linhas Prompt | Latência | Manutenção |
|-------------|---------------|----------|------------|
| 4 | ~150 | 3s | Fácil |
| 15 | ~150 | 3s | Fácil |
| 50 | ~150 | 3s | Fácil |

---

### Opção C: Híbrido (melhor de dois mundos)

**Core no Tool** (7 modalidades mais usadas):
- quiz, sequence, true-false, fill-blanks
- drag-drop, slider, matching

**Raras no Prompt** (texto simples):
- hotspot, timeline, puzzle, etc.

**Escape hatch:**
```json
{
  "type": "custom",
  "custom_data": {
    // JSON livre para experimentação
  }
}
```

**Prós:**
- ✅ Melhor dos dois mundos
- ✅ Prompt médio (~250 linhas)
- ✅ Validação nas principais
- ✅ Flexibilidade nas raras

**Contras:**
- ❌ Complexidade arquitetural maior
- ❌ Dois lugares para manter

---

## 📊 Trade-offs Críticos

| Aspecto | Prompt | Tools | Híbrido |
|---------|--------|-------|---------|
| **Escalabilidade** | ⚠️ Limitada (10 max) | ✅ Infinita | ✅ Alta (20+) |
| **Simplicidade** | ✅ Muito simples | ❌ Complexo | ⚠️ Médio |
| **Manutenção** | ⚠️ Manual | ✅ Estruturado | ✅ Bom |
| **Debugging** | ✅ Fácil | ❌ Difícil | ⚠️ Médio |
| **Flexibilidade** | ✅ Alta | ❌ Baixa | ✅ Boa |
| **Latência** | ⚠️ Cresce | ✅ Constante | ✅ Constante |
| **Validação** | ❌ Manual | ✅ Automática | ✅ Híbrida |

---

## 🎯 Decisão

### Recomendação por Fase

#### FASE 1 (Agora - MVP): **Prompt Textual**
**Modalidades:** 4-6 core
**Motivo:** Simplicidade, velocidade de iteração

```markdown
Implementar:
- quiz, sequence, true-false, fill-blanks
- drag-drop, slider

Total: 6 modalidades (~400 linhas prompt)
```

#### FASE 2 (Escala - v2.0): **Híbrido**
**Quando:** Precisar de 10+ modalidades
**Motivo:** Balancear escalabilidade e manutenibilidade

```markdown
Tool: 7 core modalidades
Prompt: 3-5 raras
Custom: escape hatch
```

#### FASE 3 (Maturidade - v3.0): **Tools Puro**
**Quando:** 15+ modalidades em produção
**Motivo:** Máxima escalabilidade

```markdown
Tool: Todas as 15+ modalidades
Prompt: Só pedagogia (~150 linhas)
```

---

## 🧪 Plano de Validação

### Teste Antes de Migrar para Tools

1. **Criar tool simples** com 2 modalidades
   ```bash
   # N8N Agent → Tools → Add Tool
   # Nome: test_modality_schema
   # Schema: quiz + sequence apenas
   ```

2. **Testar validação**
   - JSON correto → aceita?
   - JSON inválido → erro claro?
   - oneOf funciona?

3. **Medir latência**
   - Com prompt: __s
   - Com tool: __s
   - Diferença: __s

4. **Avaliar debugging**
   - Erro de campo faltando
   - Erro de tipo errado
   - Mensagem de erro compreensível?

### Critérios de Sucesso

- [ ] N8N aceita schema `oneOf` com múltiplas definitions
- [ ] Erros de validação são claros (não genéricos)
- [ ] Latência não aumenta
- [ ] Claude entende o schema e retorna correto
- [ ] Debugging é viável (não pior que prompt)

---

## 📚 Referências e Contexto

### Arquitetura Original (Monolítica)
**Arquivo:** `prompt-original-monolitico.md` (não versionado)
**Características:**
- Prompt ~3500 linhas
- Gerava HTML completo standalone
- 6 mechanics implementadas em CSS/JS inline
- Flexibilidade infinita (Claude inventava interações)
- **Problema:** Timeout frequente, manutenção impossível

### Arquitetura Atual (Modular)
```
┌─────────────┐     JSON      ┌──────────────┐     HTML     ┌─────────┐
│   Game      │───────────────▶│    Game      │─────────────▶│ Bubble  │
│  Designer   │    (config)    │  Assembler   │   (final)    │   DB    │
│  (Claude)   │                │    (N8N)     │              │         │
└─────────────┘                └──────────────┘              └─────────┘
                                      │
                                      │ load
                                      ▼
                               ┌─────────────┐
                               │  CDN Files  │
                               │  (GitHub)   │
                               │             │
                               │ base.js     │
                               │ engine.js   │
                               │ mechanics/* │
                               │ modalities/*│
                               └─────────────┘
```

### Arquivos Relacionados
- `/tools/assembly/n8n-game-assembler-FINAL.js` - Adapter atual
- `/tools/assembly/n8n-parse-gpt-output.js` - Parser JSON
- `/1.0.0/modalities/*.js` - Implementações CDN
- `/docs/guias/DEPLOY-FACIL.md` - Deploy do CDN

---

## 💡 Insights e Aprendizados

### Por que o prompt original era tão grande?

1. **Gerava HTML completo** (não JSON)
2. **CSS/JS inline** para cada mechanic
3. **Template completo** com exemplos
4. **Instruções detalhadas** de implementação
5. **Checklist extenso** de validação

**Total:** ~3500 linhas → timeout frequente

### O que mudou com a modularização?

✅ **Game Designer foca em pedagogia**
- Decisões: mechanic, modality, personagem, narrativa
- Output: JSON compacto (~100-200 linhas)
- Prompt: instruções pedagógicas (~350 linhas)

✅ **Game Assembler foca em construção**
- Input: JSON do Designer
- Output: HTML final com CDN scripts
- Lógica: Adapter pattern

✅ **CDN foca em experiência**
- Implementação: JS/CSS profissional
- Manutenção: Designers controlam visual
- Versioning: Semantic (1.0.0, 1.1.0, etc)

### Por que JSON Schema é difícil de debugar?

Erros típicos:
```
❌ "Schema validation failed at path: questions[0]"
   → Qual campo está errado? Não diz.

❌ "Expected type string, got number"
   → Qual campo? Não diz.

❌ "oneOf matched 0 schemas"
   → Qual definition esperava? Não diz.
```

vs Prompt textual:
```
✅ Vê o JSON completo retornado
✅ Identifica campo faltando visualmente
✅ Pode ajustar Claude com exemplo
```

---

## 🔮 Próximos Passos

### Ação Imediata
- [x] Documentar decisão (este ADR)
- [ ] Implementar prompt v4.0 com 6 modalidades
- [ ] Testar em produção por 1 semana
- [ ] Coletar métricas:
  - Taxa de sucesso (JSON válido)
  - Latência média
  - Timeout rate
  - Distribuição de modalidades escolhidas

### Experimento Paralelo (Baixa prioridade)
- [ ] Criar tool prototype com 2 modalidades
- [ ] Testar se N8N aceita schema oneOf
- [ ] Avaliar qualidade dos erros
- [ ] Decisão: continuar ou abandonar tools

### Se Tools funcionar bem
- [ ] Migrar para híbrido (7 core em tool)
- [ ] Manter raras no prompt
- [ ] Documentar padrão de manutenção

### Se Tools não funcionar
- [ ] Manter prompt textual
- [ ] Otimizar compactação (10-12 modalidades max)
- [ ] Aceitar limitação de escala

---

## 🏷️ Tags

#architecture #decision #tools #prompt-engineering #scalability #ialume-factory #game-designer #n8n #claude

---

## 📝 Notas Adicionais

### Observação sobre Flexibilidade Criativa

O prompt original permitia que Claude **inventasse interações no momento**:
- Régua interativa (arrastar handle)
- Pizza para frações (clicar fatias)
- Tangram (mover peças)
- Qualquer UI que imaginasse

Com JSON Schema, perdemos isso:
- Claude só pode usar modalidades pré-definidas
- Trade-off: Consistência vs Criatividade
- Escape hatch "custom" mitiga parcialmente

### Observação sobre Manutenção do CDN

Cada nova modalidade exige:
1. Implementar `/1.0.0/modalities/[nome].js`
2. Adicionar ao prompt OU tool schema
3. Adicionar case no Assembler

**Custo estimado:** 2-4h por modalidade
- 1h: Design da interação + HTML
- 1h: Lógica de validação
- 0.5h: CSS/animações
- 0.5h: Testes

### Observação sobre Versionamento

Se mudar estrutura de uma modalidade:
```
1.0.0/modalities/quiz.js  → schema antigo
2.0.0/modalities/quiz.js  → schema novo
```

Jogos antigos continuam funcionando!
CDN é imutável por versão.

---

**Última atualização:** 2025-11-04
**Próxima revisão:** Após 1 semana de testes com prompt v4.0
