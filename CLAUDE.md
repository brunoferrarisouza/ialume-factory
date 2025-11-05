# 🎮 Claude Code - iAlume Factory Project

**Versão:** 1.0
**Última atualização:** 2025-11-04
**Status:** Em Desenvolvimento - Foundation 60% completa

---

## 🎯 OBJETIVO DO PROJETO

Sistema automatizado que transforma **tarefas escolares** (fotos ou texto) em **jogos HTML educacionais interativos** com alto nível de juice em até **90 segundos**.

### Problema que resolve:
- Tarefas escolares são chatas e desmotivadoras
- Alunos não têm engajamento com exercícios tradicionais
- Professores não têm tempo para criar conteúdo gamificado
- Soluções existentes são genéricas e não contextualizam

### Nossa solução:
- **Input:** Foto de qualquer tarefa escolar
- **Processamento:** Sistema inteligente analisa e cria jogo personalizado
- **Output:** Jogo HTML standalone com narrativa, mecânicas e alto juice
- **Tempo:** < 90 segundos
- **Qualidade:** Nível profissional (10/10 princípios de juice)

### Especificações Core:
- **Formato Output:** HTML standalone (single file, ~2-3MB)
- **Compatibilidade:** Chrome, Firefox, Safari, Edge (mobile + desktop)
- **Dependências:** Zero (funciona offline)
- **Taxa de sucesso:** > 95%
- **Custo por jogo:** < $0.02

---

## 🏗️ ARQUITETURA DO SISTEMA

```
┌─────────────┐     Foto      ┌──────────────┐     JSON     ┌─────────────┐
│   Bubble    │──────────────▶│     n8n      │─────────────▶│   Claude    │
│  (Upload)   │               │  (Workflow)  │              │ ANALYZER    │
└─────────────┘               └──────────────┘              └─────────────┘
                                     ▲                              │
                                     │                              │ JSON
                                     │ HTML                         ▼
                               ┌──────────────┐              ┌─────────────┐
                               │   Bubble     │              │   Claude    │
                               │  (Armazena)  │              │GAME_DESIGNER│
                               └──────────────┘              └─────────────┘
                                     │                              │
                                     │ URL                          │ JSON
                                     ▼                              ▼
                               ┌──────────────┐              ┌─────────────┐
                               │    Aluno     │              │    Game     │
                               │    (Joga)    │◀─────────────│  Assembler  │
                               └──────────────┘     HTML     │   (N8N)     │
                                                              └─────────────┘
                                                                     │
                                                                     │ load
                                                                     ▼
                                                              ┌─────────────┐
                                                              │ CDN (GitHub)│
                                                              │  1.0.0/     │
                                                              │ ├─ base.js  │
                                                              │ ├─ mechanics│
                                                              │ └─ modalities
                                                              └─────────────┘
```

### Componentes Principais

**1. Bubble.io** - Frontend/Backend
- Interface do professor (upload de fotos)
- Interface do aluno (lista de jogos)
- Banco de dados (jogos, resultados, usuários)
- Autenticação e gestão de sessões

**2. n8n** - Orquestração
- Recebe webhook do Bubble
- Executa pré-processamento (OCR, extração)
- Chama agentes Claude (ANALYZER + GAME_DESIGNER)
- Executa game_assembler para gerar HTML
- Retorna URL do jogo para Bubble

**3. Claude API** - Agentes Inteligentes
- **ANALYZER:** Análise pedagógica (Bloom taxonomy, progressão)
- **GAME_DESIGNER:** Decisões criativas (mecânica + narrativa + modalidades)

**4. Game Assembler (N8N)** - Montador
- Recebe JSON do Claude
- Monta HTML a partir de componentes CDN
- Injeta modalidades e mecânicas
- Aplica juice system
- Retorna HTML completo standalone

