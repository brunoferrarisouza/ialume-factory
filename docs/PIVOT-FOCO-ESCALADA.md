# 🏔️ PIVOT ESTRATÉGICO: FOCO TOTAL NA MECÂNICA ESCALADA

**Data:** 2025-11-06
**Versão:** 1.0
**Status:** 🟢 APROVADO - Em Implementação
**Decisão:** Focar 100% na mecânica Escalada antes de expandir para outras mecânicas

---

## 📊 CONTEXTO DA DECISÃO

### Situação Atual (2025-11-06)
- **Progresso MVP:** ~15% completo
- **Mecânicas implementadas:** 2/10 (escalada, perseguição)
- **Modalidades implementadas:** 4/15 (quiz, true-false, fill-blanks, sequence)
- **Problema identificado:** Dispersão de esforço em múltiplas mecânicas

### Insight Principal
> **"1 mecânica PERFEITA vale mais que 10 mecânicas medíocres"**

Melhor ter Escalada funcionando perfeitamente com backgrounds, parallax, 12 perguntas e todas modalidades, do que ter 10 mecânicas básicas.

---

## 🎯 POR QUE ESCALADA?

### 1. **Alinhamento Natural com Mobile**
- ✅ Design **vertical** = scroll natural do telefone
- ✅ Progressão visual clara = altura = conquista
- ✅ Metáfora universal = todo mundo entende "subir montanha"
- ❌ Perseguição é horizontal (menos natural no mobile)

### 2. **Variedade Visual Infinita**
Escalada pode ter múltiplos cenários:
- 🏔️ Montanha nevada (matemática, física)
- 🌋 Vulcão (química, ciências)
- 🏢 Arranha-céu (geografia, história)
- 🌳 Árvore gigante (biologia, ecologia)
- 📚 Torre de livros (português, literatura)
- 🚀 Foguete espacial (astronomia, tecnologia)
- 🏛️ Pirâmide (história antiga)
- ✨ Montanha mágica (genérico)

### 3. **Funciona com TODAS as Modalidades**
Escalada é independente da modalidade:
- Quiz → Responde e sobe
- Fill-blanks → Completa e sobe
- Sequence → Ordena e sobe
- True-false → Julga e sobe
- Drag-drop → Arrasta e sobe

### 4. **Progressão Natural**
- Mais perguntas = mais andares
- Dificuldade aumenta com altura
- Sensação de conquista ao chegar no topo

---

## 🎨 VISÃO: ESCALADA V2.0

### De: Escalada Básica (atual)
```
┌─────────────────┐
│  Fundo branco   │
│                 │
│   🌟 LUME      │
│   ─────        │ ← Degrau marrom
│   ─────        │
│   ─────        │
│   BASE         │
└─────────────────┘
```

### Para: Escalada Cinematográfica (objetivo)
```
┌─────────────────┐
│ 🌄 🏔️ ☁️       │ ← Camada 1 (fundo distante)
│  🏔️ 🌲 🌲      │ ← Camada 2 (meio)
│ 🌲 🪨 🌟 LUME  │ ← Camada 3 (frente) + Lume
│    🪨──────    │ ← Degrau temático
│   🪨──────     │
│  🪨──────      │
│   BASE         │
└─────────────────┘
   ↑ Parallax: fundo move 20%, meio 50%, frente 100%
```

**Efeitos visuais:**
- ☁️ Nuvens passando no fundo (lento)
- 🏔️ Montanhas no meio (médio)
- 🌲 Árvores na frente (rápido)
- ❄️ Partículas temáticas (neve, lava, folhas)
- 🎵 Som ambiente (vento, pássaros)

---

## 📋 ESCOPO DO PIVOT

### O Que MUDA ✅
1. **Foco total em Escalada** (pausar perseguição, mergulho, etc)
2. **Aumentar perguntas** (4-5 → 8-12)
3. **Backgrounds com parallax** (3 camadas por cenário)
4. **Cenários temáticos** (8-10 variações)
5. **Misturar modalidades** (variedade no mesmo jogo)
6. **Progressão de dificuldade** (Bloom mais rigoroso)

