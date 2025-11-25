# 🎮 INSTRUÇÕES DE USO - Asset Farming

**Guia Completo:** Como usar os prompts para gerar todos os assets do iAlume Factory

---

## 🎯 VISÃO GERAL

Você precisa gerar **assets visuais (backgrounds)** para 4 cenários do jogo educacional iAlume Factory.

**Cada cenário precisa de:**
- 3-4 camadas PNG (layers) com transparência
- Resolução mínima: 1920x1080
- Estilo: Cartoon/flat design, cores vibrantes
- Pelo menos 2 variações completas

**Total a gerar:** ~48-64 imagens PNG

---

## 📋 PASSO A PASSO

### **ETAPA 1: ESCOLHER FERRAMENTA**

Você tem várias opções:

#### **🥇 OPÇÃO 1: DALL-E 3 (Recomendado)**
- **Onde:** ChatGPT Plus (pago - $20/mês)
- **Qualidade:** Excelente
- **Facilidade:** Muito fácil
- **Transparência:** Pode gerar (nem sempre funciona)

**Como usar:**
1. Abra ChatGPT Plus
2. Cole o prompt do arquivo `PROMPTS-PRONTOS.md`
3. Gere a imagem
4. Baixe em alta resolução
5. Se necessário, peça ajustes: "Remove the ground" ou "Make it more vertical"

---

#### **🥈 OPÇÃO 2: Leonardo.ai**
- **Onde:** https://leonardo.ai (gratuito + planos pagos)
- **Qualidade:** Ótima
- **Facilidade:** Médio
- **Transparência:** Suporte nativo

**Como usar:**
1. Crie conta gratuita em leonardo.ai
2. Vá em "AI Image Generation"
3. Escolha modelo: **"Leonardo Diffusion XL"**
4. Cole o prompt
5. Configurações:
   - **Resolution:** 1024x1536 (vertical) ou maior
   - **Guidance Scale:** 7-10
   - **Transparent Background:** ✅ (se disponível)
6. Gere e baixe

---

#### **🥉 OPÇÃO 3: Bing Image Creator**
- **Onde:** https://www.bing.com/create (gratuito)
- **Qualidade:** Boa (usa DALL-E 3)
- **Facilidade:** Muito fácil
- **Transparência:** Não (precisa remover depois)

**Como usar:**
1. Acesse Bing Image Creator
2. Cole o prompt
3. Gere
4. Baixe a melhor imagem
5. Use Remove.bg para adicionar transparência

---

#### **⚙️ OPÇÃO 4: Midjourney**
- **Onde:** https://midjourney.com (pago - $10/mês mínimo)
- **Qualidade:** Melhor qualidade artística
- **Facilidade:** Médio (requer Discord)
- **Transparência:** Não (precisa remover depois)

**Como usar:**
1. Entre no Discord do Midjourney
2. Cole o prompt + adicione: `--ar 9:16 --v 6`
3. Aguarde geração
4. Upscale a melhor
5. Baixe e remova fundo com Remove.bg

---

### **ETAPA 2: GERAR ASSETS POR CENÁRIO**

**Ordem recomendada:**
1. Montanha Nevada (mais simples)
2. Árvore Gigante (natureza é familiar)
3. Torre Livros (médio)
4. Vulcão (mais complexo)

---

#### **Para CADA cenário, faça:**

1. **Abra o arquivo:** `PROMPTS-PRONTOS.md`
2. **Localize a seção** do cenário (ex: "CENÁRIO 1: MONTANHA NEVADA")
3. **Copie o prompt completo** da Layer 1
4. **Cole na ferramenta** escolhida (DALL-E, Leonardo, etc)
5. **Gere a imagem**
6. **Baixe** e salve com o nome sugerido
7. **Repita** para Layer 2, Layer 3, Layer 4

---

### **ETAPA 3: PÓS-PROCESSAMENTO**

Se a imagem gerada **NÃO tem transparência**:

#### **Opção A: Remove.bg (Automático)**
1. Vá em https://remove.bg
2. Faça upload da imagem
3. Baixe PNG com fundo transparente
4. ✅ Pronto!

#### **Opção B: Photopea (Manual)**
1. Vá em https://photopea.com
2. Abra a imagem
3. Selecione ferramenta **Magic Wand**
4. Clique no fundo que quer remover
5. Delete (tecla Delete)
6. Salve como PNG