**5. CDN (GitHub Pages)** - Componentes
- **URL:** `https://brunoferrarisouza.github.io/ialume-factory/1.0.0/`
- **Conteúdo:** base.js, game-engine.js, mechanics/*.js, modalities/*.js
- **Versionamento:** Semântico (1.0.0, 1.1.0, 2.0.0)
- **Imutabilidade:** Cada versão é imutável

**6. Foundation** - Base do jogo
- `base.js` - Sistema base e inicialização
- `game-engine.js` - Orquestração de fases
- `bubble-integration.js` - Integração com Bubble
- `base.css` - Paleta Lume + estilos core

---

## 📊 STATUS ATUAL

**Atualizado em:** 04/11/2025

### Foundation: 60% completa

**✅ Concluído:**
- CDN deployado e funcionando (GitHub Pages)
- Base System completo (base.js, game-engine.js, bubble-integration.js)
- Mechanics: 2/10 implementadas (escalada, perseguicao)
- Modalities: 4/15 implementadas (quiz, true-false, fill-blanks, sequence)
- Deploy automático (npm scripts funcionando)
- Testes básicos (test-cdn-CORRIGIDO.html)

**❌ Pendente:**
- N8N Pipeline não configurado
- Bubble Integration não implementada
- Agentes Claude não criados (ANALYZER + GAME_DESIGNER)
- 8 mechanics faltando
- 11 modalities faltando
- Sistema de Juice incompleto

**Progresso geral:** ~15% MVP

---

## 🗂️ ESTRUTURA DO REPOSITÓRIO

```
ialume-factory/
├── .clauderules              # ⛔ REGRAS INEGOCIÁVEIS - LER SEMPRE!
├── CHECKPOINT.md             # Status e roadmap oficial
├── CLAUDE.md                 # Este arquivo - guia do projeto
├── README.md                 # Readme público
├── README-DEPLOY.md          # Guia de deploy
├── package.json              # Scripts npm
│
├── base/                     # 🔧 Core System (SAGRADO - NÃO MODIFICAR SEM PERMISSÃO)
│   ├── scripts/
│   │   ├── base.js           # Sistema base
│   │   ├── game-engine.js    # Motor do jogo
│   │   └── bubble-integration.js  # Integração Bubble
│   └── styles/
│       └── base.css          # Paleta Lume + estilos
│
├── mechanics/                # 🎨 Mecânicas visuais (SAGRADO)
│   ├── escalada.js           # ✅ Subir montanha
│   └── perseguicao.js        # ✅ Fugir de perigo
│
├── modalities/               # 🎯 Modalidades de interação (SAGRADO)
│   ├── quiz.js               # ✅ Múltipla escolha
│   ├── true-false.js         # ✅ Verdadeiro/Falso
│   ├── fill-blanks.js        # ✅ Completar lacunas
│   └── sequence.js           # ✅ Ordenar sequência (drag & drop)
│
├── 1.0.0/                    # 📦 Versão CDN deployada (IMUTÁVEL)
│   ├── base/
│   ├── mechanics/
│   └── modalities/
│
├── tools/                    # 🛠️ Ferramentas de montagem
│   └── assembly/
│       ├── game_assembler.js         # Montador manual
│       ├── game_assembler_cdn.js     # Versão CDN
│       └── n8n-code-node.js          # Template N8N
│
├── docs/                     # 📚 Documentação
│   ├── ADR-001-modalidades-tools-vs-prompt.md
│   └── guias/
│       └── DEPLOY-FACIL.md
│
├── tests/                    # 🧪 Testes de jogos
│   └── test-cdn-CORRIGIDO.html
│
├── scripts/                  # 🚀 Automação
│   ├── deploy-cdn.js         # Prepara CDN
│   └── push-cdn.js           # Push para GitHub
│
└── backups/                  # 💾 Backups
```

---

## ⛔ REGRAS CRÍTICAS

### 🚨 NUNCA CODAR SEM APROVAÇÃO

**PROCESSO OBRIGATÓRIO para QUALQUER modificação de código:**

1. **PARAR** - Não codar imediatamente
2. **EXPLICAR** - Descrever detalhadamente o que vai fazer
3. **PERGUNTAR** - "Posso prosseguir? (SIM/NÃO)"
4. **AGUARDAR** - Esperar resposta **explícita**
5. **EXECUTAR** - Só após "SIM" confirmado

### 🛡️ Arquivos SAGRADOS (GitHub + CDN)

Arquivos em `/base`, `/mechanics`, `/modalities` e `/1.0.0`:
- ⛔ **NUNCA** modificar sem permissão **EXPLÍCITA**
- ⛔ **SEMPRE** perguntar **DUAS VEZES** antes de modificar
- ✅ Se em dúvida, **CRIAR arquivo NOVO** em vez de modificar
- ✅ Estão deployados no CDN e versionados no GitHub
- ✅ Qualquer mudança afeta jogos em produção

### ✅ Permissões Válidas

- ✅ **"SIM"** ou **"PODE"** = autorização válida para executar
- ❌ **"OK"**, **"tá bom"**, **"beleza"** = NÃO são permissões válidas
- ❌ Silêncio ou ausência de resposta = NÃO é permissão

### ⚠️ Protocolo de Violação

Se Claude violar estas regras:
1. **Parar imediatamente** a execução
2. **Confessar a violação** ao usuário
3. **Oferecer reverter** as mudanças
4. **Não fazer desculpas**, apenas corrigir

### 📋 Exemplo Correto

```
User: "Adiciona um console.log no base.js"

Claude: "🛑 Você quer que eu modifique o arquivo base/scripts/base.js?

Este arquivo:
- Está na foundation (SAGRADO)
- Está deployado no CDN
- Pode estar no GitHub
- Afeta jogos em produção

Posso modificar? (SIM/NÃO)"

User: "SIM"

Claude: [Modifica o arquivo]
```

### ❌ Exemplo Errado

```
User: "Adiciona um console.log no base.js"

Claude: [Modifica diretamente sem perguntar] ← VIOLAÇÃO GRAVE!
```

---

## 📚 DEFINIÇÕES FUNDAMENTAIS

### **O QUE É UMA MECÂNICA DE PROGRESSÃO VISUAL?**

**Definição:** A "casca" do jogo - como o progresso é MOSTRADO visualmente ao jogador

**Características:**
- Puramente **estética/narrativa**
- Cria **contexto emocional**
- NÃO define o que o aluno FAZ
- Define o que o aluno VÊ acontecendo

**Exemplo:**
```
Mecânica: ESCALADA
- Aluno vê: Lume subindo uma montanha
- Progresso: Altura na tela aumenta
- Tensão: Pode "cair" ao errar
- NÃO define: como o aluno interage (isso é modalidade)
```

---

### **O QUE É UMA MODALIDADE DE INTERAÇÃO?**

**Definição:** O que o aluno REALMENTE FAZ com as mãos/teclado

**Características:**
- Define **tipo de input** (clicar, digitar, arrastar)
- Determina **habilidade cognitiva** ativada (Bloom)
- Pode ser usada em **qualquer mecânica visual**
- É o "núcleo pedagógico" do jogo

**Exemplo:**
```
Modalidade: QUIZ
- Aluno faz: Clica em alternativas
- Habilidade: Reconhecer/Lembrar
- Pode estar em: Escalada, Voo, Mergulho, etc.
```

---

### **PRINCÍPIO FUNDAMENTAL**

**Mecânicas e Modalidades são INDEPENDENTES e COMBINÁVEIS**

```
QUALQUER Modalidade pode funcionar em QUALQUER Mecânica

Exemplos:
- Quiz (modalidade) + Escalada (mecânica) = Responde quiz e sobe
- Drag&Drop (modalidade) + Mergulho (mecânica) = Arrasta e mergulha
- Input (modalidade) + Construção (mecânica) = Digita e constrói
```

**Total de combinações possíveis:** 10 mecânicas × 15 modalidades = **150 jogos únicos**

---

## 🎨 MECÂNICAS DE PROGRESSÃO VISUAL (10 totais)

### **✅ IMPLEMENTADAS (2/10)**

#### **1. ESCALADA/SUBIDA** ⛰️

**Visual:** Lume sobe verticalmente
**Progresso:** Altura na tela (CSS bottom aumenta)
**Tensão:** Pode cair ao errar
**Metáfora:** "Subir montanha do conhecimento"
**Melhor para:** Progressão linear, níveis de dificuldade

**Implementação:**
- Lume: `position: absolute`, `bottom` muda de 0 → 500px
- Degraus: divs horizontais em alturas fixas
- Erro: `bottom` diminui (desce)
- Vitória: topo da montanha

**Arquivo:** `/mechanics/escalada.js`

---

#### **2. PERSEGUIÇÃO/FUGA** 🏃‍♂️

**Visual:** Lume foge de algo horizontalmente
**Progresso:** Distância do perigo (CSS left aumenta)
**Tensão:** Perigo se aproxima ao errar
**Metáfora:** "Correr do dragão da ignorância"
**Melhor para:** Criar urgência, tempo limitado

**Implementação:**
- Lume: `left` aumenta ao acertar (20% → 80%)
- Perigo: `left` aumenta ao errar (0% → 70%)
- Se perigo alcança: game over suave (tenta de novo)
- Vitória: Lume chega na direita da tela

**Arquivo:** `/mechanics/perseguicao.js`

---

### **⏳ PLANEJADAS (8/10)**

#### **3. MERGULHO/PROFUNDIDADE** 🌊

**Visual:** Lume desce no oceano
**Progresso:** Profundidade (CSS top aumenta)
**Tensão:** Oxigênio diminui ao errar
**Metáfora:** "Mergulhar nos mistérios"
**Melhor para:** Exploração, descoberta progressiva

**Implementação planejada:**
- Lume: `top` muda de 50px → 500px
- Background: gradiente escurece (azul claro → azul escuro)
- Barra oxigênio: `width` diminui ao errar
- Cristais: aparecem em profundidades específicas
- Vitória: fundo do oceano

---

#### **4. CONSTRUÇÃO/CRIAÇÃO** 🏗️

**Visual:** Algo é construído peça por peça
**Progresso:** Número de elementos na tela
**Tensão:** Construção balança/racha ao errar
**Metáfora:** "Construir castelo do saber"
**Melhor para:** Sequências, padrões, acumulação

**Implementação planejada:**
- Container: `display: flex; flex-direction: column-reverse`
- Acerto: novo `div.block` é adicionado
- Erro: último bloco "shake" ou some
- Cada bloco: animação de entrada (scale + translateY)
- Vitória: X blocos = torre completa

---

#### **5. VOO/ALTITUDE** ✈️

**Visual:** Lume voa no céu
**Progresso:** Altura + atravessar nuvens
**Tensão:** Perde altitude ao errar
**Metáfora:** "Voar rumo às estrelas"
**Melhor para:** Sensação de liberdade, superar obstáculos

---

#### **6. LABIRINTO/EXPLORAÇÃO** 🗺️

**Visual:** Mapa com caminhos que se iluminam
**Progresso:** Caminho percorrido (path SVG)
**Tensão:** Caminhos errados escurecem
**Metáfora:** "Navegar pelo labirinto do conhecimento"

---

#### **7. JARDIM/CRESCIMENTO** 🌱

**Visual:** Plantas/flores crescem
**Progresso:** Número e tamanho das plantas
**Tensão:** Plantas murcham ao errar
**Metáfora:** "Cultivar jardim da sabedoria"

---

#### **8. CONSTELAÇÃO/ESTRELAS** ⭐

**Visual:** Estrelas conectadas formam figura
**Progresso:** Linhas conectando estrelas
**Tensão:** Conexões erradas apagam
**Metáfora:** "Ligar estrelas do conhecimento"

---

#### **9. RIO/CORRENTEZA** 🌊

**Visual:** Lume navega rio em barco
**Progresso:** Distância percorrida horizontalmente
**Tensão:** Obstáculos (pedras) aparecem
**Metáfora:** "Navegar rio do aprendizado"

---

#### **10. TESOURO/DESBLOQUEIO** 🗝️

**Visual:** Baús/portas se abrem
**Progresso:** Número de baús abertos
**Tensão:** Baús errados trancam novamente
**Metáfora:** "Desbloquear cofres do saber"

---

## 🎯 MODALIDADES DE INTERAÇÃO (15 totais)

### **✅ IMPLEMENTADAS (4/15)**

#### **1. QUIZ (Múltipla Escolha)**

**Interação:** Clicar em alternativas (A, B, C, D)
**Bloom:** Lembrar/Reconhecer
**Input:** Clique do mouse/touch
**Feedback:** Botão muda cor (verde/vermelho)

**Estrutura JSON:**
```json
{
  "type": "quiz",
  "pergunta": "Qual é a unidade de medida?",
  "alternativas": ["cm", "kg", "litro", "graus"],
  "correta": 0,
  "feedback_correto": "✅ Correto! Centímetro mede comprimento.",
  "feedback_errado": "❌ A resposta era: cm"
}
```

**Arquivo:** `/modalities/quiz.js`

---

#### **2. TRUE-FALSE (Verdadeiro/Falso)**

**Interação:** Clicar em V ou F
**Bloom:** Julgar/Avaliar
**Input:** Clique do mouse/touch
**Feedback:** Botão escolhido muda cor

**Estrutura JSON:**
```json
{
  "type": "true-false",
  "afirmacao": "1 metro tem 100 centímetros",
  "correta": true,
  "feedback_correto": "✅ Verdadeiro!",
  "feedback_errado": "❌ Na verdade, é verdadeiro!"
}
```

**Arquivo:** `/modalities/true-false.js`

---

#### **3. FILL-BLANKS (Preencher Lacunas)**

**Interação:** Digitar em campo de texto
**Bloom:** Completar/Recordar
**Input:** Teclado
**Feedback:** Input correto = verde + disabled

**Estrutura JSON:**
```json
{
  "type": "fill-blanks",
  "frase": "1 metro tem ____ centímetros",
  "resposta": "100",
  "variacoes_aceitas": ["100", "cem"],
  "dica": "Pense em quantos centímetros cabem em uma régua grande",
  "feedback_correto": "✅ Isso mesmo!",
  "feedback_errado": "❌ A resposta era: 100"
}
```

**Arquivo:** `/modalities/fill-blanks.js`

---

#### **4. SEQUENCE (Ordenar Sequência)**

**Interação:** Arrastar itens para reordenar (drag & drop)
**Bloom:** Analisar/Sequenciar
**Input:** Drag & drop (mouse/touch)
**Feedback:** Ordem correta = animação verde

**Estrutura JSON:**
```json
{
  "type": "sequence",
  "instrucao": "Coloque em ordem crescente de tamanho:",
  "itens": ["1 metro", "1 centímetro", "1 quilômetro"],
  "ordem_correta": ["1 centímetro", "1 metro", "1 quilômetro"],
  "feedback_correto": "✅ Ordem perfeita!",
  "feedback_errado": "❌ Veja a ordem correta"
}
```

**Arquivo:** `/modalities/sequence.js`

---

### **⏳ PLANEJADAS (11/15)**

#### **5. INPUT (Resposta Curta)**

**Interação:** Digitar número ou texto livre
**Bloom:** Entender/Aplicar
**Input:** Teclado

**Estrutura JSON:**
```json
{
  "type": "input",
  "pergunta": "Quantos centímetros tem este objeto?",
  "resposta": "15",
  "variacoes_aceitas": ["15", "15cm", "quinze"],
  "case_sensitive": false,
  "dica": "Use a régua para medir",
  "feedback_correto": "✅ Correto!",
  "feedback_errado": "❌ A resposta era: 15 cm"
}
```

---

#### **6. SLIDER (Escala)**

**Interação:** Arrastar barra deslizante
**Bloom:** Estimar/Aproximar
**Input:** Mouse/touch drag horizontal

**Estrutura JSON:**
```json
{
  "type": "slider",
  "pergunta": "Estime quantos cm tem:",
  "min": 0,
  "max": 100,
  "step": 1,
  "valor_correto": 25,
  "tolerancia": 3,
  "unidade": "cm",
  "feedback_correto": "✅ Boa estimativa!",
  "feedback_errado": "❌ Era aproximadamente 25 cm"
}
```

---

#### **7. DRAG-DROP (Arrastar para Zonas)**

**Interação:** Arrastar items para zonas específicas
**Bloom:** Classificar/Organizar
**Input:** Drag & drop

**Estrutura JSON:**
```json
{
  "type": "drag-drop",
  "instrucao": "Arraste cada objeto para a zona correta:",
  "items": [
    {"id": "item1", "texto": "Régua", "zona_correta": "mede-comprimento"},
    {"id": "item2", "texto": "Balança", "zona_correta": "mede-peso"}
  ],
  "zonas": [
    {"id": "mede-comprimento", "nome": "Mede Comprimento", "cor": "#667eea"},
    {"id": "mede-peso", "nome": "Mede Peso", "cor": "#f093fb"}
  ],
  "feedback_correto": "✅ Classificação perfeita!",
  "feedback_errado": "❌ Alguns itens estão na zona errada"
}
```

---

#### **8. MATCHING (Conectar Pares)**

**Interação:** Conectar itens relacionados
**Bloom:** Relacionar/Associar
**Input:** Cliques em sequência

**Estrutura JSON:**
```json
{
  "type": "matching",
  "instrucao": "Conecte cada medida com seu instrumento:",
  "pares": [
    {"esquerda": "Comprimento", "direita": "Régua"},
    {"esquerda": "Peso", "direita": "Balança"},
    {"esquerda": "Temperatura", "direita": "Termômetro"}
  ],
  "feedback_correto": "✅ Todas as conexões corretas!",
  "feedback_errado": "❌ Algumas conexões estão erradas"
}
```

---

#### **9. MEMORIA (Jogo de Memória)**

**Interação:** Virar cartas e parear
**Bloom:** Memorizar/Recordar
**Input:** Cliques

**Estrutura JSON:**
```json
{
  "type": "memoria",
  "instrucao": "Encontre os pares de medidas equivalentes:",
  "pares": [
    {"id": "par1", "conteudo": "1m", "tipo": "text"},
    {"id": "par1", "conteudo": "100cm", "tipo": "text"},
    {"id": "par2", "conteudo": "1km", "tipo": "text"},
    {"id": "par2", "conteudo": "1000m", "tipo": "text"}
  ],
  "max_tentativas": 20,
  "feedback_correto": "✅ Todos os pares encontrados!",
  "feedback_errado": "❌ Continue tentando!"
}
```

---

#### **10. DESENHO (Canvas Livre)**

**Interação:** Desenhar com mouse/dedo
**Bloom:** Criar/Expressar
**Input:** Canvas drawing

**Estrutura JSON:**
```json
{
  "type": "desenho",
  "instrucao": "Desenhe uma linha reta de 5cm usando a régua:",
  "tipo_validacao": "linha-reta",
  "parametros": {"comprimento_esperado": 5, "tolerancia": 0.5},
  "feedback_correto": "✅ Linha perfeita!",
  "feedback_errado": "❌ Tente novamente"
}
```

---

#### **11. CLIQUE (Hotspot)**

**Interação:** Clicar em área específica da imagem
**Bloom:** Identificar/Localizar
**Input:** Clique

**Estrutura JSON:**
```json
{
  "type": "clique",
  "pergunta": "Clique no objeto MAIOR:",
  "imagem": "url-da-imagem.png",
  "areas_corretas": [
    {"x": 100, "y": 150, "largura": 80, "altura": 120}
  ],
  "feedback_correto": "✅ Correto! Este é o maior.",
  "feedback_errado": "❌ Este não é o maior objeto"
}
```

---

#### **12. ESCOLHA-PORTA (Escolha Visual)**

**Interação:** Escolher entre opções visuais
**Bloom:** Decidir/Escolher
**Input:** Clique

**Estrutura JSON:**
```json
{
  "type": "escolha-porta",
  "pergunta": "Escolha o caminho correto:",
  "portas": [
    {"id": "porta1", "emoji": "🚪", "titulo": "Maior que 10", "descricao": "Objetos > 10cm"},
    {"id": "porta2", "emoji": "🚪", "titulo": "Menor que 10", "descricao": "Objetos < 10cm"}
  ],
  "porta_correta": "porta1",
  "feedback_correto": "✅ Caminho certo!",
  "feedback_errado": "❌ Era o outro caminho"
}
```

---

#### **13. CONSTRUTOR (Compor Elementos)**

**Interação:** Adicionar/remover elementos para criar algo
**Bloom:** Sintetizar/Compor
**Input:** Cliques

**Estrutura JSON:**
```json
{
  "type": "construtor",
  "instrucao": "Monte a sequência de medidas do menor para o maior:",
  "pecas_disponiveis": [
    {"id": "mm", "texto": "milímetro", "icone": "📏"},
    {"id": "cm", "texto": "centímetro", "icone": "📏"},
    {"id": "m", "texto": "metro", "icone": "📏"}
  ],
  "sequencia_correta": ["mm", "cm", "m"],
  "feedback_correto": "✅ Sequência perfeita!",
  "feedback_errado": "❌ A ordem está errada"
}
```

---

#### **14. CLASSIFICACAO (Múltiplas Categorias)**

**Interação:** Classificar items em várias categorias
**Bloom:** Criar/Avaliar
**Input:** Drag & drop ou cliques

**Estrutura JSON:**
```json
{
  "type": "classificacao",
  "instrucao": "Classifique cada ferramenta:",
  "items": [
    {"id": "regua", "texto": "Régua", "categoria_correta": "comprimento"},
    {"id": "balanca", "texto": "Balança", "categoria_correta": "peso"}
  ],
  "categorias": [
    {"id": "comprimento", "nome": "Mede Comprimento", "cor": "#667eea"},
    {"id": "peso", "nome": "Mede Peso", "cor": "#f093fb"},
    {"id": "temperatura", "nome": "Mede Temperatura", "cor": "#ff6b6b"}
  ],
  "feedback_correto": "✅ Classificação completa!",
  "feedback_errado": "❌ Algumas classificações erradas"
}
```

---

#### **15. TEMPORIZADOR (Contra o Tempo)**

**Interação:** Qualquer modalidade + tempo limite
**Bloom:** Fluência/Automatização
**Input:** Variável + timer

**Estrutura JSON:**
```json
{
  "type": "temporizador",
  "pergunta": "Quanto é 5 x 20?",
  "alternativas": ["100", "50", "25", "75"],
  "correta": 0,
  "tempo_limite": 10,
  "feedback_correto": "✅ Rápido e correto!",
  "feedback_errado": "❌ A resposta era 100",
  "feedback_tempo_esgotado": "⏰ Tempo esgotado!"
}
```

---

## 🎓 TAXONOMIA DE BLOOM APLICADA

### **5 Fases por Jogo**

Todo jogo do iAlume Factory segue uma progressão pedagógica de 5 fases baseada na Taxonomia de Bloom:

---

#### **FASE 0: ABERTURA** 🎬

**Bloom:** N/A (narrativa pura)
**Objetivo:** Contexto emocional, engajamento
**Modalidade:** Botão "Começar" apenas
**Mecânica:** Qualquer (estática, sem progressão)
**Tempo:** 10-15s de leitura

**Exemplo:**
```
"Sábio Régulo perdeu a Régua Mágica no topo da Montanha do
Conhecimento! Ajude Lume a subir e recuperá-la!"

[Botão: Começar Aventura!]
```

---

#### **FASE 1: LEMBRAR/RECONHECER** 🔍

**Bloom:** Reconhecer, identificar, listar
**Objetivo:** Ativar conhecimento prévio
**Modalidades típicas:** Quiz, V/F, Clique, Memória
**Mecânicas ideais:** Escalada, Jardim, Tesouro

**Exemplo:**
```
Pergunta: "O que usamos para medir comprimento?"
Modalidade: Quiz
Mecânica: Escalada (sobe ao acertar)
```

**Combinações recomendadas:**
- Quiz + Escalada = "Suba respondendo sobre medidas"
- V/F + Jardim = "Plante flores com respostas verdadeiras"
- Clique + Tesouro = "Clique no objeto correto para abrir baú"

---

#### **FASE 2: ENTENDER/COMPREENDER** 🧪

**Bloom:** Explicar, comparar, estimar
**Objetivo:** Compreender o conceito
**Modalidades típicas:** Slider, Input, Lacunas, Matching
**Mecânicas ideais:** Mergulho, Construção, Labirinto

**Exemplo:**
```
Pergunta: "Estime o tamanho deste objeto"
Modalidade: Slider (estimativa) + Input (valor exato)
Mecânica: Mergulho (mergulha ao acertar)
```

**Combinações recomendadas:**
- Slider + Mergulho = "Estime para mergulhar mais fundo"
- Input + Construção = "Digite para adicionar blocos"
- Matching + Labirinto = "Conecte pares para iluminar caminho"

---

#### **FASE 3: APLICAR** 🚀

**Bloom:** Usar, resolver, classificar
**Objetivo:** Aplicar conhecimento em contexto novo
**Modalidades típicas:** Drag&Drop, Sequência, Desenho, Escolha-Porta
**Mecânicas ideais:** Construção, Voo, Rio

**Exemplo:**
```
Pergunta: "Classifique os objetos por tamanho"
Modalidade: Drag&Drop
Mecânica: Construção (monta ponte ao acertar)
```

**Combinações recomendadas:**
- Drag&Drop + Construção = "Arraste para construir"
- Sequência + Voo = "Ordene para voar mais alto"
- Desenho + Rio = "Desenhe o caminho do barco"

---

#### **FASE 4: CRIAR/AVALIAR** 🏆

**Bloom:** Criar, inventar, julgar, sintetizar
**Objetivo:** Demonstrar maestria
**Modalidades típicas:** Construtor, Classificação múltipla, Matching avançado
**Mecânicas ideais:** Constelação, Voo final, Tesouro final

**Exemplo:**
```
Pergunta: "Crie sua própria sequência seguindo a regra"
Modalidade: Construtor
Mecânica: Constelação (conecta estrelas ao acertar)
```

**Combinações recomendadas:**
- Construtor + Constelação = "Crie padrão conectando estrelas"
- Classificação + Voo = "Organize tudo para voar às estrelas"
- Temporizador + Tesouro = "Abra todos os baús rapidamente"

---

### **Matriz de Combinações por Bloom**

| Fase | Bloom | Mecânicas | Modalidades | Exemplo |
|------|-------|-----------|-------------|---------|
| **0** | Abertura | Qualquer (estática) | Botão início | "Começar aventura!" |
| **1** | Lembrar | Escalada, Jardim, Tesouro | Quiz, V/F, Clique, Memória | Quiz na escalada |
| **2** | Entender | Mergulho, Construção, Labirinto | Input, Slider, Lacunas, Matching | Slider no mergulho |
| **3** | Aplicar | Construção, Voo, Rio | Drag&Drop, Sequência, Desenho | Drag na construção |
| **4** | Criar | Constelação, Voo, Tesouro | Construtor, Classificação | Construtor na constelação |

---

### **Regras de Ouro para Combinações**

#### **✅ BOAS COMBINAÇÕES:**

1. **Fase fácil + Mecânica simples + Modalidade direta**
   - ✅ Fase 1 + Escalada + Quiz = Perfeito
   - ✅ Fase 2 + Mergulho + Slider = Excelente

2. **Progressão visual clara**
   - ✅ Mergulho mostra profundidade crescente
   - ✅ Escalada mostra altura aumentando

3. **Modalidade alinhada com Bloom**
   - ✅ Aplicar → Drag&Drop (não Quiz)
   - ✅ Lembrar → Quiz (não Construtor)

4. **Variedade entre fases**
   - ✅ Fase 1: Quiz | Fase 2: Input | Fase 3: Drag | Fase 4: Construtor

#### **❌ COMBINAÇÕES RUINS:**

1. **Mecânica complexa + Modalidade complexa**
   - ❌ Perseguição + Drag&Drop = Muito confuso
   - ❌ Labirinto + Construtor = Sobrecarga cognitiva

2. **Modalidade inadequada para Bloom**
   - ❌ Criar → Quiz múltipla escolha = Não avalia criação
   - ❌ Lembrar → Construtor livre = Muito complexo

3. **Repetição de modalidade**
   - ❌ Fase 1,2,3,4: só Quiz = Tedioso e repetitivo

---

## 💎 SISTEMA DE JUICE (10 Princípios)

### **O que é Juice?**

**Juice** = Feedback visual/sonoro/tátil exagerado que torna cada ação satisfatória.

É o que transforma um jogo "funcional" em um jogo "prazeroso de jogar".

---

### **10 Princípios Implementados:**

#### **1. Feedback Imediato** (< 100ms)
- Toda ação tem resposta instantânea
- Som + visual + haptic simultâneos
- Exemplo: Clique em botão → Som + Cor + Scale imediatos

#### **2. Exagero**
- Efeitos maiores que necessário (propositalmente)
- Explosões, partículas, brilhos intensos
- Exemplo: Acertou → Confetti explode + Screen shake

#### **3. Camadas Múltiplas**
- Som + visual + haptic ao mesmo tempo
- Não apenas 1 tipo de feedback
- Exemplo: Acerto = Som SUCCESS + Brilho verde + Vibração + Partículas

#### **4. Física Convincente**
- Gravidade, inércia, bounce (via CSS, não motor físico)
- Elementos "pesam" e reagem naturalmente
- Exemplo: Bloco cai com bounce (cubic-bezier easing)

#### **5. Antecipação**
- Elementos "preparam" antes da ação
- Botão comprime antes de clicar
- Exemplo: Hover → Scale down 0.95 → Click → Scale up 1.1

#### **6. Follow-through**
- Animações continuam após ação
- Não param bruscamente (easing)
- Exemplo: Partículas continuam voando após explosão

#### **7. Squash & Stretch**
- Elementos deformam ao interagir
- Scale pulsa ao clicar
- Exemplo: Botão: scale(0.95) → scale(1.1) → scale(1)

#### **8. Secondary Motion**
- Movimento adicional além do principal
- Partículas voam quando acerta
- Exemplo: Personagem pula + Nuvem de poeira + Pedras saltam

#### **9. Timing Variado**
- Diferentes durações criam ritmo
- Não tudo ao mesmo tempo
- Exemplo: Som (0ms) → Visual (50ms) → Partículas (100ms)

#### **10. Easing Curves**
- Aceleração/desaceleração não-linear
- cubic-bezier personalizado
- Exemplo: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` para bounce

---

### **Implementação (juice.js planejado):**

```javascript
// Sistema pré-fabricado
JUICE.feedback.correct(element) {
  playSound('success');              // 1. Feedback imediato
  particles(element, 'stars', 20);   // 2. Exagero
  screenShake(2);                    // 3. Camadas múltiplas
  scaleUp(element, 1.2);             // 7. Squash & stretch
  glow(element, 'green', 500);       // Visual
  confetti(10);                      // 8. Secondary motion
  vibrate([100, 50, 100]);           // Haptic feedback
  // ... todos os 10 princípios
}

JUICE.feedback.wrong(element) {
  playSound('error');
  shake(element, 5);
  flash(element, 'red', 300);
  scaleDown(element, 0.9);
  // Feedback negativo mas não punitivo
}
```

**Arquivo planejado:** `/juice/juice.js`

---

## 🎨 PALETA DE CORES LUME

### **Identidade Visual**

```css
:root {
  /* === LUME (Vaga-lume dourado) === */
  --lume-primary: #ffd700;      /* Dourado brilhante */
  --lume-glow: #fff8dc;         /* Brilho suave */
  --lume-shadow: #b8860b;       /* Sombra dourada */

  /* === GRADIENTES PRINCIPAIS === */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  --warning-gradient: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  --danger-gradient: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);

  /* === CORES DE FEEDBACK === */
  --correct: #51cf66;           /* Verde sucesso */
  --correct-dark: #37b24d;      /* Verde escuro */
  --wrong: #ff6b6b;             /* Vermelho erro */
  --wrong-dark: #f03e3e;        /* Vermelho escuro */
  --hint: #ffd700;              /* Dourado dica */

  /* === CORES NEUTRAS === */
  --background: #f8f9fa;        /* Fundo claro */
  --surface: #ffffff;           /* Superfície */
  --text-primary: #212529;      /* Texto principal */
  --text-secondary: #495057;    /* Texto secundário */
  --border: #dee2e6;            /* Bordas */

  /* === SOMBRAS === */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 15px rgba(0,0,0,0.1);
  --shadow-lg: 0 6px 20px rgba(0,0,0,0.15);
  --shadow-glow: 0 0 20px rgba(255, 215, 0, 0.5);
}
```

---

### **Animações Obrigatórias**

```css
/* Lume SEMPRE flutua */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.lume-character {
  animation: float 3s ease-in-out infinite;
}

