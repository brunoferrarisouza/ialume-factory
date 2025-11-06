# 🎨 GUIA PASSO A PASSO: IMPLEMENTAÇÃO VISUAL (Backgrounds + Parallax)

**Objetivo:** Transformar a escalada básica em uma experiência visual cinematográfica
**Tempo estimado:** 2-3 dias
**Pré-requisito:** Documentação PIVOT-FOCO-ESCALADA.md lida

---

## 📖 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [ETAPA 1: Assets (Backgrounds)](#etapa-1-assets-backgrounds)
3. [ETAPA 2: Estrutura de Pastas](#etapa-2-estrutura-de-pastas)
4. [ETAPA 3: Sistema de Background](#etapa-3-sistema-de-background)
5. [ETAPA 4: Parallax](#etapa-4-parallax)
6. [ETAPA 5: Integração com Escalada](#etapa-5-integração-com-escalada)
7. [ETAPA 6: Testes](#etapa-6-testes)

---

## 🎯 VISÃO GERAL

### O que vamos construir:

**ANTES (atual):**
```
┌─────────────────┐
│  Fundo branco   │ ← Chato
│   🌟 LUME      │
│   ─────        │
│   BASE         │
└─────────────────┘
```

**DEPOIS (objetivo):**
```
┌─────────────────┐
│ 🌄 ☁️ ⛰️       │ ← Camada 1: Céu + montanhas distantes (move 20%)
│  ⛰️ 🌲 ☁️      │ ← Camada 2: Montanhas médias (move 50%)
│ 🌲 🪨 🌟 LUME  │ ← Camada 3: Pedras + árvores (move 100%)
│    🪨──────    │ ← Andares ficam na frente
│   BASE         │
└─────────────────┘
```

### Conceitos principais:

**Parallax:** Técnica onde camadas se movem em velocidades diferentes, criando ilusão de profundidade.
- Fundo (camada 1): Move devagar (20% da velocidade)
- Meio (camada 2): Move médio (50% da velocidade)
- Frente (camada 3): Move rápido (100% da velocidade)

**Por que funciona:** Nossos olhos percebem objetos distantes como mais lentos, criando sensação 3D.

---

## 📁 ETAPA 1: ASSETS (Backgrounds)

### 1.1. Decisão: Criar ou Buscar?

**OPÇÃO A: Buscar Assets Prontos** (Recomendado para MVP)
- ✅ Rápido (1-2 horas)
- ✅ Qualidade profissional
- ✅ Menos custo
- ❌ Menos personalização

**Sites recomendados:**
- https://opengameart.org (grátis, CC0)
- https://itch.io/game-assets/free (grátis)
- https://kenney.nl (grátis, alta qualidade)
- https://craftpix.net (free tier disponível)

**OPÇÃO B: Criar Assets** (Futuro)
- Contratar designer
- Usar Midjourney/DALL-E
- Criar no Figma/Photoshop

**DECISÃO:** Vamos com Opção A para validar rápido.

---

### 1.2. Especificações dos Assets

**Para cada cenário, precisamos de 3 camadas:**

#### Camada 1 (Fundo distante)
- **O que:** Céu + elementos muito distantes
- **Exemplo:** Céu azul, nuvens, montanhas ao longe, sol/lua
- **Tamanho:** 1920x1080px (Full HD)
- **Formato:** PNG transparente
- **Tamanho arquivo:** ~100-150KB (comprimido)
- **Parallax:** Move 20% da velocidade

#### Camada 2 (Meio termo)
- **O que:** Elementos médios
- **Exemplo:** Montanhas médias, árvores no fundo, nuvens baixas
- **Tamanho:** 1920x1080px
- **Formato:** PNG transparente
- **Tamanho arquivo:** ~100-150KB
- **Parallax:** Move 50% da velocidade

#### Camada 3 (Frente)
- **O que:** Elementos próximos
- **Exemplo:** Pedras, árvores na frente, grama, detalhes
- **Tamanho:** 1920x1080px
- **Formato:** PNG transparente
- **Tamanho arquivo:** ~50-100KB
- **Parallax:** Move 100% da velocidade

**IMPORTANTE:** As camadas precisam ser TRANSPARENTES (PNG) para se sobrepor!

---

### 1.3. Cenários Prioritários (Começar com 2)

#### CENÁRIO 1: Montanha Nevada ❄️
**Uso:** Matemática, Física, temas genéricos
**Elementos:**
- Camada 1: Céu azul claro, nuvens brancas, montanhas azuladas ao longe
- Camada 2: Montanhas cinzas com neve, árvores pequenas
- Camada 3: Rochas com neve, pinheiros grandes

#### CENÁRIO 2: Vulcão 🌋
**Uso:** Química, Ciências, desafios difíceis
**Elementos:**
- Camada 1: Céu vermelho/alaranjado, fumaça ao longe, montanhas escuras
- Camada 2: Rochas vulcânicas, lava distante
- Camada 3: Pedras grandes, lava próxima, brilho laranja

**Começar com 2 cenários → depois expandir para 4-8.**

---

### 1.4. Buscar Assets (Tarefa Prática)

**PASSO A PASSO:**

1. **Acessar OpenGameArt:**
   - https://opengameart.org
   - Buscar: "mountain parallax layers"
   - Filtrar: "2D", "PNG"

2. **Baixar um pack completo** (procurar por "parallax background")
   - Exemplo: "Mountain Parallax Pack"
   - Deve ter pelo menos 3 camadas

3. **Organizar arquivos:**
   ```
   Downloads/
   └── mountain-parallax-pack/
       ├── layer-1-sky.png
       ├── layer-2-mountains.png
       ├── layer-3-foreground.png
       └── ...
   ```

4. **Renomear para padrão:**
   ```
   montanha-nevada/
   ├── layer-1-fundo.png
   ├── layer-2-meio.png
   └── layer-3-frente.png
   ```

5. **Otimizar tamanho** (TinyPNG):
   - https://tinypng.com
   - Upload cada PNG
   - Download versão comprimida

**Resultado esperado:** 3 PNGs de ~100-150KB cada.

---

## 📂 ETAPA 2: ESTRUTURA DE PASTAS

### 2.1. Criar Estrutura

**Executar no terminal:**
```bash
cd ~/Documents/ialume-factory
mkdir -p assets/backgrounds/montanha-nevada
mkdir -p assets/backgrounds/vulcao
```

**Estrutura final:**
```
ialume-factory/
├── assets/                    # ← NOVO!
│   └── backgrounds/
│       ├── montanha-nevada/
│       │   ├── layer-1-fundo.png
│       │   ├── layer-2-meio.png
│       │   └── layer-3-frente.png
│       └── vulcao/
│           ├── layer-1-fundo.png
│           ├── layer-2-meio.png
│           └── layer-3-frente.png
├── base/
├── mechanics/
├── modalities/
└── ...
```

### 2.2. Copiar Assets

**Copiar PNGs para as pastas:**
```bash
# Montanha nevada
cp ~/Downloads/montanha-nevada/*.png ~/Documents/ialume-factory/assets/backgrounds/montanha-nevada/

# Vulcão
cp ~/Downloads/vulcao/*.png ~/Documents/ialume-factory/assets/backgrounds/vulcao/
```

### 2.3. Commit Assets no Git

```bash
cd ~/Documents/ialume-factory
git add assets/
git commit -m "feat(assets): Add background layers for montanha-nevada and vulcao"
git push
```

**IMPORTANTE:** Assets vão para GitHub, mas ainda NÃO estão no CDN (faremos depois).

---

## 🎨 ETAPA 3: SISTEMA DE BACKGROUND

### 3.1. Entender a Arquitetura

**Fluxo:**
```
1. Game Engine inicializa escalada
   ↓
2. Passa config com cenário: { cenario: 'montanha-nevada' }
   ↓
3. escalada.js recebe config
   ↓
4. escalada.js chama injectBackground(cenario)
   ↓
5. injectBackground() cria 3 divs com background-image
   ↓
6. CSS posiciona camadas com z-index
```

### 3.2. Modificar escalada.js

**Localização:** `/mechanics/escalada.js`

**O que vamos adicionar:**
1. Propriedade `cenario` no objeto ESCALADA
2. Método `injectBackground(cenario)`
3. Método `moveParallax(step)`
4. CSS das camadas

**ANTES (linha ~10):**
```javascript
const ESCALADA = {
    name: 'escalada',
    currentStep: 0,
    totalSteps: 5,

    init: function(config) {
        console.log('🏔️ ESCALADA.init() chamado com config:', config);

        if (!config || !config.totalSteps) {
            console.error('❌ ERRO: config.totalSteps não fornecido!');
            return;
        }

        this.totalSteps = config.totalSteps;
        this.currentStep = 0;

        this.injectHTML();
        this.injectCSS();
        this.updatePosition();
    },
```

**DEPOIS (adicionar cenario):**
```javascript
const ESCALADA = {
    name: 'escalada',
    currentStep: 0,
    totalSteps: 5,
    cenario: 'montanha-nevada', // ← NOVO: cenário padrão

    init: function(config) {
        console.log('🏔️ ESCALADA.init() chamado com config:', config);

        if (!config || !config.totalSteps) {
            console.error('❌ ERRO: config.totalSteps não fornecido!');
            return;
        }

        this.totalSteps = config.totalSteps;
        this.currentStep = 0;
        this.cenario = config.cenario || 'montanha-nevada'; // ← NOVO: pegar do config

        console.log('🎨 Cenário escolhido:', this.cenario);

        this.injectBackground(); // ← NOVO: injetar backgrounds primeiro
        this.injectHTML();
        this.injectCSS();
        this.updatePosition();
    },
```

---

### 3.3. Criar Método injectBackground()

**Adicionar ANTES de `injectHTML()`:**

```javascript
// Injetar backgrounds com parallax
injectBackground: function() {
    const container = document.querySelector('.game-container');

    // Verificar se container existe
    if (!container) {
        console.warn('⚠️ .game-container não encontrado, tentando novamente...');
        setTimeout(() => this.injectBackground(), 100);
        return;
    }

    // Verificar se já existe (evitar duplicação)
    if (document.getElementById('escalada-background')) {
        console.log('⏭️ Background já injetado');
        return;
    }

    // URL base dos assets
    const CDN_BASE = 'https://brunoferrarisouza.github.io/ialume-factory/1.0.0/';
    const bgPath = `${CDN_BASE}assets/backgrounds/${this.cenario}/`;

    console.log('🎨 Injetando backgrounds de:', bgPath);

    // Criar estrutura HTML dos backgrounds
    const bgHTML = `
        <div id="escalada-background" class="escalada-background">
            <div class="bg-layer bg-layer-1"
                 style="background-image: url('${bgPath}layer-1-fundo.png')">
            </div>
            <div class="bg-layer bg-layer-2"
                 style="background-image: url('${bgPath}layer-2-meio.png')">
            </div>
            <div class="bg-layer bg-layer-3"
                 style="background-image: url('${bgPath}layer-3-frente.png')">
            </div>
        </div>
    `;

    // Injetar ANTES de tudo (para ficar atrás)
    container.insertAdjacentHTML('afterbegin', bgHTML);

    console.log('✅ Backgrounds injetados');
},
```

---

### 3.4. Adicionar CSS dos Backgrounds

**Adicionar no `injectCSS()` (dentro do style.textContent):**

```css
/* ===== BACKGROUNDS COM PARALLAX ===== */
.escalada-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 0; /* Atrás de tudo */
}

.bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%; /* 20% a mais para parallax */
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1); /* Suave */
}

.bg-layer-1 {
    z-index: 1; /* Mais atrás */
}

.bg-layer-2 {
    z-index: 2; /* Meio */
}

.bg-layer-3 {
    z-index: 3; /* Mais frente */
}

/* Container da montanha fica na frente dos backgrounds */
#escalada-container {
    position: absolute;
    right: 40px;
    top: 100px;
    bottom: 40px;
    width: 200px;
    z-index: 100; /* ← Na frente dos backgrounds */
    pointer-events: none;
}
```

---

## 🎬 ETAPA 4: PARALLAX

### 4.1. Entender o Movimento

**Conceito:**
```
Lume sobe de BASE (0%) até TOPO (100%)
↓
Backgrounds se movem junto, mas em velocidades diferentes:
- Camada 1 (fundo): 20% do movimento
- Camada 2 (meio): 50% do movimento
- Camada 3 (frente): 100% do movimento
```

**Exemplo:**
```
Lume subiu 50% da altura total
↓
Camada 1 move: 50% × 0.2 = 10%
Camada 2 move: 50% × 0.5 = 25%
Camada 3 move: 50% × 1.0 = 50%
```

---

### 4.2. Criar Método moveParallax()

**Adicionar em escalada.js:**

```javascript
// Mover backgrounds com parallax
moveParallax: function() {
    // Calcular progresso (0 a 1)
    const progress = this.currentStep / (this.totalSteps - 1);

    // Porcentagem de movimento (0% a 100%)
    const movePercent = progress * 100;

    // Aplicar parallax com velocidades diferentes
    const layer1 = document.querySelector('.bg-layer-1');
    const layer2 = document.querySelector('.bg-layer-2');
    const layer3 = document.querySelector('.bg-layer-3');

    if (layer1) {
        // Fundo: move devagar (20%)
        layer1.style.transform = `translateY(-${movePercent * 0.2}%)`;
    }

    if (layer2) {
        // Meio: move médio (50%)
        layer2.style.transform = `translateY(-${movePercent * 0.5}%)`;
    }

    if (layer3) {
        // Frente: move rápido (100%)
        layer3.style.transform = `translateY(-${movePercent * 1.0}%)`;
    }

    console.log(`🎬 Parallax: progresso ${Math.round(progress * 100)}%, move ${Math.round(movePercent)}%`);
},
```

**IMPORTANTE:** `translateY(-X%)` move para CIMA (negativo), criando efeito de subida.

---

### 4.3. Integrar Parallax com climb()

**Modificar método `climb()` para chamar parallax:**

**ANTES:**
```javascript
climb: function() {
    console.log('⬆️ climb() chamado...');

    if (this.currentStep >= this.totalSteps - 1) {
        console.log('🚫 Lume já está no topo!');
        return;
    }

    this.currentStep++;
    console.log('✅ Subindo para andar', this.currentStep);

    const lume = document.getElementById('lume-climber');
    lume.classList.add('climbing');

    this.createParticles();
    this.updatePosition(); // ← Atualiza posição do Lume

    // ... resto
},
```

**DEPOIS:**
```javascript
climb: function() {
    console.log('⬆️ climb() chamado...');

    if (this.currentStep >= this.totalSteps - 1) {
        console.log('🚫 Lume já está no topo!');
        return;
    }

    this.currentStep++;
    console.log('✅ Subindo para andar', this.currentStep);

    const lume = document.getElementById('lume-climber');
    lume.classList.add('climbing');

    this.createParticles();
    this.updatePosition(); // Atualiza Lume
    this.moveParallax();   // ← NOVO: Move backgrounds

    // ... resto
},
```

---

## 🔗 ETAPA 5: INTEGRAÇÃO COM GAME ENGINE

### 5.1. Passar Cenário no Config

**Modificar game-engine.js para passar cenário:**

**Localização:** `/base/scripts/game-engine.js` (linha ~40)

**ANTES:**
```javascript
if (gameConfig.mecanica && gameConfig.mecanica !== 'none') {
    const Mechanic = this.getMechanic(gameConfig.mecanica);
    if (Mechanic) {
        console.log('🎮 Inicializando mecânica:', gameConfig.mecanica);
        Mechanic.init({
            totalSteps: totalSteps
        });
    }
}
```

**DEPOIS:**
```javascript
if (gameConfig.mecanica && gameConfig.mecanica !== 'none') {
    const Mechanic = this.getMechanic(gameConfig.mecanica);
    if (Mechanic) {
        console.log('🎮 Inicializando mecânica:', gameConfig.mecanica);
        Mechanic.init({
            totalSteps: totalSteps,
            cenario: gameConfig.cenario || 'montanha-nevada' // ← NOVO
        });
    }
}
```

---

### 5.2. Claude Escolhe Cenário (Futuro)

**No GAME_DESIGNER (N8N), adicionar lógica:**

```javascript
// Mapear tema → cenário
const cenarios = {
    'matematica': 'montanha-nevada',
    'fisica': 'montanha-nevada',
    'quimica': 'vulcao',
    'ciencias': 'vulcao',
    'portugues': 'torre-livros',
    'biologia': 'arvore-gigante',
    'default': 'montanha-nevada'
};

const tema = analyzerOutput.conceito.toLowerCase();
const cenarioEscolhido = cenarios[tema] || cenarios.default;

// Adicionar ao JSON final
gameConfig.cenario = cenarioEscolhido;
```

**Por enquanto:** Hardcode `montanha-nevada` para testar.

---

## 🧪 ETAPA 6: TESTES

### 6.1. Checklist de Testes

**Teste 1: Assets Carregam**
- [ ] Abrir jogo
- [ ] Verificar console: "🎨 Injetando backgrounds de..."
- [ ] Ver se 3 camadas aparecem visualmente
- [ ] Verificar se não há erro 404 (assets não encontrados)

**Teste 2: Parallax Funciona**
- [ ] Jogar e acertar primeira pergunta
- [ ] Lume sobe E backgrounds se movem
- [ ] Camada 1 (fundo) move devagar
- [ ] Camada 3 (frente) move rápido
- [ ] Movimento é suave (não trava)

**Teste 3: Performance**
- [ ] FPS mantém 60 no desktop
- [ ] FPS mantém 30-60 no mobile
- [ ] Não há lag ao subir

**Teste 4: Z-index Correto**
- [ ] Backgrounds atrás da montanha
- [ ] Montanha na frente dos backgrounds
- [ ] Lume na frente de tudo
- [ ] Score/feedback visíveis

**Teste 5: Mobile**
- [ ] Parallax funciona no iPhone/Android
- [ ] Backgrounds responsivos
- [ ] Não quebra layout

---

### 6.2. Deploy para Testar

**Comandos:**
```bash
cd ~/Documents/ialume-factory

# 1. Copiar assets para CDN
cp -r assets/ 1.0.0/

# 2. Deploy code
npm run deploy && cp -r cdn/1.0.0/* 1.0.0/

# 3. Commit
git add .
git commit -m "feat(escalada): Add parallax backgrounds system"
git push

# 4. Aguardar GitHub Pages (~2 min)

# 5. Testar URL:
open https://brunoferrarisouza.github.io/ialume-factory/1.0.0/
```

---

## 🎯 RESULTADO ESPERADO

### Antes de Jogar:
```
Tela branca com montanha marrom
```

### Depois de Jogar:
```
Backgrounds bonitos de montanha com céu, nuvens, árvores
Ao subir, backgrounds se movem em parallax (sensação 3D)
Visual cinematográfico e imersivo
```

---

## 📝 PRÓXIMOS PASSOS (Após Essa Etapa)

1. **Adicionar 2º cenário (vulcão)**
2. **Partículas temáticas** (neve, lava)
3. **Sons ambiente** (opcional)
4. **Mais cenários** (torre, árvore)
5. **Otimizações** (lazy loading)

---

## 🆘 TROUBLESHOOTING

### Problema: "Assets não carregam (404)"
**Causa:** Path errado ou assets não estão no CDN
**Solução:**
```bash
# Verificar se assets estão em 1.0.0/
ls -la 1.0.0/assets/backgrounds/

# Verificar URL no navegador:
https://brunoferrarisouza.github.io/ialume-factory/1.0.0/assets/backgrounds/montanha-nevada/layer-1-fundo.png
```

### Problema: "Parallax não move"
**Causa:** moveParallax() não está sendo chamado
**Solução:** Verificar se `climb()` chama `this.moveParallax()`

### Problema: "Performance ruim (lag)"
**Causa:** Assets muito grandes
**Solução:** Comprimir PNGs com TinyPNG (< 150KB cada)

### Problema: "Z-index errado (backgrounds na frente)"
**Causa:** CSS z-index incorreto
**Solução:**
```css
.escalada-background { z-index: 0; }   /* Atrás */
#escalada-container { z-index: 100; }  /* Frente */
```

---

## ✅ CHECKLIST FINAL

**Antes de começar:**
- [ ] Ler documentação PIVOT-FOCO-ESCALADA.md
- [ ] Entender conceito de parallax
- [ ] Ter assets prontos (2 cenários, 3 camadas cada)

**Implementação:**
- [ ] Criar estrutura /assets/backgrounds/
- [ ] Copiar PNGs otimizados
- [ ] Modificar escalada.js (cenario, injectBackground, moveParallax)
- [ ] Adicionar CSS das camadas
- [ ] Integrar parallax com climb()
- [ ] Modificar game-engine.js (passar cenario)

**Deploy:**
- [ ] Copiar assets para 1.0.0/
- [ ] Deploy code
- [ ] Push para GitHub
- [ ] Aguardar GitHub Pages

**Testes:**
- [ ] Assets carregam (ver console)
- [ ] Parallax move ao subir
- [ ] Performance OK (60 FPS)
- [ ] Mobile funciona
- [ ] Z-index correto

---

**Pronto para começar?** 🚀

**Próximo comando:** Buscar assets no OpenGameArt!
