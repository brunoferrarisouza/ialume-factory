// ===== MODALIDADE: QUIZ =====
// Múltipla escolha com 4 alternativas

const QUIZ = {
    name: 'quiz',
    currentQuestion: null,
    
    /**
     * ✅ MÉTODO INIT - Ponto de entrada para a modalidade
     * @param {Object} phaseData - Dados da fase
     */
    init: function(phaseData) {
        console.log('🎯 QUIZ.init() chamado com:', phaseData);
        
        // Criar e retornar a UI
        const ui = this.createUI(phaseData);
        
        return ui;
    },
    
    // Criar UI do quiz
    createUI: function(data) {
        const container = document.createElement('div');
        container.className = 'quiz-container';
        
        // Pergunta
        const questionBox = document.createElement('div');
        questionBox.className = 'quiz-question';
        questionBox.innerHTML = `
            <div class="question-icon">❓</div>
            <div class="question-text">${data.pergunta}</div>
        `;
        container.appendChild(questionBox);
        
        // Alternativas
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'quiz-options';
        
        data.alternativas.forEach((alternativa, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            
            // Letras A, B, C, D
            const letter = String.fromCharCode(65 + index);
            button.innerHTML = `
                <span class="option-letter">${letter}</span>
                <span class="option-text">${alternativa}</span>
            `;
            
            button.setAttribute('data-index', index);
            
            // ✅ Usar bind(this) para manter contexto correto
            button.onclick = this.selectOption.bind(this, index, data.correta, data);
            
            optionsContainer.appendChild(button);
        });
        
        container.appendChild(optionsContainer);
        
        // Injetar CSS se ainda não foi
        this.injectCSS();
        
        this.currentQuestion = data;
        
        return container;
    },
    
    // Selecionar opção
    selectOption: function(selectedIndex, correctIndex, data) {
        const isCorrect = selectedIndex === correctIndex;
        
        // ✅ PEGAR SOMENTE botões da fase ATIVA (não de todas as fases!)
        const currentPhase = document.querySelector('.phase.active');
        if (!currentPhase) {
            console.error('❌ Fase ativa não encontrada!');
            return;
        }
        
        const buttons = currentPhase.querySelectorAll('.quiz-option');
        
        console.log('🎯 Resposta selecionada:', selectedIndex, '| Correta:', correctIndex, '| Acertou:', isCorrect);
        console.log('🔘 Desabilitando', buttons.length, 'botões da fase atual');
        
        // Desabilitar todos os botões DA FASE ATUAL
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.6';
        });
        
        // Marcar resposta selecionada
        const selectedButton = buttons[selectedIndex];
        const correctButton = buttons[correctIndex];
        
        if (isCorrect) {
            // ACERTOU
            selectedButton.classList.add('correct');
            selectedButton.style.opacity = '1';

            // Feedback
            const feedbackMsg = data.feedback_correto || '✅ Correto! Muito bem!';
            showFeedback(feedbackMsg, 'correct');
            playSound('success');

        } else {
            // ERROU
            selectedButton.classList.add('wrong');
            selectedButton.style.opacity = '1';

            // Mostrar resposta correta após 500ms
            setTimeout(() => {
                correctButton.classList.add('correct');
                correctButton.style.opacity = '1';
            }, 500);

            // Feedback
            const feedbackMsg = data.feedback_errado || '❌ Ops! A resposta correta era a alternativa ' + String.fromCharCode(65 + correctIndex);
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
        if (document.getElementById('quiz-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'quiz-styles';
        style.textContent = `
            /* Container do Quiz */
            .quiz-container {
                max-width: 700px;
                margin: 0 auto;
                padding: 8px;
            }
            
            /* Pergunta */
            .quiz-question {
                background: white;
                border: 3px solid #667eea;
                border-radius: 20px;
                padding: 8px;
                margin-bottom: 15px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .question-icon {
                font-size: 3rem;
                margin-bottom: 10px;
                animation: bounce 2s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            .question-text {
                font-size: 1.4rem;
                font-weight: 600;
                color: #212529;
            }

            /* Alternativas */
            .quiz-options {
                display: grid;
                gap: 15px;
            }

            .quiz-option {
                display: flex;
                align-items: center;
                padding: 8px;
                background: white;
                border: 3px solid #dee2e6;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            
            .quiz-option:hover:not(:disabled) {
                transform: translateX(10px);
                border-color: #667eea;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                background: linear-gradient(to right, #ffffff, #f8f9ff);
            }
            
            .quiz-option:active:not(:disabled) {
                transform: translateX(5px);
            }
            
            /* Letra da alternativa */
            .option-letter {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                font-weight: bold;
                font-size: 1.2rem;
                border-radius: 50%;
                margin-right: 20px;
                flex-shrink: 0;
                transition: transform 0.3s ease;
            }
            
            .quiz-option:hover:not(:disabled) .option-letter {
                transform: scale(1.2) rotate(10deg);
            }
            
            /* Texto da alternativa */
            .option-text {
                font-size: 1.1rem;
                font-weight: 500;
                color: #212529;
                line-height: 1.5;
            }
            
            /* Estado: Correta */
            .quiz-option.correct {
                background: linear-gradient(135deg, #51cf66, #38d9a9);
                border-color: #37b24d;
                animation: correctPulse 0.6s ease;
            }
            
            .quiz-option.correct .option-letter {
                background: #2f9e44;
            }
            
            .quiz-option.correct .option-text {
                color: white;
                font-weight: 700;
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1) translateX(0); }
                50% { transform: scale(1.03) translateX(10px); }
            }
            
            /* Estado: Errada */
            .quiz-option.wrong {
                background: linear-gradient(135deg, #ff6b6b, #ff8787);
                border-color: #f03e3e;
                animation: wrongShake 0.5s ease;
            }
            
            .quiz-option.wrong .option-letter {
                background: #c92a2a;
            }
            
            .quiz-option.wrong .option-text {
                color: white;
                font-weight: 700;
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                50% { transform: translateX(10px); }
                75% { transform: translateX(-5px); }
            }
            
            /* Responsivo */
            @media (max-width: 768px) {
                .quiz-container {
                    padding: 8px;
                }

                .quiz-question {
                    padding: 8px;
                }

                .question-icon {
                    font-size: 2.5rem;
                }

                .question-text {
                    font-size: 1.1rem;
                }

                .quiz-option {
                    padding: 8px;
                }
                
                .option-letter {
                    width: 35px;
                    height: 35px;
                    font-size: 1rem;
                    margin-right: 15px;
                }
                
                .option-text {
                    font-size: 1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Expor globalmente
window.QUIZ = QUIZ;

console.log('📝 quiz.js carregado!');
