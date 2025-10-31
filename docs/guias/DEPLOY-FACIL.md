# 🚀 GUIA RÁPIDO DE DEPLOY - ZERO DOR DE CABEÇA

## ✅ O QUE FOI CRIADO PRA VOCÊ:

1. **Script de deploy automático** (`scripts/deploy-cdn.js`)
2. **Script de push automático** (`scripts/push-cdn.js`)
3. **Assembler para CDN** (`tools/assembly/game_assembler_cdn.js`)
4. **Code node pronto pro N8N** (`tools/assembly/n8n-code-node.js`)

---

## 📋 PASSO A PASSO (5 MINUTOS):

### **PASSO 1: Deploy Local** (30 segundos)

```bash
# No terminal, na pasta do projeto:
cd /Users/brunoferrari.souza/Documents/ialume-factory

# Roda o deploy:
npm run deploy
```

**O que acontece:**
- ✅ Cria pasta `cdn/1.0.0/`
- ✅ Copia todos os arquivos necessários
- ✅ Organiza em estrutura CDN
- ✅ Cria index.html

---

### **PASSO 2: Push para GitHub** (30 segundos)

```bash
# Adiciona e comita:
npm run push-cdn
```

**O que acontece:**
- ✅ Git add cdn/
- ✅ Git commit
- ✅ Git push origin main

---

### **PASSO 3: Ativar GitHub Pages** (2 minutos - só 1x)

1. Vai em: https://github.com/SEU-USUARIO/ialume-factory/settings/pages
2. Em "Source", seleciona: **main branch**
3. Clica "Save"
4. Aguarda 1-2 minutos

**Pronto!** Seu CDN está em:
```
https://SEU-USUARIO.github.io/ialume-factory/1.0.0/
```

---

### **PASSO 4: Configurar N8N** (2 minutos)

1. Abre N8N
2. Cria novo workflow
3. Adiciona um **Code Node**
4. Copia TUDO de `tools/assembly/n8n-code-node.js`
5. Cola no Code node
6. **IMPORTANTE:** Ajusta a linha 15:
   ```javascript
   const CDN_BASE_URL = 'https://SEU-USUARIO.github.io/ialume-factory';
   ```
   Substitui `SEU-USUARIO` pelo seu usuário GitHub!

7. Salva

**Pronto!** 🎉

---

## 🧪 TESTAR:

### **Teste Local:**

```bash
# Gera um jogo de teste:
npm run gerar-teste
npm run abrir-teste
```

### **Teste no N8N:**

**Input de teste (Execute Workflow com dados):**
```json
{
  "tema": "Matemática Básica",
  "fases": [
    {
      "modalidade": "quiz",
      "dados": {
        "pergunta": "Quanto é 5 × 3?",
        "alternativas": ["10", "15", "20", "25"],
        "correta": 1,
        "feedback_correto": "Correto!",
        "feedback_errado": "Ops!"
      }
    }
  ],
  "mecanica": "escalada",
  "pagina_id": "test123",
  "sessao_id": "test456",
  "aluno_id": "test789"
}
```

**Output esperado:**
```json
{
  "html": "<html>...</html>",
  "status": "success",
  "config": {...}
}
```

Copia o HTML e abre num arquivo .html pra ver funcionando!

---

## 🔄 ATUALIZAR CÓDIGO:

```bash
# 1. Edita os arquivos (base.js, escalada.js, etc)

# 2. Deploy nova versão:
npm run deploy -- --version 1.0.1

# 3. Push:
npm run push-cdn

# 4. No N8N, muda a linha VERSION:
const VERSION = '1.0.1';
```

---

## 🆘 PROBLEMAS COMUNS:

### ❌ "git push failed"
**Solução:**
```bash
git pull origin main
npm run push-cdn
```

### ❌ "GitHub Pages não funciona"
- Aguarde 2-3 minutos (pode demorar)
- Vai em Settings → Pages e verifica se está "Active"

### ❌ "Scripts não carregam no jogo"
- Verifica se o CDN_BASE_URL está correto
- Abre DevTools (F12) e vê se os arquivos estão 404

### ❌ "Code node dá erro no N8N"
- Verifica se copiou TUDO (inclusive a parte final com return)
- Verifica se o input tem os campos necessários

---

## 📞 AJUDA RÁPIDA:

**Testar se CDN funciona:**
```
Abre no browser:
https://SEU-USUARIO.github.io/ialume-factory/1.0.0/index.html
```

Se aparecer uma página bonita com lista de arquivos = funcionou!

---

## 🎯 WORKFLOW N8N COMPLETO:

```
[Webhook] Recebe foto
    ↓
[Anthropic Vision] OCR
    ↓
[Anthropic Haiku] Extrai conceitos
    ↓
[Anthropic Sonnet] Cria narrativa
    ↓
[Code Node] ← SEU CÓDIGO AQUI!
    ↓
[HTTP Request] Salva no Bubble
    ↓
[Webhook Response] Retorna URL
```

---

## ✅ CHECKLIST:

- [ ] Rodou `npm run deploy`
- [ ] Rodou `npm run push-cdn`
- [ ] Ativou GitHub Pages
- [ ] Testou URL do CDN no browser
- [ ] Copiou code node pro N8N
- [ ] Ajustou CDN_BASE_URL com seu usuário
- [ ] Testou no N8N com dados fake

**Se tudo ✅ = PRONTO PRA PRODUÇÃO!** 🚀
