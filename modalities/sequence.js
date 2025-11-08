// ===== MODALIDADE: ORDENAR SEQUENCIA (DRAG AND DROP) =====

const SEQUENCE = {
    name: 'sequence',
    currentQuestion: null,
    currentOrder: [],
    draggedIndex: null,
    
    /**
     * ✅ MÉTODO INIT - Ponto de entrada para a modalidade
     * @param {Object} phaseData - Dados da fase
     */
    init: function(phaseData) {
        console.log('🎯 SEQUENCE.init() chamado com:', phaseData);
        
        // Criar e retornar a UI
        const ui = this.createUI(phaseData);
        
        return ui;
    },
    
    createUI: function(data) {
        const container = document.createElement('div');
        container.className = 'sequence-container';
        
        const headerBox = document.createElement('div');
        headerBox.className = 'seq-header';
        headerBox.innerHTML = '<div class="seq-icon">🔢</div><div class="seq-title">Arraste para ordenar:</div>';
        container.appendChild(headerBox);
        
        if (data.instrucao) {
            const instrBox = document.createElement('div');
            instrBox.className = 'seq-instruction';
            instrBox.textContent = data.instrucao;
            container.appendChild(instrBox);
        }
        
        this.currentOrder = this.shuffle([...data.itens]);
        
        const listBox = document.createElement('div');
        listBox.className = 'seq-list';
        listBox.id = 'seq-list';
        
        this.renderList(listBox, this.currentOrder);
        container.appendChild(listBox);
        
        const button = document.createElement('button');
        button.className = 'seq-button';
        button.textContent = '✓ CONFIRMAR ORDEM';
        button.onclick = () => this.checkAnswer(data);
        container.appendChild(button);
        
        this.injectCSS();
        this.currentQuestion = data;
        
        return container;
    },
    
    renderList: function(listBox, items) {
        listBox.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'seq-item';
            itemDiv.draggable = true;
            itemDiv.dataset.index = index;
            
            // Eventos de drag
            itemDiv.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
            itemDiv.addEventListener('dragover', (e) => this.handleDragOver(e));
            itemDiv.addEventListener('drop', (e) => this.handleDrop(e, index));
            itemDiv.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            const number = document.createElement('div');
            number.className = 'seq-number';
            number.textContent = index + 1;
            
            const text = document.createElement('div');
            text.className = 'seq-text';
            text.textContent = item;
            
            const dragIcon = document.createElement('div');
            dragIcon.className = 'seq-drag-icon';
            dragIcon.innerHTML = '&#8801;';
            
            itemDiv.appendChild(number);
            itemDiv.appendChild(text);
            itemDiv.appendChild(dragIcon);
            
            listBox.appendChild(itemDiv);
        });
    },
    
    handleDragStart: function(e, index) {
        this.draggedIndex = index;
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        playSound('click');
    },
    
    handleDragOver: function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    },
    
    handleDrop: function(e, dropIndex) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
            return;
        }
        
        // Reordenar array
        const draggedItem = this.currentOrder[this.draggedIndex];
        this.currentOrder.splice(this.draggedIndex, 1);
        this.currentOrder.splice(dropIndex, 0, draggedItem);
        
        // Re-renderizar
        const listBox = document.getElementById('seq-list');
        this.renderList(listBox, this.currentOrder);
        
        playSound('click');
    },
    
    handleDragEnd: function(e) {
        e.currentTarget.classList.remove('dragging');
        this.draggedIndex = null;
    },
    
    shuffle: function(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    },
    
    checkAnswer: function(data) {
        const button = document.querySelector('.seq-button');
        const items = document.querySelectorAll('.seq-item');
        
        button.disabled = true;
        
        // Desabilitar drag
        items.forEach(item => {
            item.draggable = false;
            item.style.cursor = 'default';
        });
        
        const isCorrect = JSON.stringify(this.currentOrder) === JSON.stringify(data.ordem_correta);
        
        if (isCorrect) {
            items.forEach(item => item.classList.add('correct'));
            button.classList.add('correct');

            showFeedback(data.feedback_correto || '✅ Perfeito!', 'correct');
            playSound('success');

        } else {
            items.forEach(item => item.classList.add('wrong'));
            button.classList.add('wrong');

            setTimeout(() => {
                items.forEach(item => item.classList.remove('wrong'));
                this.currentOrder = [...data.ordem_correta];
                const listBox = document.getElementById('seq-list');
                this.renderList(listBox, this.currentOrder);

                const newItems = document.querySelectorAll('.seq-item');
                newItems.forEach(item => {
                    item.classList.add('show-correct');
                    item.draggable = false;
                    item.style.cursor = 'default';
                });
            }, 1000);

            showFeedback(data.feedback_errado || '❌ Ops! Veja a ordem correta.', 'wrong');
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
        if (document.getElementById('sequence-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'sequence-styles';
        style.textContent = `
            .sequence-container { max-width: 700px; margin: 0 auto; padding: 8px; }
            .seq-header { background: #f8f9ff; border: 3px solid #a8b3d6; border-radius: 20px; padding: 20px; margin-bottom: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .seq-icon { font-size: 3.5rem; margin-bottom: 10px; }
            .seq-title { font-size: 1.3rem; font-weight: 600; color: #495057; }
            .seq-instruction { background: white; border: 3px solid #667eea; border-radius: 15px; padding: 20px; margin-bottom: 30px; font-size: 1.1rem; color: #495057; font-weight: 500; text-align: center; }
            .seq-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
            
            .seq-item { 
                background: white; 
                border: 3px solid #dee2e6; 
                border-radius: 15px; 
                padding: 15px 20px; 
                display: flex; 
                align-items: center; 
                gap: 15px; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
                cursor: grab;
                transition: all 0.2s ease;
                user-select: none;
            }
            
            .seq-item:hover {
                border-color: #667eea;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                transform: translateY(-2px);
            }
            
            .seq-item:active {
                cursor: grabbing;
            }
            
            .seq-item.dragging {
                opacity: 0.5;
                cursor: grabbing;
                transform: rotate(3deg);
            }
            
            .seq-number { 
                background: linear-gradient(135deg, #667eea, #764ba2); 
                color: white; 
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: 700; 
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .seq-text { 
                flex: 1; 
                font-size: 1.1rem; 
                font-weight: 600; 
                color: #212529; 
            }
            
            .seq-drag-icon {
                font-size: 1.5rem;
                color: #adb5bd;
                cursor: grab;
                flex-shrink: 0;
            }
            
            .seq-item:active .seq-drag-icon {
                cursor: grabbing;
            }
            
            .seq-item.correct { 
                background: linear-gradient(135deg, #d3f9d8, #b2f2bb); 
                border-color: #51cf66;
                animation: correctPulse 0.6s ease;
            }
            
            .seq-item.correct .seq-number { 
                background: linear-gradient(135deg, #51cf66, #38d9a9); 
            }
            
            .seq-item.wrong { 
                background: linear-gradient(135deg, #ffe0e0, #ffc9c9); 
                border-color: #ff6b6b; 
                animation: shake 0.5s; 
            }
            
            .seq-item.show-correct { 
                background: linear-gradient(135deg, #d3f9d8, #b2f2bb); 
                border-color: #51cf66; 
            }
            
            .seq-item.show-correct .seq-number { 
                background: linear-gradient(135deg, #51cf66, #38d9a9); 
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            @keyframes shake { 
                0%, 100% { transform: translateX(0); } 
                25% { transform: translateX(-10px); } 
                50% { transform: translateX(10px); } 
                75% { transform: translateX(-5px); } 
            }
            
            .seq-button { 
                width: 100%; 
                padding: 20px; 
                font-size: 1.3rem; 
                font-weight: 700; 
                background: linear-gradient(135deg, #667eea, #764ba2); 
                color: white; 
                border: none; 
                border-radius: 15px; 
                cursor: pointer; 
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); 
                transition: all 0.3s ease;
            }
            
            .seq-button:hover:not(:disabled) { 
                transform: translateY(-3px); 
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            
            .seq-button:disabled { 
                opacity: 0.6; 
                cursor: not-allowed; 
            }
            
            .seq-button.correct { 
                background: linear-gradient(135deg, #51cf66, #38d9a9); 
            }
            
            .seq-button.wrong { 
                background: linear-gradient(135deg, #ff6b6b, #ff8787); 
            }
        `;
        
        document.head.appendChild(style);
    }
};

window.SEQUENCE = SEQUENCE;
console.log('🔢 sequence.js carregado com drag and drop!');
