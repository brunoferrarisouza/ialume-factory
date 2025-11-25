# 🎨 ASSET FARMING BRIEF - iAlume Factory

**Data:** 2025-11-07
**Objetivo:** Gerar assets verticais (backgrounds + decorations) para mecânicas de progressão vertical

---

## 📂 ESTRUTURA DE PASTAS

```
/assets/
├── backgrounds/          ← Cenários parallax (3-4 camadas)
│   ├── escalada/        ✅ COMPLETO (exemplo de referência)
│   ├── montanha-nevada/ ⚠️ VAZIO - POPULAR
│   ├── vulcao/          ⚠️ VAZIO - POPULAR
│   ├── torre-livros/    ⚠️ VAZIO - POPULAR
│   └── arvore-gigante/  ⚠️ VAZIO - POPULAR
│
├── decorations/         ← Elementos animados
│   ├── clouds/          ✅ COMPLETO (nuvens)
│   └── birds/           ✅ COMPLETO (pássaros)
│
├── cliffs/              ← Paredes/estruturas verticais
└── tiles/               ← Blocos repetíveis
```

---

## 🎯 TAREFA PRINCIPAL

**Gerar assets para 4 cenários vazios:**

1. **montanha-nevada/** - Montanha com neve, clima frio
2. **vulcao/** - Vulcão ativo, lava, clima quente
3. **torre-livros/** - Torre mágica feita de livros empilhados
4. **arvore-gigante/** - Árvore gigante mística, clima fantasia

---

## 📋 PADRÃO DE ASSETS (usar /escalada/ como referência)

### **Backgrounds Parallax (3-4 camadas PNG)**

**Nomenclatura obrigatória:**
```
{cenario}-layer-1.png   ← Céu/fundo (mais distante)
{cenario}-layer-2.png   ← Montanhas/estruturas médias
{cenario}-layer-3.png   ← Elementos próximos
{cenario}-layer-4.png   ← Opcional: elementos muito próximos
```

**Exemplo real (de /escalada/):**
```
escalada/
├── bg03-layer-1.png   (céu)
├── bg03-layer-2.png   (montanhas distantes)
├── bg03-layer-3.png   (montanhas próximas)
├── desert-layer-1.png (céu deserto)
├── desert-layer-2.png (dunas distantes)
├── desert-layer-3.png (dunas próximas)
├── desert-layer-4.png (rochas muito próximas)
```

**Especificações técnicas:**
- **Formato:** PNG com transparência (alpha channel)
- **Tamanho:** 1920x1080 ou maior
- **Camadas:** Separadas para efeito parallax
- **Estilo:** Cartoon/flat design, cores vibrantes
- **Orientação:** Vertical (progressão de baixo para cima)

---

## 🎨 DIRETRIZES DE DESIGN

### **1. MONTANHA-NEVADA**
**Tema:** Frio, neve, clima alpino

**Layer 1 (céu):**
- Céu azul claro/cinza frio
- Nuvens brancas/cinzas
- Sol fraco ou nevasca leve

**Layer 2 (montanhas distantes):**
- Picos nevados ao fundo
- Tons azulados (perspectiva atmosférica)
- Silhuetas de montanhas

**Layer 3 (montanha principal):**
- Rocha escura + neve
- Detalhes: pinheiros, gelo
- Textura de neve acumulada

**Layer 4 (opcional):**
- Galhos de pinheiros
- Flocos de neve grandes
- Rochas próximas com gelo

---

### **2. VULCAO**
**Tema:** Quente, lava, perigo

**Layer 1 (céu):**
- Céu vermelho/laranja
- Nuvens de fumaça/cinzas
- Sol vermelho obscurecido

**Layer 2 (vulcão distante):**
- Silhueta de cratera
- Fumaça saindo do topo
- Tons escuros (lava solidificada)

**Layer 3 (parede de lava):**
- Rocha vulcânica
- Veias de lava brilhante
- Textura rugosa

**Layer 4 (opcional):**
- Gotas de lava caindo
- Fumaça próxima
- Rochas incandescentes

---

### **3. TORRE-LIVROS**
**Tema:** Mágico, conhecimento, biblioteca infinita

**Layer 1 (céu):**
- Céu roxo/azul místico
- Estrelas/constelações
- Auroras ou brilho mágico

**Layer 2 (torres distantes):**
- Pilhas de livros ao fundo
- Prateleiras flutuantes
- Tons mais escuros

**Layer 3 (torre principal):**
- Livros empilhados (textura de lombadas)
- Cores variadas (vermelho, azul, verde, marrom)
- Detalhes: páginas, marcadores

**Layer 4 (opcional):**
- Livros abertos flutuando
- Partículas mágicas douradas
- Penas de escrita

---

### **4. ARVORE-GIGANTE**
**Tema:** Fantasia, natureza, mística

**Layer 1 (céu):**
- Céu verde/azul turquesa
- Folhas gigantes transparentes
- Luz filtrada

**Layer 2 (galhos distantes):**
- Galhos grossos ao fundo
- Folhas enormes
- Tons mais escuros

**Layer 3 (tronco principal):**
- Casca de árvore texturizada
- Musgo, raízes, vinhas
- Janelas/portas mágicas

**Layer 4 (opcional):**
- Folhas próximas
- Insetos luminosos (vagalumes)
- Flores gigantes

---

## 🦅 DECORAÇÕES ANIMADAS (opcional)

Se houver tempo, criar decorações específicas para cada cenário:

### **Montanha Nevada:**
- Flocos de neve (PNG transparente)
- Águias
- Nuvens de nevasca

### **Vulcão:**
- Gotas de lava
- Fumaça/cinzas
- Pássaros de fogo

### **Torre Livros:**
- Páginas voando
- Partículas mágicas
- Corujas

### **Árvore Gigante:**
- Folhas caindo
- Borboletas luminosas
- Sementes voadoras

---

## ✅ CHECKLIST DE ENTREGA

Para CADA cenário:

- [ ] **Layer 1** (céu) - PNG 1920x1080+
- [ ] **Layer 2** (estrutura distante) - PNG 1920x1080+
- [ ] **Layer 3** (estrutura principal) - PNG 1920x1080+
- [ ] **Layer 4** (opcional: elementos próximos) - PNG 1920x1080+
- [ ] **Variações** (mínimo 2 sets completos por cenário)
- [ ] **README.md** em cada pasta explicando o cenário

---

## 🛠️ FERRAMENTAS SUGERIDAS

1. **DALL-E 3 / Midjourney** - Geração de imagens
2. **Stable Diffusion** - Alternativa local
3. **Bing Image Creator** - Gratuito
4. **Photopea** - Edição online (separar camadas)
5. **Remove.bg** - Remover fundos (criar transparência)

---

## 📦 FORMATO DE ENTREGA

Salvar em:
```
/assets/backgrounds/{cenario}/{nome}-layer-{n}.png
```

Exemplo:
```
/assets/backgrounds/vulcao/
├── vulcao-layer-1.png
├── vulcao-layer-2.png
├── vulcao-layer-3.png
├── vulcao-layer-4.png
├── lava-layer-1.png
├── lava-layer-2.png
├── lava-layer-3.png
└── README.md
```

---

## 🎨 REFERÊNCIA VISUAL

Abrir e estudar:
```
/assets/backgrounds/escalada/
```

Este é o padrão de qualidade e estrutura esperado.

---

## 📝 NOTAS IMPORTANTES

1. **Transparência:** Todos os PNGs DEVEM ter alpha channel
2. **Resolução:** Mínimo 1920x1080, ideal 3840x2160
3. **Estilo consistente:** Cartoon/flat, não realista
4. **Cores vibrantes:** iAlume é alegre e educativo
5. **Vertical:** Assets devem funcionar em progressão vertical (subir)
6. **Parallax:** Camadas se movem em velocidades diferentes

---

## 🚀 COMEÇAR

1. Ler este documento
2. Estudar `/assets/backgrounds/escalada/`
3. Escolher um cenário (ex: vulcao)
4. Gerar layer-1, layer-2, layer-3
5. Salvar em `/assets/backgrounds/vulcao/`
6. Criar README.md
7. Repetir para outros cenários

---

**BOA SORTE! 🎨✨**
