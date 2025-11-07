# ESPECIFICAÇÕES FINAIS - MECÂNICA ESCALADA

**Data:** 2025-11-06
**Status:** Em Implementação
**Arquivo:** `/mechanics/escalada.js`
**Teste:** `/tests/jogo-completo-geografia.html`

---

## 🎯 VISÃO GERAL

Jogo educacional de escalada vertical com 9 níveis, onde Lume sobe uma montanha coletando cristais ao responder perguntas corretamente, enquanto enfrenta 9 antagonistas progressivamente mais ameaçadores.

**Conceito:** Cada degrau tem 3 elementos flutuantes (Lume à esquerda, Cristal no centro, Antagonista à direita), com foco visual no cristal que é coletado ao acertar.

---

## 📐 LAYOUT E ESTRUTURA

### **Degraus (Plataformas)**

- **Quantidade:** 9 degraus
- **Posicionamento:** Todos centralizados horizontalmente (`left: 50%`)
- **Largura:** 80px (mantida do design anterior)
- **Distribuição vertical:**
  - Primeiro degrau: `bottom: 25%` (não 10% como antes)
  - Último degrau: `bottom: 75%` (não 90% como antes)
  - Degraus intermediários: Distribuídos linearmente entre 25% e 75%

**Cálculo de posição:**
```javascript
// Para 9 degraus entre 25% e 75%
const bottomPercent = 25 + ((floorNumber - 1) / 8) * 50;
```

**Motivo da mudança:** Evitar elementos muito próximos das bordas superior/inferior da tela.

---

### **Elementos por Degrau**

Cada degrau contém 3 elementos posicionados horizontalmente:

#### **1. LUME (Esquerda)**
- **Posição:** À esquerda do degrau, flutuando
- **Horizontal:** `left: calc(50% - 80px)`
- **Emoji:** 🌟
- **Tamanho:** 3rem
- **Animação:** `float` (sobe/desce suavemente)
- **Características:**
  - NÃO pousa no degrau (está ao lado flutuando)
  - Move-se para cima ao acertar
  - Shake ao errar

#### **2. CRISTAL (Centro)**
- **Posição:** Centralizado sobre o degrau
- **Horizontal:** `left: 50%` + `transform: translateX(-50%)`
- **Vertical:** `bottom: calc(platformBottom + 50px)` (logo acima da plataforma)
- **Emoji temporário:** 💎 (será substituído por asset)
- **Tamanho:** 2.5rem
- **Animações:**
  - `spin` - Rotação 360° contínua (2s)
  - `glow` - Brilho pulsante (1.5s)
- **Comportamento:**
  - **Acerto:** Voa para fora da tela (canto superior direito, 0.5s) + som de moeda
  - **Erro:** Fica parado no lugar
  - Único elemento que "pousa" visualmente no degrau

#### **3. ANTAGONISTA (Direita)**
- **Posição:** À direita do degrau, flutuando
- **Horizontal:** `left: calc(50% + 80px)`
- **Emojis (progressão de dificuldade):**
  1. 🦇 Morcego
  2. 🕷️ Aranha
  3. 🐍 Cobra
  4. 🦂 Escorpião
  5. 🐺 Lobo
  6. 🦉 Coruja (Umbra - meio do jogo)
  7. 🐉 Dragão
  8. 👹 Oni
  9. 😈 Demônio (boss final)
- **Tamanho:** 2.5rem
- **Animações:**
  - `levitate` - Levitação sutil (2s)
  - Animações específicas por tipo (blink, flap, etc.)
- **Características:**
  - NÃO pousa no degrau (flutua ao lado)
  - Cada emoji será substituído por sprite animado futuramente

---

### **Espaçamento Visual**

```
         [Lume]  ←80px→  [Degrau + Cristal]  ←80px→  [Antagonista]
           🌟              [====💎====]                    🦇
```

**Larguras:**
- Lume: 48px (3rem)
- Espaço: 80px
- Degrau: 80px (cristal centralizado)
- Espaço: 80px
- Antagonista: 40px (2.5rem)