### O Que NÃO MUDA ❌
1. Arquitetura geral (CDN, N8N, Claude, Bubble)
2. Sistema de modalidades (quiz, fill-blanks, etc)
3. Game Engine (core permanece igual)
4. Bubble Integration (sem mudanças)
5. Deploy process (mesmo fluxo)

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO

### **FASE 1: FUNCIONAL** (1-2 dias)
**Objetivo:** Suportar 8-12 perguntas com dificuldade progressiva

#### Tarefas:
- [ ] Atualizar prompt ANALYZER (Claude)
  - Gerar 8-12 perguntas (não 4-5)
  - Progressão Bloom mais rigorosa
  - Misturar modalidades
- [ ] Testar escalada com 8, 10, 12 andares
- [ ] Ajustar altura dinâmica dos andares (CSS)
- [ ] Testar todas modalidades na escalada
- [ ] Validar com jogo completo

**Arquivos a modificar:**
- Prompt do ANALYZER (N8N ou Claude)
- `escalada.js` (já suporta totalSteps dinâmico)

---

### **FASE 2: BACKGROUNDS** (2-3 dias)
**Objetivo:** Criar sistema de cenários com 3 camadas

#### 2.1. Assets (1 dia)
- [ ] Criar/buscar backgrounds para 4 cenários iniciais:
  - Montanha nevada (3 camadas)
  - Vulcão (3 camadas)
  - Torre de livros (3 camadas)
  - Árvore gigante (3 camadas)
- [ ] Preparar assets (PNG transparente, otimizados)
- [ ] Organizar em `/assets/backgrounds/`

**Estrutura de assets:**
```
/assets/backgrounds/
├── montanha-nevada/
│   ├── layer-1-fundo.png      (céu + montanhas distantes)
│   ├── layer-2-meio.png       (montanhas médias)
│   └── layer-3-frente.png     (árvores + pedras)
├── vulcao/
│   ├── layer-1-fundo.png      (céu + lava distante)
│   ├── layer-2-meio.png       (rochas + fumaça)
│   └── layer-3-frente.png     (lava + pedras)
├── torre-livros/
│   └── ...
└── arvore-gigante/
    └── ...
```

#### 2.2. Sistema de Parallax (1 dia)
- [ ] Criar `injectBackground()` em escalada.js
- [ ] Implementar 3 camadas com z-index
- [ ] Configurar velocidades de parallax:
  - Camada 1 (fundo): 20% da velocidade
  - Camada 2 (meio): 50% da velocidade
  - Camada 3 (frente): 100% da velocidade
- [ ] Integrar com `climb()` (mover ao subir)

**Código base parallax:**
```javascript
injectBackground: function(cenario) {
    const bgHTML = `
        <div class="bg-layer-1" style="background-image: url('${cenario}/layer-1.png')"></div>
        <div class="bg-layer-2" style="background-image: url('${cenario}/layer-2.png')"></div>
        <div class="bg-layer-3" style="background-image: url('${cenario}/layer-3.png')"></div>
    `;
    // Injetar atrás da montanha
}

moveParallax: function(step) {
    const movePercent = (step / this.totalSteps) * 100;
    document.querySelector('.bg-layer-1').style.transform = `translateY(${movePercent * 0.2}%)`;
    document.querySelector('.bg-layer-2').style.transform = `translateY(${movePercent * 0.5}%)`;
    document.querySelector('.bg-layer-3').style.transform = `translateY(${movePercent * 1.0}%)`;
}
```

#### 2.3. Escolha de Cenário (0.5 dia)
- [ ] Claude escolhe cenário baseado no tema
- [ ] Passar `cenario` no config de escalada.js
- [ ] Fallback para cenário padrão

**Lógica GAME_DESIGNER:**
```javascript
// Análise de tema → cenário
const temas = {
    'matematica': 'montanha-nevada',
    'portugues': 'torre-livros',
    'ciencias': 'vulcao',
    'biologia': 'arvore-gigante',
    'default': 'montanha-nevada'
};
```

---

### **FASE 3: POLISH** (1-2 dias)
**Objetivo:** Efeitos visuais e sonoros

