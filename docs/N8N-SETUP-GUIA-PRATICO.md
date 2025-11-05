# 🚀 Guia Prático - Setup N8N Tool (Passo a Passo)

**Data:** 2025-11-04
**Tempo estimado:** 15-20 minutos
**Objetivo:** Configurar Game Designer Agent no N8N com validação automática

---

## 📋 Checklist Rápido

- [ ] N8N aberto e workflow criado
- [ ] API Key da Anthropic configurada
- [ ] AI Agent node adicionado
- [ ] Tool `create_game_config` criado
- [ ] JSON Schema importado
- [ ] System Prompt configurado
- [ ] Teste 1: Config válido funcionando
- [ ] Teste 2: Config inválido retornando erro
- [ ] Teste 3: Agent gerando jogo completo

---

## 🎯 PASSO 1: Criar AI Agent

### 1.1 Adicionar Node
1. Abrir n8n workflow
2. Clicar em **"+"** para adicionar node
3. Buscar **"AI Agent"**
4. Selecionar e adicionar ao workflow

### 1.2 Configurar Agent
- **Agent Type:** Tools Agent
- **Model:** Claude Sonnet 3.5 (Anthropic)
- **API Credentials:** [Configurar suas credenciais Anthropic]

### 1.3 System Message
Cole o texto abaixo no campo **System Message**:

```markdown
# Game Designer Agent - iAlume Factory

Você é um agente especializado em **design de jogos educacionais**.

## Sua Missão

Analisar tarefas pedagógicas e criar jogos interativos que seguem progressão de dificuldade natural.

## O que você DEVE fazer

1. **Analisar** a tarefa escolar fornecida
2. **Identificar** o conceito pedagógico principal
3. **Escolher** a mecânica visual apropriada (1 de 10)
4. **Criar** 5 fases do jogo:
   - Fase 0: Abertura narrativa (engajamento emocional)
   - Fase 1: Conceito inicial (fácil - reconhecimento)
   - Fase 2: Primeira variação (médio-fácil - compreensão)
   - Fase 3: Nova aplicação (médio-difícil - aplicação)
   - Fase 4: Desafio final (difícil - síntese)
5. **Selecionar** modalidades apropriadas para cada fase
6. **Gerar** feedbacks motivadores (não punitivos)
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

## Modalidades Disponíveis (4 - MVP)

### Fase 1 - Conceito Inicial (fácil)
- **quiz** - Múltipla escolha (4 alternativas)
- **true-false** - Verdadeiro/Falso

### Fase 2 - Primeira Variação (médio-fácil)
- **fill-blanks** - Completar lacunas
- **quiz** - Múltipla escolha

### Fase 3 - Nova Aplicação (médio-difícil)
- **sequence** - Ordenar sequência (drag & drop)
- **fill-blanks** - Completar lacunas

### Fase 4 - Desafio Final (difícil)
- **sequence** - Ordenar sequência
- **quiz** - Múltipla escolha (mais complexa)

## Regras Críticas

1. ✅ **SEMPRE** criar exatamente 5 fases
2. ✅ **SEMPRE** fase 0 = tipo "abertura"
3. ✅ **SEMPRE** fases 1-4 seguem progressão de dificuldade
4. ✅ **SEMPRE** usar modalidades apropriadas ao nível
5. ✅ **SEMPRE** criar narrativa de AVENTURA/DESAFIO (não didática)
6. ✅ **SEMPRE** feedbacks são motivadores (não punitivos)
7. ✅ **SEMPRE** usar Tool `create_game_config` no final
8. ❌ **NUNCA** mencionar termos como "lembrar", "entender", "aplicar"
9. ❌ **NUNCA** mencionar Taxonomia de Bloom
10. ❌ **NUNCA** tom professoral

## Tom da Narrativa

✅ BOM: "Lume precisa subir a montanha e recuperar a Régua Mágica! Enfrente 4 desafios!"
❌ RUIM: "Vamos aprender sobre medidas através de 4 exercícios pedagógicos."

✅ BOM: "A floresta está perdendo as cores! Ajude Lume a restaurá-las!"
❌ RUIM: "Nesta fase você irá LEMBRAR os conceitos de cores primárias."

## Exemplo de Uso

**Input:** Foto de tarefa sobre medidas

**Processo:**
1. Identifico conceito: "medidas"
2. Escolho mecânica: "escalada" (progressão clara)
3. Crio narrativa: "Lume e a Régua Mágica Perdida"
4. Desenho fases:
   - Fase 0: Abertura (botão)
   - Fase 1: Quiz sobre instrumentos (fácil)
   - Fase 2: Completar lacunas sobre conversões (médio)
   - Fase 3: Ordenar unidades (difícil)
   - Fase 4: Quiz situação prática (muito difícil)
5. Uso Tool `create_game_config` com JSON completo

**Output:** Tool retorna config validado
```

