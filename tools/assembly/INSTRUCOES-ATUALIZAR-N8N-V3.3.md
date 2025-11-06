# 🔄 ATUALIZAR N8N - Game Assembler V3.3

**Data:** 2025-11-06
**Versão:** V3.3 (correção Bubble layout)

---

## 🎯 O QUE MUDOU

**Problema resolvido:**
- HTML expandindo além do container Bubble
- Header de 50px sendo coberto pelo conteúdo
- Body com `min-height: 100vh` forçando altura indevida

**Solução:**
- CSS inline override no HTML gerado
- Remove flexbox centering do body
- Remove `min-height: 100vh`
- Background transparente para não conflitar com Bubble

---

## 📋 PASSO A PASSO

### **1. Abrir N8N**
- Acesse seu workflow do iAlume Factory
- Localize o Code Node **"Game Assembler"**

### **2. Copiar Código Novo**
- Abra o arquivo: `tools/assembly/n8n-game-assembler-V3.2.js`
- Selecione TODO o conteúdo (Cmd+A)
- Copie (Cmd+C)

### **3. Colar no N8N**
- No Code Node "Game Assembler"
- Apague o código antigo
- Cole o código novo (Cmd+V)

### **4. Salvar**
- Clique em "Execute Node" para testar
- Se funcionar, clique em "Save" no workflow

### **5. Testar**
- Crie um jogo novo no Bubble
- Verifique se:
  - ✅ Header de 50px está sempre visível
  - ✅ HTML não expande além do container
  - ✅ Scroll funciona internamente
  - ✅ Mecânicas aparecem centralizadas no mobile

---

## 🔍 CHANGELOG V3.3

**Adicionado:**
```html
<!-- OVERRIDE: Remove body flexbox para funcionar no Bubble -->
<style>
    body {
        background: transparent !important;
        min-height: auto !important;
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .game-container {
        margin: 0 auto;
        max-width: 100% !important;
    }
</style>
```

**Por quê:**
- `min-height: auto` → Body não força altura mínima
- `display: block` → Remove flexbox centering que causava expansão
- `background: transparent` → Não conflita com background do Bubble
- `padding: 0` → Remove espaçamento que empurrava conteúdo
- `max-width: 100%` → Game-container respeita largura do pai

---

## ✅ VERIFICAÇÃO

Após atualizar, teste com um jogo novo e verifique:

### **Desktop:**
- [ ] Header de 50px sempre visível no topo
- [ ] HTML não cobre o header
- [ ] Scroll interno funciona (não scroll do container Bubble)
- [ ] Mecânicas aparecem posicionadas corretamente

### **Mobile:**
- [ ] Header visível
- [ ] Mecânicas centralizadas (não no canto)
- [ ] Opacity 0.2 (fundo) → 1.0 (ao clicar) funciona
- [ ] Scroll suave e interno

---

## 🆘 PROBLEMAS?

### **Problema: "Código não salva no N8N"**
- Verifique se há erros de sintaxe
- Clique em "Execute Node" primeiro
- Se der erro, verifique se copiou TODO o código

### **Problema: "Header ainda coberto"**
- Limpe cache do navegador (Cmd+Shift+R)
- Crie um jogo NOVO (jogos antigos usam HTML antigo)
- Verifique se o N8N está usando o código novo

### **Problema: "Mecânicas não aparecem"**
- Abra console do navegador (F12)
- Verifique erros no console
- Confirme que CDN está acessível

---

## 📝 NOTA IMPORTANTE

**Jogos já criados NÃO serão afetados** pois eles têm HTML fixo armazenado no Bubble.

Você precisa:
1. Atualizar o N8N com o código novo
2. Criar jogos NOVOS para testar
3. Jogos antigos continuam com o problema (seria necessário re-gerar)

---

**Sucesso na atualização!** 🎮