**Total horizontal:** ~328px (cabe confortavelmente em 320px mobile)

---

## 🏔️ MONTANHA DE FUNDO

### **Aparência**

- **Cor:** Marrom (em vez de cinza)
  - Base: `#D2691E` (chocolate claro)
  - Topo: `#8B4513` (saddle brown escuro)
  - Gradiente: `linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #D2691E 100%)`
- **Textura:** SVG pattern com linhas irregulares (mantido do design anterior)
- **Forma:** Clip-path polygon (base larga, pico estreito)
- **Altura:** 300vh (muito alta para permitir parallax)

### **Hierarquia Visual**

- **Z-index:** 0.5 ou 1 (ATRÁS de todos os elementos do jogo)
- **Camadas (de trás para frente):**
  1. **z-index: 0.5** - Montanha central gigante (marrom)
  2. **z-index: 1** - Layer 1 (céu)
  3. **z-index: 2** - Layer 2 (montanhas distantes)
  4. **z-index: 3** - Layer 3 (montanhas próximas)
  5. **z-index: 5** - Decorações (nuvens, pássaros)
  6. **z-index: 100** - Degraus
  7. **z-index: 101** - Lume
  8. **z-index: 102** - Antagonistas
  9. **z-index: 103** - Cristais

**Motivo:** Montanha deve ser elemento de fundo sutil, não chamar atenção.

---

## 🎬 ANIMAÇÃO INICIAL (INTRO)

### **Sequência da Câmera**

1. **Estado inicial (ao carregar):**
   - Container `.mountain` está em `transform: translateY(-150%)`
   - Jogador vê apenas o cume da montanha (degrau 9 + boss final)
   - Fade-in suave do cenário

2. **Ao clicar "Começar Aventura":**
   - Câmera "desce" suavemente em 3 segundos
   - Movimento: `translateY(-150%)` → `translateY(0)`
   - Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` (suave e cinematográfico)
   - Durante descida: Parallax backgrounds se ajustam

3. **Fim da descida:**
   - Câmera para no primeiro degrau
   - Lume aparece com animação `jumpIn`
   - Primeira pergunta é exibida

### **Implementação Técnica**

```javascript
// Em startGame() (jogo-completo-geografia.html)
function startGame() {
    // 1. Esconder fase 0
    document.getElementById('phase-0').classList.remove('active');

    // 2. Inicializar game engine
    const success = GAME_ENGINE.init(gameConfig);

    if (success) {
        // 3. Posicionar câmera no topo
        const mountain = document.querySelector('.mountain');
        mountain.style.transform = 'translateY(-150%)';
        mountain.style.transition = 'none';

        setTimeout(() => {
            // 4. Animar descida da câmera (3s)
            mountain.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            mountain.style.transform = 'translateY(0)';
        }, 100);

        // 5. Após 3s, mostrar primeira fase
        setTimeout(() => {
            nextPhase();
        }, 3200);
    }
}
```

---

## 💎 SISTEMA DE CRISTAIS

### **Comportamento ao Acertar**

1. **Detecção:**
   - `ESCALADA.onCorrect()` é chamado quando jogador acerta
   - Identifica cristal do degrau atual

2. **Animação de coleta (0.5s):**
   ```javascript
   collectCrystal(currentFloor) {
       const crystal = document.querySelector(`.crystal[data-floor="${currentFloor}"]`);

       // Som de moeda
       playSound('coin');

       // Posição inicial (centro do degrau)
       const startX = crystal.getBoundingClientRect().left;
       const startY = crystal.getBoundingClientRect().top;

       // Posição final (fora da tela, canto superior direito)
       const endX = window.innerWidth + 50;
       const endY = -50;

       // Animar
       crystal.style.position = 'fixed';
       crystal.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
       crystal.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.5) rotate(360deg)`;
       crystal.style.opacity = '0';

       // Remover após animação
       setTimeout(() => crystal.remove(), 500);

       // Incrementar contador
       gameState.crystalsCollected++;
       updateCrystalCounter();
   }
   ```

