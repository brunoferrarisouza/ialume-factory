# 🎮 GUIA: Gerando Jogos de Teste

## 🚀 Opção 1: Scripts NPM (Mais Rápido)

```bash
# Gerar jogo de teste
npm run gerar-teste

# Abrir no navegador
npm run abrir-teste

# Fazer tudo de uma vez
npm run teste-completo
```

---

## 📝 Opção 2: Criar Seu Próprio Jogo

### Passo 1: Copiar o template

```bash
cd tests
cp gerar-TEMPLATE.js gerar-historia.js
```

### Passo 2: Editar a configuração

Abra `gerar-historia.js` e edite:

```javascript
const config = {
    tema: 'História do Brasil',
    descricao: 'Viaje no tempo com Lume!',
    mechanic: 'escalada',
    fases: [
        { type: 'welcome' },
        
        {
            modalidade: 'quiz',
            dados: {
                pergunta: 'Em que ano foi descoberto o Brasil?',
                alternativas: ['1492', '1500', '1530', '1550'],
                correta: 1,
                feedback_correto: '✅ Correto! 1500!',
                feedback_errado: '❌ Ops! Foi em 1500.'
            }
        },
        
        // Adicione mais fases...
    ]
};

const outputFilename = 'historia-brasil.html';
```

### Passo 3: Gerar o jogo

```bash
node gerar-historia.js
```

### Passo 4: Abrir no navegador

```bash
open historia-brasil.html
```

---

## 📚 Exemplos Prontos

### Exemplo 1: Matemática

```bash
node gerar-matematica.js
open matematica-basica.html
```

### Exemplo 2: Criar novo tema

```bash
# Copiar template
cp gerar-TEMPLATE.js gerar-ciencias.js

# Editar gerar-ciencias.js
# (adicione suas perguntas de ciências)

# Gerar
node gerar-ciencias.js

# Abrir
open ciencias.html
```

---

## 🎯 Estrutura de uma Fase (Quiz)

```javascript
{
    modalidade: 'quiz',
    dados: {
        pergunta: 'Texto da pergunta?',
        alternativas: ['A', 'B', 'C', 'D'],
        correta: 0,  // 0=A, 1=B, 2=C, 3=D
        feedback_correto: '✅ Acertou!',
        feedback_errado: '❌ Errou!'
    }
}
```

---

## ⚠️ IMPORTANTE

1. **SEMPRE** inclua a fase 0 (boas-vindas):
   ```javascript
   { type: 'welcome' }
   ```

2. **Número de fases** = total que você quer:
   - Fase 0: welcome
   - Fase 1, 2, 3...: suas questões

3. **Índice da resposta correta:**
   - 0 = primeira opção
   - 1 = segunda opção
   - 2 = terceira opção
   - 3 = quarta opção

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
cd /Users/brunoferrari.souza/Documents/ialume-factory/tests
node gerar-seu-arquivo.js
```

### Arquivo não abre no navegador
```bash
# macOS
open seu-jogo.html

# Ou especificar navegador
open -a "Google Chrome" seu-jogo.html
```

### Ver logs detalhados
Abra o Console do navegador (F12) para ver:
- ✅ Fases sendo injetadas
- 🏔️ Escalada sendo criada
- 📦 Logs de debug

---

## 💡 DICAS

### Dica 1: Criar múltiplos jogos rapidamente

```bash
# Criar 3 jogos de uma vez
node gerar-matematica.js
node gerar-historia.js
node gerar-ciencias.js
```

### Dica 2: Testar mudanças rapidamente

```bash
# Edite o arquivo
nano gerar-matematica.js

# Regenere
node gerar-matematica.js

# Recarregue no navegador (Cmd+R)
```

### Dica 3: Organizar arquivos

```bash
# Criar pasta para seus jogos
mkdir meus-jogos

# Mover jogos gerados
mv *.html meus-jogos/
```

---

## 📁 Arquivos Importantes

```
tests/
├── gerar-TEMPLATE.js         ← Template em branco
├── gerar-matematica.js       ← Exemplo: matemática
├── gerar-corrigido.js        ← Jogo de teste padrão
└── README-GERADORES.md       ← Este arquivo
```

---

## 🎉 Pronto!

Agora você pode criar quantos jogos quiser sem gastar tokens! 🚀