/* Brilho pulsante */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
}

/* Shake (erro) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-5px); }
}

/* Pulse (acerto) */
@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 🧠 PADRÕES DE CÓDIGO

### **Padrão para Modalidades**

Todas as modalidades seguem este padrão obrigatório:

```javascript
const NOME_MODALIDADE = {
    name: 'nome-modalidade',
    currentQuestion: null,  // Estado atual (opcional)

    /**
     * ✅ MÉTODO INIT - Ponto de entrada obrigatório
     * @param {Object} phaseData - Dados da fase
     * @returns {HTMLElement} - Container da modalidade
     */
    init: function(phaseData) {
        console.log('🎯 NOME_MODALIDADE.init() chamado com:', phaseData);

        // Criar e retornar a UI
        const ui = this.createUI(phaseData);

        return ui;
    },

    /**
     * Criar elementos DOM da modalidade
     */
    createUI: function(data) {
        const container = document.createElement('div');
        container.className = 'modalidade-container';

        // 1. Criar elementos DOM
        // 2. Adicionar event listeners
        // 3. Injetar CSS

        this.injectCSS();
        this.currentQuestion = data;

        return container;
    },

    /**
     * Verificar resposta do aluno
     */
    checkAnswer: function(data) {
        const isCorrect = /* lógica de validação */;

        // Feedback visual
        if (isCorrect) {
            showFeedback(data.feedback_correto || '✅ Correto!', 'correct');
            playSound('success');
        } else {
            showFeedback(data.feedback_errado || '❌ Errado!', 'wrong');
            playSound('error');
        }

        // ✅ SEMPRE chamar callback central
        const phaseNumber = window.gameState ? window.gameState.currentPhase : 1;

        if (window.onAnswerChecked) {
            onAnswerChecked(isCorrect, phaseNumber);
        } else {
            console.error('❌ onAnswerChecked não encontrado! Verifique se base.js foi carregado.');
        }
    },

    /**
     * Injetar CSS isolado (só uma vez)
     */
    injectCSS: function() {
        if (document.getElementById('nome-modalidade-styles')) return;

        const style = document.createElement('style');
        style.id = 'nome-modalidade-styles';
        style.textContent = `
            .modalidade-container {
                /* Estilos aqui */
            }
        `;

        document.head.appendChild(style);
    }
};

// ✅ SEMPRE expor globalmente
window.NOME_MODALIDADE = NOME_MODALIDADE;

console.log('📝 nome-modalidade.js carregado!');
```