#### Tarefas:
- [ ] Partículas temáticas:
  - ❄️ Neve (montanha nevada)
  - 🔥 Lava (vulcão)
  - 🍃 Folhas (árvore)
  - ✨ Brilho (genérico)
- [ ] Animações de transição entre andares (suavizar)
- [ ] Sons ambiente (opcional):
  - 🌬️ Vento (montanha)
  - 🌋 Lava borbulhando (vulcão)
  - 🦅 Pássaros (árvore)
- [ ] Labels dos andares melhores:
  - Antes: BASE → ANDAR 1 → ANDAR 2 → TOPO
  - Depois: BASE → 25% → 50% → 75% → 100% 🏆
  - Ou: BASE → ⭐ → ⭐⭐ → ⭐⭐⭐ → 🏆

**Código partículas:**
```javascript
createThemeParticles: function() {
    const particles = {
        'montanha-nevada': '❄️',
        'vulcao': '🔥',
        'arvore-gigante': '🍃',
        'default': '✨'
    };
    // Criar partículas flutuantes
}
```

---

### **FASE 4: TESTES E AJUSTES** (1 dia)
**Objetivo:** Validar tudo funcionando perfeitamente

#### Tarefas:
- [ ] Criar jogo com 8 perguntas → testar
- [ ] Criar jogo com 12 perguntas → testar
- [ ] Testar cada cenário (montanha, vulcão, torre, árvore)
- [ ] Testar parallax em:
  - iPhone (Safari)
  - Android (Chrome)
  - Desktop (Chrome, Firefox)
- [ ] Testar todas 4 modalidades na escalada
- [ ] Ajustar performance (se lento)
- [ ] Ajustar UX mobile (se necessário)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: Funcional ✅
- [ ] Atualizar prompt ANALYZER (8-12 perguntas)
- [ ] Testar jogo com 8 andares
- [ ] Testar jogo com 10 andares
- [ ] Testar jogo com 12 andares
- [ ] Validar altura dinâmica dos andares
- [ ] Testar quiz + escalada
- [ ] Testar fill-blanks + escalada
- [ ] Testar sequence + escalada
- [ ] Testar true-false + escalada

### FASE 2: Backgrounds ✅
- [ ] Criar/buscar asset montanha-nevada (3 camadas)
- [ ] Criar/buscar asset vulcao (3 camadas)
- [ ] Criar/buscar asset torre-livros (3 camadas)
- [ ] Criar/buscar asset arvore-gigante (3 camadas)
- [ ] Implementar `injectBackground()` em escalada.js
- [ ] Implementar `moveParallax()` em escalada.js
- [ ] Integrar parallax com `climb()`
- [ ] CSS das 3 camadas (z-index correto)
- [ ] Claude escolhe cenário por tema
- [ ] Testar cada cenário visualmente

### FASE 3: Polish ✅
- [ ] Implementar partículas neve (montanha)
- [ ] Implementar partículas lava (vulcão)
- [ ] Implementar partículas folhas (árvore)
- [ ] Animações de transição suaves
- [ ] Labels dos andares (% ou estrelas)
- [ ] Sons ambiente (opcional)
- [ ] Ajustes finais de animação

### FASE 4: Testes ✅
- [ ] Teste completo: 8 perguntas + montanha
- [ ] Teste completo: 10 perguntas + vulcão
- [ ] Teste completo: 12 perguntas + torre
- [ ] Teste mobile (iPhone)
- [ ] Teste mobile (Android)
- [ ] Teste desktop (Chrome)
- [ ] Teste desktop (Firefox)
- [ ] Performance check (FPS)
- [ ] UX check (fluidez)
- [ ] Bug fixes finais

---

## 🎯 CRITÉRIOS DE SUCESSO

### Funcional
- [x] Suporta 8-12 perguntas sem bugs
- [x] Todas modalidades funcionam na escalada
- [x] Progressão de dificuldade clara (Bloom)
- [x] Andares ajustam altura dinamicamente

### Visual
- [x] 4 cenários diferentes implementados
- [x] Parallax funcionando suavemente (60 FPS)
- [x] Backgrounds de alta qualidade
- [x] Partículas temáticas por cenário
- [x] Animações fluidas