✅ **PASSO 1 COMPLETO** - System Message configurado

---

## 🛠️ PASSO 2: Adicionar Tool

### 2.1 Abrir Tools
No AI Agent node:
1. Clicar na aba **"Tools"**
2. Clicar em **"Add Tool"**
3. Selecionar **"Code Tool"** (Custom Function)

### 2.2 Configurar Tool

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

✅ **PASSO 2.1 COMPLETO** - Tool criado

---

## 📄 PASSO 3: Configurar Input Schema

No Tool `create_game_config`, configurar:

### 3.1 Input Schema (copie este JSON completo)

**⚠️ IMPORTANTE:** Cole o conteúdo do arquivo `/tools/n8n-tool-schema-modalidades.json` aqui.

Para facilitar, vou mostrar onde copiar:

1. Abrir arquivo: `/Users/brunoferrari.souza/Documents/ialume-factory/tools/n8n-tool-schema-modalidades.json`
2. Copiar TODO o conteúdo
3. Colar no campo **"Input Schema"** do Tool

**Campo Input Schema no N8N deve conter:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["config"],
  "properties": {
    "config": {
      "$ref": "#/definitions/game_config"
    }
  },
  "definitions": {
    "game_config": {
      "type": "object",
      "required": ["titulo", "conceito", "mecanica", "fases"],
      ...
    }
  }
}
```

**Tamanho esperado:** ~900 linhas de JSON

✅ **PASSO 3 COMPLETO** - Schema importado

---

## 💻 PASSO 4: Código do Tool

No Tool `create_game_config`, aba **"Code"**:

### 4.1 Cole este código JavaScript

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

// Verificar fases 1-4 existem
for (let i = 1; i <= 4; i++) {
  if (!config.fases[i]) {
    throw new Error(`Fase ${i} está faltando.`);
  }
}

// Retornar config validado
return {
  json: {
    success: true,
    config: config,
    message: 'Game config criado e validado com sucesso!',
    timestamp: new Date().toISOString()
  }
};
```

✅ **PASSO 4 COMPLETO** - Código do Tool configurado

---

## 🧪 PASSO 5: Testar Tool Diretamente

### 5.1 Teste 1: Config Válido

**Abrir Tool em modo teste:**
1. No Tool, clicar em **"Test"** ou **"Execute Node"**
2. Fornecer este input de teste:

```json
{
  "config": {
    "titulo": "Teste Básico",
    "conceito": "teste",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura",
        "narrativa": "Teste de abertura",
        "botao": "Começar"
      },
      {
        "numero": 1,
        "tipo": "quiz",
        "pergunta": "Teste?",
        "alternativas": ["A", "B", "C", "D"],
        "correta": 0,
        "feedback_correto": "✅ Correto!",
        "feedback_errado": "❌ Errado!"
      },
      {
        "numero": 2,
        "tipo": "true-false",
        "afirmacao": "Teste é verdadeiro",
        "correta": true,
        "feedback_correto": "✅ Sim!",
        "feedback_errado": "❌ Não!"
      },
      {
        "numero": 3,
        "tipo": "fill-blanks",
        "texto_com_lacunas": "Preencha ___",
        "respostas": ["teste"],
        "feedback_correto": "✅ Certo!",
        "feedback_errado": "❌ Errado!"
      },
      {
        "numero": 4,
        "tipo": "sequence",
        "instrucao": "Ordene:",
        "items": ["B", "A"],
        "ordem_correta": ["A", "B"],
        "feedback_correto": "✅ Perfeito!",
        "feedback_errado": "❌ Ordem errada!"
      }
    ]
  }
}
```

**Output esperado:**
```json
{
  "success": true,
  "config": { ... },
  "message": "Game config criado e validado com sucesso!",
  "timestamp": "2025-11-04T..."
}
```

✅ **Teste 1 passou?** → Prosseguir para Teste 2

---

### 5.2 Teste 2: Config Inválido (falta campo)

**Input de teste:**
```json
{
  "config": {
    "titulo": "Teste Erro",
    "conceito": "teste",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura"
        // FALTAM "narrativa" e "botao"
      }
    ]
  }
}
```

**Output esperado:**
```json
{
  "error": "Schema validation failed: Missing required property 'narrativa'"
}
```

OU erro similar indicando campo faltando.

✅ **Teste 2 retornou erro claro?** → Validação funcionando!

---

### 5.3 Teste 3: Config Inválido (número errado de fases)

**Input de teste:**
```json
{
  "config": {
    "titulo": "Teste Erro",
    "conceito": "teste",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura",
        "narrativa": "Teste",
        "botao": "OK"
      }
    ]
  }
}
```

**Output esperado:**
```
Error: Jogo deve ter exatamente 5 fases (1 abertura + 4 pedagógicas).
```

✅ **Teste 3 retornou erro?** → Tool funcionando perfeitamente!

---

