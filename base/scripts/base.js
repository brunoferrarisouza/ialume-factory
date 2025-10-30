// ESTADO DO JOGO
let gameState = {
    currentPhase: 0,
    score: 0,
    correctAnswers: 0,
    startTime: Date.now(),
    totalPhases: 4
};

// WEB AUDIO API
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    initAudio();
    
    const frequencies = {
        success: [523.25, 659.25, 783.99],
        error: [349.23, 293.66],
        victory: [523.25, 659.25, 783.99, 1046.50],
        click: [440]
    };
    
    const notes = frequencies[type] || frequencies.click;
    
    notes.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

// NAVEGACAO ENTRE FASES
function goToPhase(phaseNumber) {
    const phases = document.querySelectorAll('.phase');
    phases.forEach(phase => {
        phase.classList.remove('active');
    });
    
    const targetPhase = document.getElementById('phase-' + phaseNumber);
    if (targetPhase) {
        targetPhase.classList.add('active');
        gameState.currentPhase = phaseNumber;
        updatePhaseTitle(phaseNumber);
    } else {
        console.error('Fase ' + phaseNumber + ' nao encontrada!');
    }
}

function updatePhaseTitle(phaseNumber) {
    const titleElement = document.getElementById('phase-title');
    const titles = [
        'BEM-VINDO!',
        'FASE 1: DESCOBERTA',
        'FASE 2: COMPREENSAO',
        'FASE 3: APLICACAO',
        'FASE 4: CRIACAO'
    ];
    
    if (titleElement && titles[phaseNumber]) {
        titleElement.textContent = titles[phaseNumber];
    }
}

// FEEDBACK VISUAL
function showFeedback(message, type) {
    const feedbackZone = document.getElementById('feedback-zone');
    
    feedbackZone.textContent = message;
    feedbackZone.className = 'feedback ' + type + ' show';
    
    playSound(type === 'correct' ? 'success' : 'error');
    
    setTimeout(() => {
        feedbackZone.classList.remove('show');
    }, 3000);
}

// SISTEMA DE SCORE
function addScore(points) {
    gameState.score += points;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score;
        scoreElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function incrementCorrect() {
    gameState.correctAnswers++;
    const correctElement = document.getElementById('correct-count');
    if (correctElement) {
        correctElement.textContent = gameState.correctAnswers;
    }
}

// ACOES DO JOGO - CORRIGIDO
function startAdventure() {
    playSound('click');
    console.log('🚀 Aventura iniciada!');
    
    // Escalada já foi inicializada pelo Game Engine
    // Apenas ir para fase 1
    setTimeout(() => {
        goToPhase(1);
    }, 1500);
}

function nextPhase() {
    playSound('click');
    const nextPhaseNumber = gameState.currentPhase + 1;
    
    console.log('nextPhase chamado. Fase atual:', gameState.currentPhase, 'Proxima:', nextPhaseNumber);
    console.log('totalPhases:', gameState.totalPhases);
    
    if (nextPhaseNumber <= gameState.totalPhases) {
        // Apenas ir para próxima fase (o quiz já subiu o Lume)
        goToPhase(nextPhaseNumber);
    } else {
        console.log('Fim do jogo! Mostrando vitoria...');
        
        setTimeout(() => {
            showVictory();
        }, 1000);
    }
}

function showVictory() {
    playSound('victory');
    
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.style.display = 'none';
    }
    
    const gameContainer = document.querySelector('.game-container');
    
    const victoryHTML = `
        <div id="victory-overlay" style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 200;
            padding: 40px;
            animation: fadeIn 0.5s ease;
        ">
            <div style="
                background: white;
                border-radius: 30px;
                padding: 40px 50px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 600px;
                animation: scaleIn 0.5s ease;
            ">
                <div style="font-size: 5rem; margin-bottom: 15px;">
                    🏆
                </div>
                <h1 style="
                    font-size: 2.5rem;
                    color: #ffd700;
                    margin-bottom: 15px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                ">
                    VITORIA!
                </h1>
                <p style="
                    font-size: 1.3rem;
                    color: #212529;
                    margin-bottom: 25px;
                ">
                    Voce completou todas as fases!
                </p>
                <div style="
                    background: rgba(102, 126, 234, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                ">
                    <div style="margin-bottom: 15px;">
                        <span style="font-size: 1.2rem; font-weight: bold;">Pontos finais:</span>
                        <span style="font-size: 2rem; color: #ffd700; margin-left: 10px;">
                            ${gameState.score}
                        </span>
                    </div>
                    <div>
                        <span style="font-size: 1.2rem; font-weight: bold;">Acertos:</span>
                        <span style="font-size: 2rem; color: #51cf66; margin-left: 10px;">
                            ${gameState.correctAnswers}
                        </span>
                    </div>
                </div>
                <button onclick="location.reload()" style="
                    padding: 20px 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease;
                ">
                    JOGAR NOVAMENTE
                </button>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            #victory-overlay button:hover {
                transform: translateY(-3px) scale(1.05);
            }
        </style>
    `;
    
    gameContainer.insertAdjacentHTML('beforeend', victoryHTML);
    
    console.log('Jogo completo!');
    console.log('Score final:', gameState.score);
    console.log('Acertos:', gameState.correctAnswers);
}

function concludeGame() {
    console.log('Concluindo jogo...');
    
    if (window.ESCALADA && ESCALADA.currentStep < ESCALADA.totalSteps - 1) {
        console.log('Subindo Lume para o topo...');
        ESCALADA.climb();
        
        setTimeout(() => {
            showVictory();
        }, 1500);
    } else {
        console.log('Lume ja esta no topo!');
        showVictory();
    }
}

// VALIDACAO DE RESPOSTA GENERICA
function checkAnswer(userAnswer, correctAnswer, tolerance) {
    tolerance = tolerance || 0;
    let isCorrect = false;
    
    if (typeof userAnswer === 'number' && typeof correctAnswer === 'number') {
        isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    } else {
        isCorrect = userAnswer === correctAnswer;
    }
    
    if (isCorrect) {
        showFeedback('Correto! Muito bem!', 'correct');
        addScore(100);
        incrementCorrect();
        
        if (window.ESCALADA) {
            ESCALADA.onCorrect();
        }
        
        setTimeout(() => {
            nextPhase();
        }, 2000);
    } else {
        showFeedback('Ops! Tente novamente.', 'wrong');
        
        if (window.ESCALADA) {
            ESCALADA.onWrong();
        }
    }
    
    return isCorrect;
}
