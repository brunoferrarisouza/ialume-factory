# 🛠️ Setup do Tool N8N - Game Designer

**Data:** 2025-11-04
**Status:** 🟢 Pronto para Implementação
**Fase:** 3 (Tools Puro)

---

## 📋 Objetivo

Configurar um Tool no N8N Agent (Claude AI) para validar automaticamente a estrutura JSON de jogos educacionais com **15 modalidades**.

---

## 🔧 Passo a Passo

### **1. Criar Agent no N8N**

1. Abrir n8n workflow
2. Adicionar node **"AI Agent"**
3. Configurar:
   - **Agent Type:** Tool Agent
   - **Model:** Claude Sonnet 3.5
   - **System Message:** (ver prompt abaixo)

---

### **2. Adicionar Tool ao Agent**

1. No Agent, clicar em **"Tools"** → **"Add Tool"**
2. Selecionar **"Code Tool"** (Custom Function)
3. Configurar:

**Nome do Tool:**
```
create_game_config
```

**Descrição:**
```
Creates a complete game configuration JSON with validated structure for educational games.
Use this tool to generate the final game JSON after analyzing the task and making pedagogical decisions.
The JSON must include: title, concept, mechanic, and 5 phases (1 opening + 4 pedagogical).
```

**Input Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["config"],
  "properties": {
    "config": {
      "$ref": "file://./n8n-tool-schema-modalidades.json"
    }
  }
}
```

**Código do Tool:**
```javascript
// Tool: create_game_config
// Valida e retorna configuração do jogo

const config = $input.first().json.config;

// Validação básica (N8N já valida pelo schema)
if (!config.titulo || !config.conceito || !config.mecanica || !config.fases) {
  throw new Error('Config incompleto. Faltam campos obrigatórios.');
}

if (config.fases.length !== 5) {
  throw new Error('Jogo deve ter exatamente 5 fases (1 abertura + 4 pedagógicas).');
}

// Verificar fase 0 é abertura
if (config.fases[0].tipo !== 'abertura') {
  throw new Error('Fase 0 deve ser tipo "abertura".');
}

// Verificar fases 1-4 têm Bloom
for (let i = 1; i <= 4; i++) {
  if (!config.fases[i].bloom) {
    throw new Error(`Fase ${i} deve ter campo "bloom".`);
  }
}

// Retornar config validado
return {
  json: {
    success: true,
    config: config,
    message: 'Game config criado e validado com sucesso!'
  }
};
```

---

### **3. Importar JSON Schema**

**Opção A: Upload Direto (se N8N suportar)**
- Fazer upload do arquivo `/tools/n8n-tool-schema-modalidades.json`

**Opção B: Copiar/Colar**
- Abrir `/tools/n8n-tool-schema-modalidades.json`
- Copiar todo o conteúdo
- Colar no campo "Schema" do Tool

**Opção C: Referência Externa**
- Hospedar schema em URL pública
- Referenciar via `$ref: "https://..."`

---

### **4. System Prompt do Agent**

```markdown
# Game Designer Agent - iAlume Factory

Você é um agente especializado em **design de jogos educacionais**.

## Sua Missão

Analisar tarefas pedagógicas e criar jogos interativos que seguem a **Taxonomia de Bloom**.

## O que você DEVE fazer

1. **Analisar** a tarefa escolar fornecida
2. **Identificar** o conceito pedagógico principal
3. **Escolher** a mecânica visual apropriada (1 de 10)
4. **Criar** 5 fases do jogo:
   - Fase 0: Abertura narrativa (engajamento emocional)
   - Fase 1: LEMBRAR (reconhecer, identificar)
   - Fase 2: ENTENDER (explicar, comparar)
   - Fase 3: APLICAR (usar, resolver)
   - Fase 4: CRIAR/AVALIAR (sintetizar, julgar)
5. **Selecionar** modalidades apropriadas para cada fase
6. **Gerar** feedbacks pedagógicos (não punitivos)
7. **Usar o Tool** `create_game_config` para retornar o JSON final

## Mecânicas Disponíveis (10)

1. **escalada** - Subir montanha (progressão linear)
2. **perseguicao** - Fugir de perigo (urgência)
3. **mergulho** - Descer oceano (exploração)
4. **construcao** - Construir peça por peça (acumulação)
5. **voo** - Voar no céu (liberdade)
6. **labirinto** - Navegar caminhos (escolhas)
7. **jardim** - Crescer plantas (cultivo)
8. **constelacao** - Conectar estrelas (padrões)
9. **rio** - Navegar barco (fluxo)
10. **tesouro** - Abrir baús (descoberta)

## Modalidades Disponíveis (15)

### Fase 1 - LEMBRAR
- **quiz** - Múltipla escolha (4 alternativas)
- **true-false** - Verdadeiro/Falso
- **memoria** - Jogo de memória (parear cartas)
- **clique** - Clicar em área correta

### Fase 2 - ENTENDER
- **input** - Digitar resposta curta
- **slider** - Estimar com barra deslizante
- **fill-blanks** - Completar lacunas
- **matching** - Conectar pares relacionados

### Fase 3 - APLICAR
- **sequence** - Ordenar sequência (drag & drop)
- **drag-drop** - Arrastar para zonas
- **escolha-porta** - Escolher caminho visual
- **desenho** - Desenhar no canvas

### Fase 4 - CRIAR/AVALIAR
- **construtor** - Compor elementos
- **classificacao** - Classificar em categorias
- **temporizador** - Quiz com tempo limite

## Regras Críticas