## 🤖 PASSO 6: Testar Agent Completo

### 6.1 Configurar Input do Agent

Criar um input node antes do AI Agent com esta mensagem:

**Opção A: Texto simples**
```
Crie um jogo sobre medidas de comprimento (régua, metro, centímetro).
Conceito: medidas
Nível: 3º ano fundamental
```

**Opção B: Foto de tarefa (simulada)**
```
TAREFA ESCOLAR:

Assunto: Medidas de Comprimento

1. O que usamos para medir comprimento?
2. Quantos centímetros tem 1 metro?
3. Coloque em ordem do menor ao maior: metro, centímetro, quilômetro
4. Se um lápis tem 15cm e uma régua tem 30cm, qual é a diferença?
```

### 6.2 Executar Workflow

1. Salvar workflow
2. Clicar em **"Execute Workflow"**
3. Aguardar resposta do Agent (15-30s)

### 6.3 Verificar Output

**O Agent deve:**
1. ✅ Analisar a tarefa
2. ✅ Escolher mecânica (ex: escalada)
3. ✅ Criar narrativa (ex: "Lume e a Régua Mágica")
4. ✅ Desenhar 5 fases
5. ✅ Chamar Tool `create_game_config`
6. ✅ Retornar JSON validado

**Output esperado (exemplo):**
```json
{
  "success": true,
  "config": {
    "titulo": "Lume e a Régua Mágica Perdida",
    "conceito": "medidas",
    "mecanica": "escalada",
    "fases": [
      {
        "numero": 0,
        "tipo": "abertura",
        "narrativa": "Sábio Régulo perdeu sua Régua Mágica no topo da Montanha do Conhecimento!",
        "botao": "Começar Aventura"
      },
      {
        "numero": 1,
        "tipo": "quiz",
        "pergunta": "Qual instrumento usamos para medir comprimento?",
        "alternativas": ["Régua", "Balança", "Termômetro", "Relógio"],
        "correta": 0,
        "feedback_correto": "✅ Isso mesmo! A régua mede comprimento!",
        "feedback_errado": "❌ A balança mede peso, o termômetro mede temperatura. Para comprimento usamos régua!"
      },
      ...
    ]
  },
  "message": "Game config criado e validado com sucesso!"
}
```

✅ **Agent gerou JSON válido?** → SETUP COMPLETO!

---

## 🎯 Próximos Passos

Após setup completo:

### Opção A: Conectar ao Game Assembler
1. Adicionar node **"Function"** após AI Agent
2. Carregar código do Game Assembler
3. Gerar HTML do jogo
4. Salvar em Bubble ou arquivo

### Opção B: Testar com Tarefas Reais
1. Tirar foto de tarefa escolar real
2. Usar OCR para extrair texto
3. Enviar para Agent
4. Validar qualidade do jogo gerado

### Opção C: Refinar Prompts
1. Testar com múltiplos conceitos (matemática, português, ciências)
2. Ajustar System Message se necessário
3. Validar narrativas geradas
4. Garantir variedade de mecânicas

---

## 🐛 Troubleshooting

### Erro: "Tool timeout"
**Causa:** Tool demorou muito (> 30s)
**Solução:** Simplificar código JavaScript do Tool

### Erro: "oneOf matched 0 schemas"
**Causa:** JSON da fase não corresponde a nenhuma modalidade
**Solução:** Verificar campos obrigatórios de cada modalidade no schema

### Erro: "Agent não chama o Tool"
**Causa:** System Message não instrui claramente
**Solução:** Adicionar no System Message: "SEMPRE use o Tool create_game_config"

### Erro: "Schema validation failed"
**Causa:** Campo faltando ou tipo errado
**Solução:** Verificar schema e JSON gerado linha por linha

---

## 📊 Checklist Final

Antes de considerar setup completo:

- [ ] Tool `create_game_config` criado no N8N
- [ ] JSON Schema importado corretamente (sem erros de sintaxe)
- [ ] System Prompt configurado no AI Agent
- [ ] Teste 1: Config válido retorna success ✅
- [ ] Teste 2: Config inválido retorna erro claro ❌
- [ ] Teste 3: Agent consegue chamar Tool
- [ ] Teste 4: Agent gera jogos válidos
- [ ] Teste 5: JSON gerado segue estrutura esperada
- [ ] Workflow N8N salvo e versionado

---

## 📚 Referências

- **JSON Schema:** `/tools/n8n-tool-schema-modalidades.json`
- **Prompt MVP:** `/prompts/game-designer-v1-MVP.md`
- **Exemplo completo:** `/tools/exemplo-resposta-game-designer.json`
- **Doc técnica:** `/docs/N8N-TOOL-SETUP.md`

---

**Última atualização:** 2025-11-04
**Tempo total estimado:** 15-20 minutos
**Nível de dificuldade:** Intermediário

**Boa configuração! 🚀**