---

### **Padrão para Mecânicas**

Todas as mecânicas seguem este padrão:

```javascript
const NOME_MECANICA = {
    name: 'nome-mecanica',
    progressValue: 0,

    /**
     * Inicializar mecânica
     */
    init: function(config) {
        console.log('🎨 NOME_MECANICA.init() chamado');

        // Setup inicial (criar elementos visuais)
        this.createVisuals(config);
        this.injectCSS();

        this.progressValue = 0;
    },

    /**
     * Criar elementos visuais
     */
    createVisuals: function(config) {
        // Criar divs, SVGs, etc
    },

    /**
     * Animar progresso positivo (acertou)
     */
    onCorrect: function() {
        this.progressValue++;

        // Atualizar visual (height, left, etc)
        // Adicionar animação
        // Tocar som
    },

    /**
     * Animar feedback negativo (errou)
     */
    onWrong: function() {
        // Shake, diminuir progresso, etc
        // Não punir muito (apenas feedback)
    },

    /**
     * Injetar CSS
     */
    injectCSS: function() {
        if (document.getElementById('nome-mecanica-styles')) return;

        const style = document.createElement('style');
        style.id = 'nome-mecanica-styles';
        style.textContent = `
            /* Estilos da mecânica */
        `;

        document.head.appendChild(style);
    }
};

// ✅ Expor globalmente
window.NOME_MECANICA = NOME_MECANICA;

console.log('🎨 nome-mecanica.js carregado!');
```