3. **Trajetória:**
   - Curva suave (Bezier easing com bounce)
   - Rotação 360° durante voo
   - Scale diminui (1 → 0.5)
   - Fade out no final

### **Comportamento ao Errar**

- Cristal **permanece** no degrau
- Sem animação
- Jogador pode tentar novamente (se mecânica permitir)

---

## 🎮 CONTADOR DE CRISTAIS

### **Posicionamento**

- **Local:** Canto superior direito
- **CSS:**
  ```css
  #crystal-counter {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 1.5rem;
      font-weight: bold;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }
  ```

### **Formato**

```
💎 x 5/9
```

- Emoji cristal
- "x" separador
- Cristais coletados / Total (sempre 9)

### **Atualização**

```javascript
function updateCrystalCounter() {
    const counter = document.getElementById('crystal-counter');
    const collected = gameState.crystalsCollected;
    const total = gameState.totalPhases - 1; // -1 porque fase 0 é abertura

    counter.textContent = `💎 x ${collected}/${total}`;

    // Animação pulse ao coletar
    counter.classList.add('pulse');
    setTimeout(() => counter.classList.remove('pulse'), 300);
}
```

---

## 🔊 SISTEMA DE SOM

### **Estrutura de Diretórios (futura)**

```
/assets/sounds/
├── coin.mp3              # Som ao coletar cristal
├── success.mp3           # Som ao acertar (já existe)
├── error.mp3             # Som ao errar (já existe)
└── background-music.mp3  # Música de fundo
```

### **Implementação**

#### **Web Audio API (sons curtos)**

```javascript
const soundEffects = {
    coin: null,
    success: null,
    error: null
};

function loadSounds() {
    // Carregar sons (placeholder por enquanto)
    soundEffects.coin = new Audio('../assets/sounds/coin.mp3');
    soundEffects.success = new Audio('../assets/sounds/success.mp3');
    soundEffects.error = new Audio('../assets/sounds/error.mp3');
}

function playSound(soundName) {
    if (soundEffects[soundName]) {
        soundEffects[soundName].currentTime = 0; // Reset
        soundEffects[soundName].play().catch(err => {
            console.warn('Não foi possível tocar som:', err);
        });
    } else {
        console.log(`🔇 Som "${soundName}" não carregado (placeholder)`);
    }
}
```

#### **Música de Fundo (loop)**

```javascript
let backgroundMusic = null;

function startBackgroundMusic() {
    backgroundMusic = new Audio('../assets/sounds/background-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // 30% volume

    // Só toca após interação do usuário (requisito do navegador)
    document.addEventListener('click', function playOnce() {
        backgroundMusic.play().catch(err => {
            console.warn('Música de fundo bloqueada:', err);
        });
        document.removeEventListener('click', playOnce);
    }, { once: true });
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}
```

### **Chamadas de Som**

- **Cristal coletado:** `playSound('coin')` em `collectCrystal()`
- **Acerto:** `playSound('success')` em `onCorrect()`
- **Erro:** `playSound('error')` em `onWrong()`
- **Música:** `startBackgroundMusic()` ao clicar "Começar Aventura"

### **Fallback (sem assets)**

Por enquanto (sem arquivos de áudio):
- Funções existem mas não tocam nada
- Console log indicando que som seria tocado
- Jogo funciona normalmente sem áudio
- Fácil adicionar assets depois (drop MP3 files na pasta)

---

## 📊 PARALLAX E MOVIMENTAÇÃO

### **Ajuste de Movimento (máximo 50%)**

**Antes:**
- Layer 1 (céu): 5% de movimento
- Layer 2 (montanhas distantes): 15%
- Montanha central: 10%
- Layer 3 (montanhas próximas): 30%

**Problema:** Sobrava espaço branco no fim (imagens "acabavam")

