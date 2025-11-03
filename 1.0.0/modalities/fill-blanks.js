const FILL_BLANKS = {
    name: 'fill-blanks',
    
    /**
     * ✅ MÉTODO INIT - Ponto de entrada para a modalidade
     * @param {Object} phaseData - Dados da fase
     */
    init: function(phaseData) {
        console.log('🎯 FILL_BLANKS.init() chamado com:', phaseData);
        
        // Criar e retornar a UI
        const ui = this.createUI(phaseData);
        
        return ui;
    },
    
    createUI: function(data) {
        const container = document.createElement('div');
        container.className = 'fill-blanks-container';
        container.innerHTML = `
            <div class="fb-header">
                <div class="fb-icon">✏️</div>
                <div class="fb-title">Complete a frase:</div>
            </div>
            <div class="fb-sentence">
                ${data.frase.replace('____', '<input type="text" class="fb-input" id="fb-answer" placeholder="?" autocomplete="off">')}
            </div>
            ${data.dica ? `<div class="fb-hint">💡 Dica: ${data.dica}</div>` : ''}
            <button class="fb-button">✓ CONFIRMAR</button>
        `;
        
        this.injectCSS();
        
        setTimeout(() => {
            const input = document.getElementById('fb-answer');
            const button = container.querySelector('.fb-button');
            if (input) input.focus();
            if (button) button.onclick = () => this.checkAnswer(data);
            if (input) input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkAnswer(data);
            });
        }, 100);
        
        return container;
    },
    
    checkAnswer: function(data) {
        const input = document.getElementById('fb-answer');
        const button = document.querySelector('.fb-button');
        if (!input || !button) return;
        
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = data.resposta.toLowerCase();
        const aceitas = data.variacoes_aceitas || [correctAnswer];
        const isCorrect = aceitas.some(v => userAnswer === v.toLowerCase());
        
        input.disabled = true;
        button.disabled = true;
        
        if (isCorrect) {
            input.classList.add('correct');
            button.classList.add('correct');
            showFeedback(data.feedback_correto || '✅ Correto!', 'correct');
            playSound('success');

        } else {
            input.classList.add('wrong');
            button.classList.add('wrong');
            setTimeout(() => {
                input.value = data.resposta;
                input.classList.remove('wrong');
                input.classList.add('show-correct');
            }, 800);
            showFeedback(data.feedback_errado || `❌ Resposta: ${data.resposta}`, 'wrong');
            playSound('error');
        }

        // ✅ CHAMAR CALLBACK CENTRAL (registra no Game Engine, anima mecânica, avança fase)
        const phaseNumber = window.gameState ? window.gameState.currentPhase : 1;

        if (window.onAnswerChecked) {
            onAnswerChecked(isCorrect, phaseNumber);
        } else {
            console.error('❌ onAnswerChecked não encontrado! Verifique se base.js foi carregado.');
        }
    },
    
    injectCSS: function() {
        if (document.getElementById('fill-blanks-styles')) return;
        const style = document.createElement('style');
        style.id = 'fill-blanks-styles';
        style.textContent = `
            .fill-blanks-container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .fb-header { text-align: center; margin-bottom: 30px; }
            .fb-icon { font-size: 3.5rem; margin-bottom: 10px; }
            .fb-title { font-size: 1.3rem; font-weight: 600; color: #495057; }
            .fb-sentence { background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15)); border: 3px solid #667eea; border-radius: 20px; padding: 40px; margin-bottom: 30px; font-size: 1.8rem; font-weight: 600; color: #212529; line-height: 2.5; text-align: center; }
            .fb-input { display: inline-block; min-width: 150px; padding: 10px 20px; font-size: 1.8rem; font-weight: 700; text-align: center; border: 3px solid #667eea; border-radius: 10px; background: white; color: #212529; outline: none; }
            .fb-input:focus { border-color: #5a67d8; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2); transform: scale(1.05); }
            .fb-input.correct { background: linear-gradient(135deg, #51cf66, #38d9a9); border-color: #37b24d; color: white; }
            .fb-input.wrong { background: linear-gradient(135deg, #ff6b6b, #ff8787); border-color: #f03e3e; color: white; animation: shake 0.5s; }
            .fb-input.show-correct { background: linear-gradient(135deg, #51cf66, #38d9a9); border-color: #37b24d; color: white; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 50% { transform: translateX(10px); } 75% { transform: translateX(-5px); } }
            .fb-hint { background: rgba(255, 193, 7, 0.15); border-left: 4px solid #ffc107; border-radius: 8px; padding: 15px 20px; margin-bottom: 30px; font-size: 1rem; color: #856404; }
            .fb-button { width: 100%; padding: 20px; font-size: 1.3rem; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 15px; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
            .fb-button:hover:not(:disabled) { transform: translateY(-3px); }
            .fb-button:disabled { opacity: 0.6; cursor: not-allowed; }
            .fb-button.correct { background: linear-gradient(135deg, #51cf66, #38d9a9); }
            .fb-button.wrong { background: linear-gradient(135deg, #ff6b6b, #ff8787); }
        `;
        document.head.appendChild(style);
    }
};

window.FILL_BLANKS = FILL_BLANKS;
console.log('✏️ fill-blanks.js carregado!');