---

### **ETAPA 4: AJUSTAR TAMANHO**

Se a imagem **não está em 1920x1080**:

1. Abra em **Photopea** (https://photopea.com)
2. Vá em **Image → Canvas Size**
3. Configure:
   - Width: 1920px
   - Height: 1080px
   - Anchor: Centro
4. Salve como PNG

**OU**

1. Use qualquer editor de imagem
2. Redimensione/corte para 1920x1080
3. Mantenha transparência

---

### **ETAPA 5: COMPRIMIR (OPCIONAL)**

Para reduzir tamanho do arquivo sem perder qualidade:

1. Vá em https://tinypng.com
2. Faça upload das imagens
3. Baixe versões comprimidas (~60% menores)
4. Use essas versões no jogo

---

## 📂 ORGANIZAÇÃO DOS ARQUIVOS

Salve os arquivos nas pastas corretas:

```
/assets/backgrounds/
├── montanha-nevada/
│   ├── montanha-nevada-layer-1.png  ✅
│   ├── montanha-nevada-layer-2.png  ✅
│   ├── montanha-nevada-layer-3.png  ✅
│   ├── montanha-nevada-layer-4.png  (opcional)
│   └── README.md  (já existe)
│
├── vulcao/
│   ├── vulcao-layer-1.png  ✅
│   ├── vulcao-layer-2.png  ✅
│   ├── vulcao-layer-3.png  ✅
│   ├── vulcao-layer-4.png  (opcional)
│   └── README.md  (já existe)
│
├── torre-livros/
│   ├── torre-livros-layer-1.png  ✅
│   ├── torre-livros-layer-2.png  ✅
│   ├── torre-livros-layer-3.png  ✅
│   ├── torre-livros-layer-4.png  (opcional)
│   └── README.md  (já existe)
│
└── arvore-gigante/
    ├── arvore-gigante-layer-1.png  ✅
    ├── arvore-gigante-layer-2.png  ✅
    ├── arvore-gigante-layer-3.png  ✅
    ├── arvore-gigante-layer-4.png  (opcional)
    └── README.md  (já existe)
```

---

## ⏱️ ESTIMATIVA DE TEMPO

### **Por Layer (imagem individual):**
- Gerar: 30s - 2min (depende da ferramenta)
- Ajustar/Pós-processar: 1-3min
- **Total por layer:** ~3-5min

### **Por Cenário Completo (4 layers):**
- Gerar 4 layers: ~12-20min
- Revisar e ajustar: ~5min
- **Total por cenário:** ~20-30min

### **TODOS os 4 Cenários (mínimo):**
- **Total estimado:** 1h30min - 2h30min

### **Com Variações (2 sets por cenário):**
- **Total estimado:** 3h - 5h

---

## 🎨 DICAS DE QUALIDADE

### **✅ FAZER:**

1. **Sempre especificar "PNG with transparency"** no prompt
2. **Pedir "vertical orientation"** explicitamente
3. **Usar cores vibrantes** (cartoon style)
4. **Deixar centro livre** (para gameplay)
5. **Gerar várias versões** e escolher a melhor
6. **Manter estilo consistente** entre layers do mesmo cenário

### **❌ EVITAR:**

1. ❌ Realismo fotográfico (queremos cartoon)
2. ❌ Cores apagadas/pastéis demais
3. ❌ Elementos no centro (bloqueia gameplay)
4. ❌ Imagens horizontais (precisa ser vertical)
5. ❌ Misturar estilos entre layers (inconsistência)
6. ❌ Texto legível nas imagens (pode distrair)

---

## 🔄 WORKFLOW RECOMENDADO

### **Dia 1: Montanha Nevada + Árvore Gigante** (1h30min - 2h)
- 09:00 - Gerar Layer 1,2,3,4 da Montanha Nevada
- 10:00 - Gerar Layer 1,2,3,4 da Árvore Gigante
- 10:30 - Pós-processar e organizar arquivos

### **Dia 2: Torre Livros + Vulcão** (1h30min - 2h)
- 09:00 - Gerar Layer 1,2,3,4 da Torre Livros
- 10:00 - Gerar Layer 1,2,3,4 do Vulcão
- 10:30 - Pós-processar e organizar arquivos

### **Dia 3: Variações** (2h - 3h)
- 09:00 - Criar variações de Montanha Nevada
- 09:30 - Criar variações de Árvore Gigante
- 10:00 - Criar variações de Torre Livros
- 10:30 - Criar variações de Vulcão
- 11:00 - Revisar tudo, ajustar se necessário

**Total:** 3 dias, ~6h de trabalho

---

## 🐛 TROUBLESHOOTING

### **Problema: Imagem não ficou vertical**
**Solução:**
- Adicione ao prompt: "vertical orientation, tall aspect ratio 9:16"
- No Midjourney: use `--ar 9:16`

### **Problema: Tem elementos no centro bloqueando**
**Solução:**
- Peça novamente: "leave center area clear for gameplay"
- Ou edite manualmente no Photopea (apagar elementos)

### **Problema: Não tem transparência**
**Solução:**
- Use Remove.bg automaticamente
- Ou Photopea manualmente

### **Problema: Estilo muito realista**
**Solução:**
- Adicione ao prompt: "flat design, cartoon style, not realistic"
- Enfatize: "educational game aesthetic"

### **Problema: Cores muito apagadas**
**Solução:**
- Adicione: "vibrant colors, saturated, cheerful"
- Ajuste saturação no Photopea (Image → Adjustments → Hue/Saturation)

### **Problema: Ferramenta não entendeu o prompt**
**Solução:**
- Simplifique o prompt (remova detalhes menos importantes)
- Gere em etapas (primeiro estrutura, depois detalhes)
- Tente outra ferramenta

---

## 📊 CHECKLIST GERAL

Use esta checklist para acompanhar progresso:

### **Cenário 1: Montanha Nevada**
- [ ] Layer 1 (céu) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 2 (montanhas) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 3 (principal) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 4 (opcional) - gerada, transparente, 1920x1080 ✅
- [ ] Variação 2 completa (4 layers) ✅
- [ ] Arquivos salvos em `/montanha-nevada/` ✅

### **Cenário 2: Vulcão**
- [ ] Layer 1 (céu) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 2 (vulcão distante) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 3 (parede lava) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 4 (opcional) - gerada, transparente, 1920x1080 ✅
- [ ] Variação 2 completa (4 layers) ✅
- [ ] Arquivos salvos em `/vulcao/` ✅

### **Cenário 3: Torre Livros**
- [ ] Layer 1 (céu místico) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 2 (torres distantes) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 3 (torre principal) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 4 (opcional) - gerada, transparente, 1920x1080 ✅
- [ ] Variação 2 completa (4 layers) ✅
- [ ] Arquivos salvos em `/torre-livros/` ✅

### **Cenário 4: Árvore Gigante**
- [ ] Layer 1 (céu filtrado) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 2 (galhos) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 3 (tronco) - gerada, transparente, 1920x1080 ✅
- [ ] Layer 4 (opcional) - gerada, transparente, 1920x1080 ✅
- [ ] Variação 2 completa (4 layers) ✅
- [ ] Arquivos salvos em `/arvore-gigante/` ✅

---

## 🎬 EXEMPLO PRÁTICO COMPLETO

Vou gerar o Layer 1 da Montanha Nevada usando DALL-E 3:

### **Passo 1:** Abrir ChatGPT Plus

### **Passo 2:** Colar o prompt (do arquivo PROMPTS-PRONTOS.md):

```
Create a cartoon-style vertical game background layer showing a COLD WINTER SKY for a mountain climbing game.

STYLE:
- Flat design, vibrant colors
- Educational game aesthetic (cheerful, not intimidating)
- Resolution: 1920x1080 or higher
- PNG with transparency

ELEMENTS:
- Light blue to pale gray gradient sky (#87CEEB to #B0C4DE)
- Soft white and gray clouds scattered across
- Weak winter sun peeking through clouds (soft yellow glow)
- Gentle snowflakes falling (small, sparse)
- NO ground, NO mountains (sky only)

MOOD: Cold but inviting, winter atmosphere, vertical orientation
```

### **Passo 3:** Aguardar geração (~30s)

### **Passo 4:** Baixar imagem em alta resolução

### **Passo 5:** Verificar:
- ✅ É vertical?
- ✅ Tem transparência?
- ✅ Resolução adequada?
- ✅ Estilo cartoon/flat?

### **Passo 6:** Se tudo OK, salvar como:
`/assets/backgrounds/montanha-nevada/montanha-nevada-layer-1.png`

### **Passo 7:** Repetir para Layer 2, 3, 4

**Pronto!** Um cenário completo gerado.

---

## 📚 RECURSOS ADICIONAIS

### **Ferramentas Mencionadas:**
- **DALL-E 3:** https://chat.openai.com (ChatGPT Plus)
- **Leonardo.ai:** https://leonardo.ai
- **Bing Image Creator:** https://bing.com/create
- **Midjourney:** https://midjourney.com
- **Remove.bg:** https://remove.bg
- **Photopea:** https://photopea.com
- **TinyPNG:** https://tinypng.com

### **Arquivos de Referência:**
- `PROMPTS-PRONTOS.md` - Todos os prompts organizados
- `ASSET-FARMING-BRIEF.md` - Brief completo do projeto
- `/escalada/` - Exemplos visuais (referência de qualidade)

### **READMEs dos Cenários:**
- `/montanha-nevada/README.md` - Detalhes do cenário neve
- `/vulcao/README.md` - Detalhes do cenário vulcão
- `/torre-livros/README.md` - Detalhes do cenário biblioteca
- `/arvore-gigante/README.md` - Detalhes do cenário árvore

---

## ✅ ENTREGA FINAL

Quando terminar, você deve ter:

```
/assets/backgrounds/
├── montanha-nevada/
│   ├── montanha-nevada-layer-1.png  ✅
│   ├── montanha-nevada-layer-2.png  ✅
│   ├── montanha-nevada-layer-3.png  ✅
│   ├── nevada-noite-layer-1.png     ✅ (variação)
│   ├── nevada-noite-layer-2.png     ✅
│   ├── nevada-noite-layer-3.png     ✅
│   └── README.md
│
├── vulcao/
│   ├── vulcao-layer-1.png           ✅
│   ├── vulcao-layer-2.png           ✅
│   ├── vulcao-layer-3.png           ✅
│   ├── lava-erupcao-layer-1.png     ✅ (variação)
│   ├── lava-erupcao-layer-2.png     ✅
│   ├── lava-erupcao-layer-3.png     ✅
│   └── README.md
│
├── torre-livros/
│   ├── torre-livros-layer-1.png     ✅
│   ├── torre-livros-layer-2.png     ✅
│   ├── torre-livros-layer-3.png     ✅
│   ├── biblioteca-antiga-layer-1.png ✅ (variação)
│   ├── biblioteca-antiga-layer-2.png ✅
│   ├── biblioteca-antiga-layer-3.png ✅
│   └── README.md
│
└── arvore-gigante/
    ├── arvore-gigante-layer-1.png   ✅
    ├── arvore-gigante-layer-2.png   ✅
    ├── arvore-gigante-layer-3.png   ✅
    ├── arvore-outono-layer-1.png    ✅ (variação)
    ├── arvore-outono-layer-2.png    ✅
    ├── arvore-outono-layer-3.png    ✅
    └── README.md
```

**Total mínimo:** 24 imagens PNG (6 por cenário × 4 cenários)
**Total ideal:** 48 imagens PNG (com variações)

---

## 🎉 PRONTO PARA COMEÇAR!

**Ordem de ação:**

1. ✅ Escolher ferramenta (recomendo DALL-E 3 ou Leonardo.ai)
2. ✅ Abrir `PROMPTS-PRONTOS.md`
3. ✅ Começar pelo Cenário 1: Montanha Nevada
4. ✅ Gerar Layer 1, depois 2, depois 3
5. ✅ Pós-processar (transparência + tamanho)
6. ✅ Salvar na pasta correta
7. ✅ Marcar checklist
8. ✅ Repetir para outros cenários

**Qualquer dúvida:**
- Consulte os READMEs nas pastas
- Veja exemplos em `/escalada/`
- Releia este guia

**Boa sorte no farming de assets!** 🎨🚀✨

---

**Criado em:** 2025-11-07
**Para:** iAlume Factory - Asset Farming
**Por:** Claude Code (Agente Especializado)
