# 📋 INSTRUÇÕES - Atualizar N8N Game Assembler

**Última atualização:** 2025-11-05
**Versão:** V3.2 (Mobile UX + Fix Títulos)

---

## 🎯 QUANDO USAR ESTE ARQUIVO

Use este guia sempre que:
- Fizer alterações no assembler localmente
- Precisar atualizar o N8N com a versão mais recente
- Novos jogos precisarem das funcionalidades mais recentes

---

## 📦 ARQUIVOS DISPONÍVEIS

### 1. **n8n-game-assembler-V3.2.js**
- **Localização:** `/tools/assembly/n8n-game-assembler-V3.2.js`
- **Última versão:** Inclui formatação de títulos e suporte mobile UX
- **Usar para:** Code Node "Game Assembler" no N8N

### 2. **n8n-parse-gpt-output-ROBUSTO.js**
- **Localização:** `/tools/assembly/n8n-parse-gpt-output-ROBUSTO.js`
- **Função:** Parse robusto do JSON do Claude (limpa erros)
- **Usar para:** Code Node "Parse Analyzer" no N8N

---

## 🔄 PASSO A PASSO: Atualizar N8N

### **PARTE 1: Game Assembler**

1. **Abra o arquivo local:**
   ```
   /tools/assembly/n8n-game-assembler-V3.2.js
   ```

2. **Copie TODO o conteúdo** (Cmd+A / Ctrl+A)

3. **Acesse o N8N:**
   - Entre no workflow do jogo
   - Localize o **Code Node** chamado **"Game Assembler"**

4. **Cole o código:**
   - Selecione todo o código antigo (Cmd+A / Ctrl+A)
   - Cole o novo código (Cmd+V / Ctrl+V)

5. **Salve o workflow** (Cmd+S / Ctrl+S)

6. **Teste:**
   - Execute o workflow com uma foto de teste
   - Verifique no console se aparecem os logs:
     ```
     🎮 Game Assembler V3.2 iniciando...
     ```

---

### **PARTE 2: Parse Analyzer (Opcional)**

Se você também atualizou o parser:

1. **Abra o arquivo local:**
   ```
   /tools/assembly/n8n-parse-gpt-output-ROBUSTO.js
   ```

2. **Repita o processo** no Code Node "Parse Analyzer"

---

## ✅ NOVIDADES V3.2

### **1. Formatação de Títulos**
**Antes:**
```
gincana_das_equipes
```

**Depois:**
```
Gincana Das Equipes
```

**Código (linhas 49-59):**
```javascript
function formatTitle(str) {
  if (!str) return 'Jogo Educativo';

  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
```

**Uso (linha 63):**
```javascript
tema: formatTitle(gptConfig.narrative?.theme) || 'Jogo Educativo',
```

---

### **2. Suporte Mobile UX**

O assembler já gera HTML com referências ao CDN atualizado que inclui:
- CSS com mecânica como background (opacity 20%)
- JavaScript com métodos `showMechanic()` e `hideMechanic()`
- Animações de transição suaves

**Nenhuma mudança necessária no assembler** - funciona automaticamente via CDN!

---

## 🔍 VERIFICAÇÃO PÓS-DEPLOY

Após copiar o código no N8N, teste criando um novo jogo:

### **Checklist:**

- [ ] Título sem underscores (ex: "Gincana Das Equipes")
- [ ] Game abre sem erros no console
- [ ] Mecânica visível (mesmo que levemente) no mobile
- [ ] Ao clicar em resposta, mecânica fica 100% visível
- [ ] Após animação, mecânica volta para fundo
- [ ] API salva resultados corretamente no Bubble

---

## 📊 CHANGELOG

### **V3.2** (2025-11-05)
- ✅ Adicionada formatação automática de títulos (remove underscores)
- ✅ CDN atualizado com mobile UX (mecânica como background)
- ✅ Mantida compatibilidade com jogos antigos

### **V3.1** (2025-11-04)
- ✅ Fix race condition (espera modalidades carregarem)
- ✅ Fix re-injeção Bubble SPA (var ao invés de const)
- ✅ Retry mechanism para .game-container em mechanics

### **V3.0** (2025-11-03)
- ✅ Suporte múltiplas modalidades no mesmo jogo
- ✅ Question id=0 como opening
- ✅ Carregamento dinâmico de scripts

---

## ⚠️ IMPORTANTE

### **O que NÃO fazer:**

❌ Não modifique o código diretamente no N8N sem atualizar o arquivo local
❌ Não remova os console.log() (são essenciais para debug)
❌ Não altere a estrutura `dados: dados` (mantém compatibilidade)

### **O que SEMPRE fazer:**

✅ Mantenha os arquivos locais como fonte da verdade
✅ Teste depois de copiar para o N8N
✅ Verifique os logs do console ao criar jogos
✅ Atualize este CHANGELOG quando fizer mudanças

---

## 🆘 TROUBLESHOOTING

### **Problema: Títulos ainda com underscore**

**Causa:** Código antigo ainda no N8N

**Solução:**
1. Verifique se copiou TODO o código (incluindo função formatTitle)
2. Salve o workflow (Cmd+S)
3. Crie um jogo NOVO (jogos antigos mantêm título original)

---

### **Problema: Mobile UX não funciona**

**Causa:** CDN ainda não atualizou ou jogos antigos no cache

**Solução:**
1. Aguarde 2-3 minutos após deploy
2. Force refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Teste em aba anônima
4. Verifique se CDN tem o CSS atualizado:
   ```
   https://brunoferrarisouza.github.io/ialume-factory/1.0.0/base.css
   ```

---

### **Problema: Jogo não inicia**

**Causa:** Erro no código ou modalidades não carregadas

**Solução:**
1. Abra DevTools (F12)
2. Verifique tab Console
3. Procure por erros em vermelho
4. Veja qual modalidade não carregou nos logs
5. Verifique se o CDN está acessível

---

## 📞 CONTATO

Se tiver dúvidas ou problemas, consulte:
- `/CHECKPOINT.md` - Status do projeto
- `/CLAUDE.md` - Documentação completa
- `/.clauderules` - Regras de modificação

---

**Última revisão:** 2025-11-05
**Próxima revisão:** Após próxima atualização do assembler