1. ✅ **SEMPRE** criar exatamente 5 fases
2. ✅ **SEMPRE** fase 0 = abertura (narrativa)
3. ✅ **SEMPRE** fases 1-4 seguem Bloom progressivo
4. ✅ **SEMPRE** usar modalidades apropriadas ao nível Bloom
5. ✅ **SEMPRE** criar narrativa contextualizada ao conceito
6. ✅ **SEMPRE** feedbacks são pedagógicos (não punitivos)
7. ✅ **SEMPRE** usar Tool `create_game_config` no final

## Exemplo de Uso

**Input:** Foto de tarefa sobre medidas

**Processo:**
1. Identifico conceito: "medidas"
2. Escolho mecânica: "escalada" (progressão clara)
3. Crio narrativa: "Lume e a Régua Mágica"
4. Desenho fases:
   - Fase 0: Abertura (botão)
   - Fase 1: Quiz sobre unidades (LEMBRAR)
   - Fase 2: Input de valores (ENTENDER)
   - Fase 3: Drag&drop classificação (APLICAR)
   - Fase 4: Construtor de sequência (CRIAR)
5. Uso Tool `create_game_config` com JSON completo

**Output:** Tool retorna config validado
```

---

## 🧪 Teste do Tool

### **Teste 1: Config Válido**

**Input para o Tool:**
```json
{
  "config": {
    "titulo": "Lume e a Régua Mágica",
    "conceito": "medidas",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura",
        "narrativa": "Sábio Régulo perdeu a Régua Mágica!",
        "botao": "Começar Aventura"
      },
      {
        "numero": 1,
        "tipo": "quiz",
        "bloom": "lembrar",
        "pergunta": "O que mede comprimento?",
        "alternativas": ["Régua", "Balança", "Termômetro", "Relógio"],
        "correta": 0,
        "feedback_correto": "✅ Correto!",
        "feedback_errado": "❌ Era a régua!"
      },
      {
        "numero": 2,
        "tipo": "input",
        "bloom": "entender",
        "pergunta": "Quantos cm tem 1 metro?",
        "resposta": "100",
        "feedback_correto": "✅ Perfeito!",
        "feedback_errado": "❌ 1m = 100cm"
      },
      {
        "numero": 3,
        "tipo": "drag-drop",
        "bloom": "aplicar",
        "instrucao": "Arraste para a zona correta:",
        "items": [
          {"id": "i1", "texto": "Régua", "zona_correta": "z1"}
        ],
        "zonas": [
          {"id": "z1", "nome": "Mede Comprimento", "cor": "#667eea"}
        ],
        "feedback_correto": "✅ Correto!",
        "feedback_errado": "❌ Tente novamente"
      },
      {
        "numero": 4,
        "tipo": "construtor",
        "bloom": "criar",
        "instrucao": "Monte a sequência:",
        "pecas_disponiveis": [
          {"id": "mm", "texto": "mm", "icone": "📏"},
          {"id": "cm", "texto": "cm", "icone": "📏"}
        ],
        "sequencia_correta": ["mm", "cm"],
        "feedback_correto": "✅ Perfeito!",
        "feedback_errado": "❌ Ordem errada"
      }
    ]
  }
}
```

**Output Esperado:**
```json
{
  "success": true,
  "config": { ... },
  "message": "Game config criado e validado com sucesso!"
}
```

---

### **Teste 2: Config Inválido (falta campo)**

**Input:**
```json
{
  "config": {
    "titulo": "Teste",
    "conceito": "matemática",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura"
        // FALTA "narrativa" e "botao"
      }
    ]
  }
}
```

**Output Esperado:**
```json
{
  "error": "Schema validation failed: Missing required property 'narrativa'"
}
```

---

## 📝 Checklist de Validação

Antes de deployar, verificar:

- [ ] JSON Schema está completo (15 modalidades)
- [ ] Tool `create_game_config` foi criado no N8N
- [ ] Schema foi importado/colado corretamente
- [ ] System Prompt do Agent está configurado
- [ ] Teste com config válido retorna success
- [ ] Teste com config inválido retorna erro claro
- [ ] Agent consegue chamar o Tool
- [ ] Workflow N8N recebe output do Tool

---

## 🚨 Troubleshooting

### **Erro: "oneOf matched 0 schemas"**

**Causa:** JSON da fase não corresponde a nenhuma modalidade definida

**Solução:**
1. Verificar se o `tipo` da fase está correto
2. Verificar se todos os campos obrigatórios estão presentes
3. Verificar se tipos de dados estão corretos (string vs number)

---

### **Erro: "Property X is not defined in schema"**

**Causa:** Campo extra não previsto no schema

**Solução:**
- Remover campo extra OU
- Adicionar campo ao schema se for necessário

---

### **Erro: "Tool timeout"**

**Causa:** Tool demorou muito (> 30s)

**Solução:**
- Simplificar lógica do Tool
- Schema validation já é feita automaticamente pelo N8N

---

## 📚 Referências

- **Schema JSON:** `/tools/n8n-tool-schema-modalidades.json`
- **Exemplo completo:** `/tools/exemplo-resposta-game-designer.json`
- **ADR-001:** `/docs/ADR-001-modalidades-tools-vs-prompt.md`
- **CLAUDE.md:** Seção "Modalidades de Interação"

---

## ✅ Próximos Passos

Após configurar o Tool:

1. Testar com tarefa real (foto de caderno)
2. Verificar se JSON retornado é válido
3. Passar JSON para Game Assembler
4. Gerar HTML do jogo
5. Testar jogo no navegador

---

**Última atualização:** 2025-11-04
**Responsável:** Bruno Ferrari
