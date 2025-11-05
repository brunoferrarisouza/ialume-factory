// ===== MODALIDADE: VERDADEIRO OU FALSO =====
// Afirmações para julgar como verdadeiras ou falsas

const TRUE_FALSE = {
    name: 'true-false',
    currentQuestion: null,
    
    /**
     * ✅ MÉTODO INIT - Ponto de entrada para a modalidade
     * @param {Object} phaseData - Dados da fase
     */
    init: function(phaseData) {
        console.log('🎯 TRUE_FALSE.init() chamado com:', phaseData);
        
        // Criar e retornar a UI
        const ui = this.createUI(phaseData);
        
        return ui;
    },
    
    // Criar UI
    createUI: function(data) {
        const container = document.createElement('div');
        container.className = 'true-false-container';
        
        // Afirmação
        const statementBox = document.createElement('div');
        statementBox.className = 'tf-statement';
        statementBox.innerHTML = `
            <div class="statement-icon">🤔</div>
            <div class="statement-text">${data.afirmacao}</div>
        `;
        container.appendChild(statementBox);
        
        // Botões V ou F
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'tf-buttons';
        
        // Botão VERDADEIRO
        const trueButton = document.createElement('button');
        trueButton.className = 'tf-button tf-true';
        trueButton.innerHTML = `
            <div class="tf-icon">✓</div>
            <div class="tf-label">VERDADEIRO</div>
        `;
        trueButton.onclick = () => this.selectOption(true, data.correta, data);
        
        // Botão FALSO
        const falseButton = document.createElement('button');
        falseButton.className = 'tf-button tf-false';
        falseButton.innerHTML = `
            <div class="tf-icon">✗</div>
            <div class="tf-label">FALSO</div>
        `;
        falseButton.onclick = () => this.selectOption(false, data.correta, data);
        
        buttonsContainer.appendChild(trueButton);
        buttonsContainer.appendChild(falseButton);
        container.appendChild(buttonsContainer);
        
        // Injetar CSS
        this.injectCSS();
        
        this.currentQuestion = data;
        
        return container;
    },
    
    // Selecionar opção
    selectOption: function(selectedValue, correctValue, data) {
        const isCorrect = selectedValue === correctValue;
        const buttons = document.querySelectorAll('.tf-button');
        
        console.log('🎯 Resposta:', selectedValue, '| Correta:', correctValue, '| Acertou:', isCorrect);
        
        // Desabilitar botões
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.6';
        });
        
        // Marcar botão selecionado
        const selectedButton = selectedValue ? buttons[0] : buttons[1];
        const correctButton = correctValue ? buttons[0] : buttons[1];
        
        if (isCorrect) {
            // ACERTOU
            selectedButton.classList.add('correct');
            selectedButton.style.opacity = '1';

            const feedbackMsg = data.feedback_correto || '✅ Correto!';
            showFeedback(feedbackMsg, 'correct');
            playSound('success');

        } else {
            // ERROU
            selectedButton.classList.add('wrong');
            selectedButton.style.opacity = '1';

            // Mostrar resposta correta
            setTimeout(() => {
                correctButton.classList.add('correct');
                correctButton.style.opacity = '1';
            }, 500);

            const feedbackMsg = data.feedback_errado || '❌ Incorreto! A resposta é ' + (correctValue ? 'VERDADEIRO' : 'FALSO');
            showFeedback(feedbackMsg, 'wrong');
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
    
    // Injetar CSS
    injectCSS: function() {
        if (document.getElementById('true-false-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'true-false-styles';
        style.textContent = `
            /* Container */
            .true-false-container {
                max-width: 700px;
                margin: 0 auto;
                padding: 20px;
            }
            
            /* Afirmação */
            .tf-statement {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
                border: 3px solid #667eea;
                border-radius: 20px;
                padding: 40px;
                margin-bottom: 40px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .statement-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: thinking 2s ease-in-out infinite;
            }
            
            @keyframes thinking {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
            }
            
            .statement-text {
                font-size: 1.6rem;
                font-weight: 600;
                color: #212529;
                line-height: 1.8;
            }
            
            /* Botões */
            .tf-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            
            .tf-button {
                padding: 40px 30px;
                background: white;
                border: 4px solid #dee2e6;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }
            
            .tf-button:hover:not(:disabled) {
                transform: translateY(-10px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            
            .tf-button:active:not(:disabled) {
                transform: translateY(-5px);
            }
            
            /* Botão Verdadeiro */
            .tf-true {
                border-color: #51cf66;
            }
            
            .tf-true:hover:not(:disabled) {
                background: linear-gradient(to bottom, #ffffff, #d3f9d8);
                border-color: #37b24d;
            }
            
            .tf-true .tf-icon {
                font-size: 4rem;
                font-weight: bold;
                color: #37b24d;
            }
            
            .tf-true .tf-label {
                font-size: 1.4rem;
                font-weight: 700;
                color: #2f9e44;
            }
            
            /* Botão Falso */
            .tf-false {
                border-color: #ff6b6b;
            }
            
            .tf-false:hover:not(:disabled) {
                background: linear-gradient(to bottom, #ffffff, #ffe0e0);
                border-color: #f03e3e;
            }
            
            .tf-false .tf-icon {
                font-size: 4rem;
                font-weight: bold;
                color: #f03e3e;
            }
            
            .tf-false .tf-label {
                font-size: 1.4rem;
                font-weight: 700;
                color: #c92a2a;
            }
            
            /* Estado: Correto */
            .tf-button.correct {
                background: linear-gradient(135deg, #51cf66, #38d9a9);
                border-color: #2f9e44;
                animation: correctPulse 0.6s ease;
            }
            
            .tf-button.correct .tf-icon,
            .tf-button.correct .tf-label {
                color: white;
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1) translateY(0); }
                50% { transform: scale(1.05) translateY(-10px); }
            }
            
            /* Estado: Errado */
            .tf-button.wrong {
                background: linear-gradient(135deg, #ff6b6b, #ff8787);
                border-color: #c92a2a;
                animation: wrongShake 0.5s ease;
            }
            
            .tf-button.wrong .tf-icon,
            .tf-button.wrong .tf-label {
                color: white;
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(-15px) translateY(-5px); }
                50% { transform: translateX(15px) translateY(-5px); }
                75% { transform: translateX(-10px) translateY(-5px); }
            }
            
            /* Responsivo */
            @media (max-width: 768px) {
                .true-false-container {
                    padding: 15px;
                }
                
                .tf-statement {
                    padding: 25px;
                }
                
                .statement-icon {
                    font-size: 3rem;
                }
                
                .statement-text {
                    font-size: 1.2rem;
                }
                
                .tf-buttons {
                    gap: 20px;
                }
                
                .tf-button {
                    padding: 30px 20px;
                }
                
                .tf-icon {
                    font-size: 3rem !important;
                }
                
                .tf-label {
                    font-size: 1.1rem !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Expor globalmente
window.TRUE_FALSE = TRUE_FALSE;

console.log('✓✗ true-false.js carregado!');