---

### **Callbacks Globais Obrigatórios**

Definidos em `base.js`:

```javascript
/**
 * Callback central chamado por TODAS as modalidades
 */
function onAnswerChecked(isCorrect, phaseNumber) {
    // 1. Atualizar gameState
    // 2. Animar mecânica (onCorrect ou onWrong)
    // 3. Aguardar 2s
    // 4. Avançar para próxima fase
}

/**
 * Mostrar feedback visual
 */
function showFeedback(message, type) {
    // Criar toast/popup com mensagem
    // type: 'correct' | 'wrong' | 'hint'
}

/**
 * Tocar som
 */
function playSound(soundName) {
    // Web Audio API
    // soundName: 'success' | 'error' | 'click'
}
```

---

### **Exemplo Completo de Uso**

```javascript
// Game Engine carrega fase
const phaseData = {
    type: 'quiz',
    pergunta: 'Quanto é 2+2?',
    alternativas: ['3', '4', '5', '6'],
    correta: 1
};

// Chama modalidade
const modalityUI = window.QUIZ.init(phaseData);
document.querySelector('.phase-container').appendChild(modalityUI);

// Aluno clica em resposta
// QUIZ.checkAnswer() é chamado
// onAnswerChecked() é disparado
// Mecânica anima
// Próxima fase é carregada
```

