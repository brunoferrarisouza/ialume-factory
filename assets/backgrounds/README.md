# 🎨 Assets de Backgrounds - Sistema Parallax

**Versão:** 1.0 (Mockup com CSS)
**Status:** 🟡 Mockado com gradientes (aguardando assets reais)

---

## 📁 Estrutura

```
backgrounds/
├── montanha-nevada/    # Cenário 1: Matemática, Física
├── vulcao/            # Cenário 2: Química, Ciências
├── torre-livros/      # Cenário 3: Português, Literatura
└── arvore-gigante/    # Cenário 4: Biologia, Ecologia
```

---

## 🎨 Sistema Atual: Gradientes CSS

**Por enquanto:** Usando gradientes CSS ao invés de imagens PNG
**Motivo:** Validar sistema de parallax antes de buscar assets reais

### Cenário 1: Montanha Nevada
```css
Camada 1 (fundo): linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)  /* Céu azul */
Camada 2 (meio): linear-gradient(180deg, #708090 0%, #A9A9A9 60%)    /* Montanhas cinzas */
Camada 3 (frente): linear-gradient(180deg, transparent 0%, #F5F5F5 80%) /* Neve */
```

### Cenário 2: Vulcão
```css
Camada 1 (fundo): linear-gradient(180deg, #FF4500 0%, #8B0000 100%)  /* Céu laranja/vermelho */
Camada 2 (meio): linear-gradient(180deg, #2F4F4F 0%, #696969 60%)    /* Rochas escuras */
Camada 3 (frente): linear-gradient(180deg, transparent 0%, #FF6347 80%) /* Lava */
```

---

## 🔄 Próxima Fase: Assets Reais

**Agent 1 (Asset Hunter) irá:**
1. Buscar backgrounds em Kenney.nl / OpenGameArt
2. Baixar 3 camadas PNG por cenário
3. Substituir gradientes CSS por `background-image: url(...)`

**Especificações dos PNGs:**
- Tamanho: 1920x1080px (Full HD)
- Formato: PNG transparente
- Peso: ~100-150KB (comprimido com TinyPNG)
- 3 camadas por cenário

---

## 📊 Status por Cenário

| Cenário | Status | Tipo |
|---------|--------|------|
| Montanha Nevada | 🟡 Mockado | Gradiente CSS |
| Vulcão | 🟡 Mockado | Gradiente CSS |
| Torre Livros | 🔴 Pendente | - |
| Árvore Gigante | 🔴 Pendente | - |

---

**Última atualização:** 2025-11-06 23:25