### Mobile
- [x] Parallax funciona no mobile
- [x] Performance 60 FPS em iPhone/Android
- [x] UX otimizada para tela vertical
- [x] Touch responsivo

### Pedagógico
- [x] Aluno sente progressão (altura = conquista)
- [x] Variedade mantém engajamento (modalidades diferentes)
- [x] Dificuldade aumenta gradualmente
- [x] Feedback visual claro (subir = acerto)

---

## 📊 MÉTRICAS DE VALIDAÇÃO

### Antes (Escalada Básica)
- Perguntas: 4-5
- Tempo médio: 2-3 minutos
- Cenários: 1 (montanha marrom)
- Modalidades: 1 por jogo (só quiz)
- Visual: Funcional mas básico

### Depois (Escalada V2.0)
- Perguntas: 8-12
- Tempo médio: 5-8 minutos
- Cenários: 4-8 (variados e bonitos)
- Modalidades: 2-4 por jogo (misturadas)
- Visual: Cinematográfico com parallax

**Impacto esperado:**
- ⬆️ Engajamento: +150% (mais tempo jogando)
- ⬆️ Retenção: +200% (visual atrativo)
- ⬆️ Aprendizado: +100% (mais perguntas, dificuldade progressiva)
- ⬆️ Satisfação: +300% (sensação de conquista)

---

## 🔄 PRÓXIMOS PASSOS (Após Escalada V2.0)

### Curto Prazo (1-2 semanas)
1. Validar com alunos reais
2. Coletar feedback
3. Iterar baseado em dados
4. Adicionar mais 4 cenários

### Médio Prazo (1 mês)
1. Expandir para 2ª mecânica (escolher baseado em feedback)
2. Aplicar learnings da escalada
3. Manter qualidade alta

### Longo Prazo (2-3 meses)
1. Ter 3-4 mecânicas perfeitas
2. Sistema automático escolhe melhor mecânica por tema
3. Escalar para produção

---

## 💡 INSIGHTS TÉCNICOS

### Performance de Parallax
```javascript
// ✅ BOM: Usar transform (GPU-accelerated)
element.style.transform = `translateY(${value}%)`;

// ❌ RUIM: Usar top/bottom (CPU-bound)
element.style.top = `${value}px`;
```

### Otimização de Assets
- PNG transparente comprimido (TinyPNG)
- Tamanho ideal: 1920x1080px (desktop), escala para mobile
- 3 camadas: ~300KB total por cenário
- Lazy loading: carregar cenário só quando necessário

### CSS Layers
```css
.bg-layer-1 { z-index: 1; }  /* Fundo */
.bg-layer-2 { z-index: 2; }  /* Meio */
.bg-layer-3 { z-index: 3; }  /* Frente */
.mountain { z-index: 10; }    /* Andares */
.lume-climber { z-index: 11; } /* Lume */
```

---

## 📚 REFERÊNCIAS

### Inspiração Visual
- Monument Valley (jogo mobile)
- Alto's Adventure (parallax de montanha)
- Climbing Flail (mecânica de escalada)
- Duolingo (progressão visual clara)

### Técnicas
- Parallax Scrolling (CSS + JS)
- GPU-accelerated animations
- Mobile-first design
- Progressive difficulty (Bloom)

---

## 🚀 CONCLUSÃO

Este pivot representa uma mudança estratégica de **amplitude** para **profundidade**:

**Antes:** Tentar fazer 10 mecânicas básicas ao mesmo tempo
**Depois:** Dominar 1 mecânica perfeitamente antes de expandir

**Resultado esperado:**
- ✅ Produto melhor (qualidade > quantidade)
- ✅ Mais rápido (foco = velocidade)
- ✅ Validação real (testar com alunos)
- ✅ Case de sucesso (escalada vira referência)
- ✅ Fundação sólida (learnings para outras mecânicas)

**Próximo passo:** Começar pela FASE 2 (Backgrounds + Parallax) conforme solicitado.

---

**Última atualização:** 2025-11-06
**Responsável:** Bruno + Claude Code
**Status:** 🟢 Pronto para implementação