---

## 🎯 DECISÕES ARQUITETURAIS

### **ADR-001: Modalidades (Tools vs Prompt)**

**Data:** 2025-11-04
**Status:** 🟢 Aceito

**Questão:** Onde definir a estrutura JSON de cada modalidade?
- Opção A: No prompt do Game Designer (texto descritivo)
- Opção B: Em Tools do N8N (JSON Schema formal)
- Opção C: Híbrido

**Decisão Faseada:**

#### **FASE 1 (MVP - ATUAL):** Prompt Textual
- **Modalidades:** 4-6 core
- **Motivo:** Simplicidade, velocidade de iteração
- **Prós:** Setup simples, debugging fácil, Claude flexível
- **Contras:** Cresce ~10 linhas/modalidade, limite ~10-12 antes de timeout
- **Total:** ~400 linhas de prompt

#### **FASE 2 (v2.0):** Híbrido
- **Quando:** Precisar de 10+ modalidades
- **Core no Tool:** 7 modalidades mais usadas (JSON Schema)
- **Raras no Prompt:** 3-5 modalidades específicas
- **Escape hatch:** Campo `custom` para experimentação

#### **FASE 3 (v3.0):** Tools Puro
- **Quando:** 15+ modalidades em produção
- **Tool:** Todas as 15+ modalidades em JSON Schema
- **Prompt:** Só pedagogia (~150 linhas)
- **Benefício:** Máxima escalabilidade, validação automática