**Depois (ajustado para 50% máximo):**
- Layer 1 (céu): 2.5% de movimento
- Layer 2 (montanhas distantes): 7.5%
- Montanha central: 5%
- Layer 3 (montanhas próximas): 25%

**Cálculo:**
```javascript
moveParallax: function() {
    const progress = this.currentStep / (this.totalSteps - 1);
    const movePercent = progress * 100; // 0 → 100%

    // Dividir por 2 para não exceder 50%
    if (layer1) layer1.style.transform = `translateY(${movePercent * 0.025}%)`;
    if (layer2) layer2.style.transform = `translateY(${movePercent * 0.075}%)`;
    if (centralMountain) centralMountain.style.transform = `translateX(-50%) translateY(${movePercent * 0.05}%)`;
    if (layer3) layer3.style.transform = `translateY(${movePercent * 0.25}%)`;
}
```

**Resultado:** Imagens duram exatamente até o fim do jogo (degrau 9) sem sobrar espaço.

---

## 🎨 HIERARQUIA VISUAL COMPLETA

**Z-index layers (de trás para frente):**

```
0.5  - Montanha central (marrom, muito atrás)
1    - Background layer 1 (céu)
2    - Background layer 2 (montanhas distantes)
3    - Background layer 3 (montanhas próximas)
5    - Decorações (nuvens, pássaros)
100  - Degraus (plataformas)
101  - Lume
102  - Antagonistas
103  - Cristais
9999 - UI (contador de cristais, popups de feedback)
```

**Regras:**
- Montanha SEMPRE atrás de tudo (não obstrui gameplay)
- Cristais na frente (foco visual principal)
- UI sempre no topo (não obstruída)

---

## 📱 RESPONSIVIDADE

### **Breakpoints**

#### **Desktop (> 768px)**
- Degraus: 80px largura
- Lume: 3rem (48px)
- Cristais: 2.5rem (40px)
- Antagonistas: 2.5rem (40px)
- Espaçamento: 80px entre elementos

#### **Mobile (≤ 768px)**
- Degraus: 60px largura (redução de 25%)
- Lume: 2rem (32px)
- Cristais: 1.8rem (29px)
- Antagonistas: 1.8rem (29px)
- Espaçamento: 60px entre elementos

### **Ajustes Mobile**

```css
@media (max-width: 768px) {
    .floor-platform {
        width: 60px;
        height: 30px;
    }

    .lume-climber {
        font-size: 2rem;
        left: calc(50% - 60px);
    }

    .crystal {
        font-size: 1.8rem;
    }

    .antagonist {
        font-size: 1.8rem;
        left: calc(50% + 60px);
    }
}
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO

### **ETAPA 1: Layout Base (1-2h)**

**Arquivos modificados:**
- `/mechanics/escalada.js`

**Mudanças:**
1. Centralizar todos os 9 degraus (CSS)
2. Ajustar bordas para 25% e 75%
3. Posicionar Lume à esquerda (`calc(50% - 80px)`)
4. Mudar cor da montanha para marrom
5. Ajustar z-index da montanha para 0.5

**Teste:**
- Recarregar jogo
- Verificar que degraus estão centralizados
- Verificar que Lume fica à esquerda
- Verificar montanha marrom atrás de tudo

---

### **ETAPA 2: Elementos Visuais (2-3h)**

**Arquivos modificados:**
- `/mechanics/escalada.js`

**Mudanças:**
1. Adicionar cristais (💎) em cada degrau
   - HTML: Loop em `generateFloors()`
   - CSS: Animações `spin` + `glow`
2. Adicionar 9 antagonistas à direita
   - HTML: Array de emojis injetado
   - CSS: Posicionamento + animação `levitate`
3. Criar contador de cristais
   - HTML: `#crystal-counter` fixo no topo direito
   - JS: `gameState.crystalsCollected = 0`
   - Função: `updateCrystalCounter()`

**Teste:**
- Verificar cristais girando em cada degrau
- Verificar antagonistas à direita
- Verificar contador no canto superior direito