**Status atual:** Fase 1 (prompt textual com 4 modalidades)

**Trade-offs:**

| Aspecto | Prompt | Tools | Híbrido |
|---------|--------|-------|---------|
| Escalabilidade | ⚠️ Limitada (10 max) | ✅ Infinita | ✅ Alta (20+) |
| Simplicidade | ✅ Muito simples | ❌ Complexo | ⚠️ Médio |
| Manutenção | ⚠️ Manual | ✅ Estruturado | ✅ Bom |
| Debugging | ✅ Fácil | ❌ Difícil | ⚠️ Médio |
| Flexibilidade | ✅ Alta | ❌ Baixa | ✅ Boa |
| Latência | ⚠️ Cresce | ✅ Constante | ✅ Constante |

**Documento completo:** `docs/ADR-001-modalidades-tools-vs-prompt.md`

---

### **Outras Decisões Importantes**

#### **Versionamento do CDN**
- **Decisão:** Versionamento semântico imutável
- **Formato:** `1.0.0/`, `1.1.0/`, `2.0.0/`
- **Motivo:** Jogos antigos continuam funcionando
- **Impacto:** Nunca modificar versão deployada, sempre criar nova

#### **Single HTML File**
- **Decisão:** Jogos são arquivos HTML standalone
- **Motivo:** Zero dependências, funciona offline
- **Trade-off:** Arquivo maior (~2-3MB com assets base64)

#### **Sem Framework JS**
- **Decisão:** Vanilla JS apenas
- **Motivo:** Simplicidade, performance, zero dependências
- **Trade-off:** Mais código manual, mas maior controle

---

## 🛠️ COMANDOS ÚTEIS

### **Desenvolvimento Local**

```bash
# Navegação rápida
cd ~/Documents/ialume-factory

# Testes de jogos
npm run gerar-teste           # Gera jogo de teste
npm run abrir-teste          # Abre jogo no navegador
npm run teste-completo       # Gera + abre (tudo junto)

# Verificar estrutura
ls -la base/scripts/         # Ver arquivos base
ls -la modalities/           # Ver modalidades
ls -la mechanics/            # Ver mecânicas
```

---

### **Deploy CDN**

```bash
# Deploy completo
npm run deploy               # Prepara arquivos para CDN (copia para 1.0.0/)
npm run push-cdn            # Faz push para GitHub
npm run deploy-push         # Deploy + push automático (recomendado)

# Verificar CDN após deploy
open https://brunoferrarisouza.github.io/ialume-factory/1.0.0/

# Verificar arquivos específicos
open https://brunoferrarisouza.github.io/ialume-factory/1.0.0/modalities/quiz.js
```

---

### **Git Operations**

```bash
# Status rápido
git status
git log --oneline -5

# Commit com verificação
git add .
git commit -m "feat: adiciona modalidade input"
git push

# Ver diferenças
git diff base/scripts/base.js
```

---

### **Debugging**

```bash
# Abrir console do navegador e verificar
# - Erros no console
# - window.QUIZ (modalidades carregadas)
# - window.gameState (estado do jogo)
# - window.GAME_ENGINE (engine carregado)

# Teste de modalidade específica
open tests/test-cdn-CORRIGIDO.html
```

---

## 📋 ROADMAP

### **CHECKPOINT Atual**

Ver `CHECKPOINT.md` para status mais atualizado.

**Você precisa escolher qual caminho seguir:**

---

### **OPÇÃO A: Completar Components** 🎮

**Foco:** Ter todas mechanics + modalities prontas
**Tempo:** 3-5 dias
**Resultado:** CDN completo, pronto pra N8N

**Próximos passos:**
1. Criar mechanics/mergulho.js
2. Criar mechanics/construcao.js
3. Criar mechanics/voo.js
4. Criar mechanics/labirinto.js
5. Criar mechanics/jardim.js
6. Criar mechanics/constelacao.js
7. Criar mechanics/rio.js
8. Criar mechanics/tesouro.js
9. Criar modalities/input.js
10. Criar modalities/slider.js
11. Criar modalities/drag-drop.js
12. Criar modalities/matching.js
13. Criar modalities/memoria.js
14. Criar modalities/desenho.js
15. Criar modalities/clique.js
16. Criar modalities/escolha-porta.js
17. Criar modalities/construtor.js
18. Criar modalities/classificacao.js
19. Criar modalities/temporizador.js
20. Criar juice/juice.js
21. Deploy e teste de cada componente

---

### **OPÇÃO B: Iniciar N8N** 🤖

**Foco:** Ter pipeline funcionando (mesmo com poucos components)
**Tempo:** 2-3 dias
**Resultado:** Foto → Jogo funcionando end-to-end

**Próximos passos:**
1. Criar Agent ANALYZER (prompt + tools)
2. Criar Agent GAME_DESIGNER (prompt + tools)
3. Montar workflow N8N básico
4. Testar com components existentes (4 modalities, 2 mechanics)
5. Refinar prompts baseado em testes

---

### **OPÇÃO C: Híbrido** ⚡

**Foco:** Um pouco de cada
**Tempo:** 4-6 dias
**Resultado:** MVP básico funcionando

**Próximos passos:**
1. Criar +2 mechanics (mergulho, construcao)
2. Criar +2 modalities (input, slider)
3. Criar Agent ANALYZER básico
4. Montar workflow N8N simples
5. Testar pipeline com 6 modalities + 4 mechanics

---

## 📈 MÉTRICAS DE SUCESSO

### **Performance**
- ✅ **Tempo médio:** < 90s (objetivo: 75-85s)
- ✅ **Taxa timeout:** < 5% (objetivo: 2-3%)
- ✅ **Taxa sucesso:** > 95% (objetivo: 98%)
- ✅ **Custo por jogo:** < $0.02 (objetivo: $0.01)

### **Qualidade Pedagógica**
- ✅ **Juice score:** ≥ 8/10 (todos os jogos)
- ✅ **Variabilidade:** Sem repetições exatas em 100 jogos
- ✅ **Alinhamento Bloom:** 100% correto
- ✅ **Narrativa coerente:** 95% bem conectada ao conceito
- ✅ **Ensina conceito:** Não só testa (validar com educadores)
- ✅ **Progressão clara:** Fácil → Difícil visível
- ✅ **Feedback construtivo:** Explica erros, não pune

### **Técnica**
- ✅ **Compatibilidade:** Chrome, Firefox, Safari, Edge (mobile + desktop)
- ✅ **Zero dependências:** Funciona offline
- ✅ **Assets inline:** Single HTML file
- ✅ **Responsivo:** 320px até 2560px
- ✅ **Tamanho:** ~2-3MB por jogo

---

## 📞 REFERÊNCIAS RÁPIDAS

### **Documentos do Projeto**

**No repositório:**
- `CHECKPOINT.md` - Status e decisões atuais (atualizado frequentemente)
- `CLAUDE.md` - Este arquivo (guia completo do projeto)
- `.clauderules` - Regras inegociáveis de modificação
- `README-DEPLOY.md` - Guia de deploy no CDN
- `docs/ADR-001-modalidades-tools-vs-prompt.md` - Decisão arquitetural

**No Obsidian:**
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Ialume_mac2/`
- `🎮 FÁBRICA DE JOGOS EDUCACIONAIS - VISÃO GERAL.md`
- `01-VISAO-GERAL.md`
- `🎯 APROFUNDAMENTO MECÂNICAS vs MODALIDADES.md`

---

### **URLs Importantes**

**CDN (GitHub Pages):**
- Base: `https://brunoferrarisouza.github.io/ialume-factory/1.0.0/`
- Base JS: `https://brunoferrarisouza.github.io/ialume-factory/1.0.0/base/scripts/base.js`
- Quiz: `https://brunoferrarisouza.github.io/ialume-factory/1.0.0/modalities/quiz.js`

**GitHub:**
- Repo: `https://github.com/brunoferrarisouza/ialume-factory`

---

### **Estrutura de Dados JSON**

**Exemplo de jogo completo:**
```json
{
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
      "pergunta": "O que usamos para medir comprimento?",
      "alternativas": ["Régua", "Balança", "Termômetro", "Relógio"],
      "correta": 0,
      "feedback_correto": "✅ Isso! A régua mede comprimento!",
      "feedback_errado": "❌ Era a régua!"
    },
    {
      "numero": 2,
      "tipo": "input",
      "bloom": "entender",
      "pergunta": "Quantos cm tem 1 metro?",
      "resposta": "100",
      "feedback_correto": "✅ Perfeito! 1m = 100cm",
      "feedback_errado": "❌ 1 metro tem 100 centímetros"
    }
  ]
}
```

---

## 🧭 CONTEXTO PARA CLAUDE

### **Preferências de Trabalho**

- **Sempre perguntar** antes de modificar arquivos (especialmente SAGRADOS)
- **Explicar decisões** técnicas antes de implementar
- **Seguir .clauderules** religiosamente (NUNCA violar)
- **Usar TodoWrite** para tarefas com 3+ passos complexos
- **Respeitar versionamento** do CDN (imutabilidade)
- **Nunca criar** documentação .md sem pedido explícito
- **Não usar emojis** a menos que explicitamente pedido

---

### **Quando Usar TodoWrite**

✅ **Usar quando:**
- Tarefas com 3+ passos não-triviais
- Tarefas complexas que exigem organização
- Usuário fornece múltiplas tarefas
- Usuário pede explicitamente

❌ **NÃO usar quando:**
- Tarefa única e simples
- Tarefa trivial (< 3 passos óbvios)
- Puramente conversacional/informacional

---

### **Versionamento e Imutabilidade**

**CDN é IMUTÁVEL por versão:**
- `1.0.0/` nunca muda depois de deployada
- Novos componentes vão para pasta local primeiro
- Deploy cria nova versão se necessário
- Jogos antigos continuam funcionando com versão antiga

**Fluxo de deploy:**
1. Desenvolver localmente em `/modalities` ou `/mechanics`
2. Testar com `npm run teste-completo`
3. Deploy com `npm run deploy-push`
4. GitHub Pages serve automaticamente após push

---

### **Hierarquia de Documentação**

Se houver conflito entre documentos, ordem de prioridade:

1. `.clauderules` (SUPREMO - regras de modificação)
2. `CLAUDE.md` (este arquivo - contexto geral)
3. `CHECKPOINT.md` (status atual e decisões recentes)
4. `ADRs` em `/docs` (decisões arquiteturais específicas)
5. Obsidian (visão conceitual, não técnica)

---

## ✅ CONTEXTO RECUPERÁVEL

**Se você (Claude) precisar retomar este projeto:**

1. **Ler `.clauderules`** (2 min) - Regras inegociáveis
2. **Ler `CLAUDE.md`** (15 min) - Este arquivo, contexto completo
3. **Ler `CHECKPOINT.md`** (5 min) - Status e decisões atuais
4. **Verificar status atual:** Ver quais arquivos existem em `/modalities` e `/mechanics`

**Total:** ~25 min para contextualização completa

**Não precisa reler conversas antigas!**

---

## 🎯 EXEMPLO PRÁTICO COMPLETO

### **Caso de Uso: Jogo sobre Medidas**

**Input:** Foto de tarefa sobre medidas (régua, objetos)

**Processamento:**
1. OCR extrai texto da foto
2. ANALYZER identifica conceito "medidas" e Bloom por questão
3. GAME_DESIGNER decide:
   - Mecânica: ESCALADA (progressão clara)
   - Narrativa: "Lume e a Régua Mágica"
   - Fase 1: Quiz (lembrar)
   - Fase 2: Input (entender)
   - Fase 3: Drag&Drop (aplicar)
   - Fase 4: Construtor (criar)
4. Game Assembler monta HTML com componentes CDN

**Output:** Jogo HTML standalone

**Experiência do aluno:**
```
[FASE 0 - ABERTURA]
"Sábio Régulo perdeu a Régua Mágica no topo da montanha!"
[Botão: Começar]

[FASE 1 - QUIZ + ESCALADA]
Visual: Lume no pé da montanha
Pergunta: "O que mede comprimento?"
Aluno: Clica em "Régua"
Resultado: Lume sobe um degrau! ✅

[FASE 2 - INPUT + ESCALADA]
Visual: Lume mais alto na montanha
Pergunta: "Quantos cm tem 1 metro?"
Aluno: Digita "100"
Resultado: Lume sobe mais! ✅

[FASE 3 - DRAG&DROP + ESCALADA]
Visual: Lume quase no topo
Pergunta: "Arraste objetos para categorias"
Aluno: Arrasta régua para "mede comprimento"
Resultado: Lume chega ao topo! ✅

[VITÓRIA]
"Parabéns! Você ajudou Lume a recuperar a Régua Mágica!"
[Confetti + Som + Animação]
```

---

## 📝 NOTAS FINAIS

### **Filosofia do Projeto**

- **Pedagogia primeiro:** Bloom é obrigatório, não opcional
- **Juice é essencial:** Jogos chatos não engajam
- **Variabilidade:** Nunca repetir exatamente o mesmo jogo
- **Acessibilidade:** Funciona em qualquer dispositivo
- **Simplicidade técnica:** Vanilla JS, zero dependências

### **O que NÃO é o iAlume Factory**

- ❌ Não é uma plataforma genérica de jogos
- ❌ Não é um LMS ou sistema de gestão
- ❌ Não é um criador manual de jogos
- ❌ Não usa frameworks complexos

### **O que É o iAlume Factory**

- ✅ Sistema automatizado de geração de jogos
- ✅ Focado em pedagogia (Bloom)
- ✅ Alto nível de juice (prazeroso)
- ✅ Específico para tarefas escolares
- ✅ < 90 segundos da foto ao jogo

---

**FIM DO DOCUMENTO - CLAUDE.md v1.0**

_Este documento é o guia oficial para Claude Code trabalhar no iAlume Factory._
_Qualquer mudança arquitetural deve ser refletida aqui._
_Versione sempre que houver mudanças significativas._

**Última atualização:** 2025-11-04
**Próxima revisão:** Após completar primeira opção do roadmap (A, B ou C)