---

### **ETAPA 3: Animações Dinâmicas (2-3h)**

**Arquivos modificados:**
- `/mechanics/escalada.js`
- `/tests/jogo-completo-geografia.html`

**Mudanças:**
1. Implementar animação de intro (câmera descendo)
   - Função: `startCameraIntro()`
   - Trigger: Ao clicar "Começar"
2. Implementar cristal voando ao acertar
   - Função: `collectCrystal(floorNumber)`
   - Animação: Bezier curve para canto superior direito
3. Sistema de som
   - Funções: `loadSounds()`, `playSound()`, `startBackgroundMusic()`
   - Placeholders por enquanto (sem arquivos MP3)
4. Ajustar parallax para máximo 50%
   - Modificar multiplicadores em `moveParallax()`

**Teste:**
- Ver intro (câmera descendo)
- Coletar cristal ao acertar (voa + contador atualiza)
- Verificar cristal parado ao errar
- Verificar logs de som no console

---

## 📝 NOTAS TÉCNICAS

### **Performance**

- Todos os elementos usam `transform` e `opacity` (GPU-accelerated)
- `will-change: transform` para animações frequentes
- Cristais removidos do DOM após coleta (não acumulam)
- Máximo 9 antagonistas simultaneamente (baixo overhead)

### **Compatibilidade**

- Web Audio API: Chrome 34+, Firefox 25+, Safari 6+
- CSS transforms: Todos navegadores modernos
- Emojis: Fallback para textos se não suportado

### **Futura Substituição de Assets**

Quando tiver sprites:
1. Cristais: Substituir `💎` por `<img src="crystal.gif">`
2. Antagonistas: Substituir emojis por spritesheets animados
3. Sons: Adicionar arquivos MP3/OGG na pasta `/assets/sounds/`

Mudanças mínimas no código (apenas trocar emoji por tag `<img>`).

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após completar todas as etapas, validar:

**Layout:**
- [ ] 9 degraus centralizados
- [ ] Bordas em 25% e 75%
- [ ] Lume à esquerda do degrau
- [ ] Cristal centralizado sobre degrau
- [ ] Antagonista à direita do degrau
- [ ] Montanha marrom atrás de tudo

**Animações:**
- [ ] Intro: Câmera desce em 3s
- [ ] Cristais girando e brilhando
- [ ] Cristal voa ao acertar (0.5s)
- [ ] Cristal fica parado ao errar
- [ ] Lume sobe ao acertar
- [ ] Lume shake ao errar

**Elementos:**
- [ ] 9 antagonistas únicos (🦇🕷️🐍🦂🐺🦉🐉👹😈)
- [ ] Contador de cristais no canto superior direito
- [ ] Formato correto: 💎 x 5/9

**Som (preparado, mesmo sem assets):**
- [ ] Função `playSound('coin')` pronta
- [ ] Função `startBackgroundMusic()` pronta
- [ ] Fallback silencioso funcionando
- [ ] Console logs indicando sons

**Parallax:**
- [ ] Máximo 50% de movimento
- [ ] Sem espaço branco ao final
- [ ] Montanha central move 5%

**Responsivo:**
- [ ] Desktop: elementos em tamanho normal
- [ ] Mobile: elementos reduzidos proporcionalmente
- [ ] Layout não quebra em 320px

---

## 🔗 REFERÊNCIAS

**Arquivos relacionados:**
- `/mechanics/escalada.js` - Mecânica principal
- `/tests/jogo-completo-geografia.html` - Jogo de teste
- `/assets/backgrounds/escalada/` - Assets de fundo
- `/assets/decorations/` - Decorações (nuvens, pássaros)

**Documentação:**
- `CLAUDE.md` - Contexto geral do projeto
- `CHECKPOINT.md` - Status atual
- `.clauderules` - Regras de modificação

---

**Última atualização:** 2025-11-06
**Próxima revisão:** Após completar Etapa 3

