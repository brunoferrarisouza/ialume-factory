// ===== BANCO DE QUESTOES =====

// QUIZ - Multipla Escolha
const QUESTOES_MATEMATICA = [
    {
        pergunta: "Quanto e 5 x 3?",
        alternativas: ["12", "15", "18", "20"],
        correta: 1,
        feedback_correto: "Perfeito! 5 x 3 = 15",
        feedback_errado: "Ops! Revise a tabuada do 5."
    },
    {
        pergunta: "Quanto e 20 / 4?",
        alternativas: ["3", "4", "5", "6"],
        correta: 2,
        feedback_correto: "Isso mesmo! 20 / 4 = 5",
        feedback_errado: "Tente dividir novamente!"
    },
    {
        pergunta: "Quanto e 8 + 7?",
        alternativas: ["13", "14", "15", "16"],
        correta: 2,
        feedback_correto: "Excelente! 8 + 7 = 15",
        feedback_errado: "Quase la! Some de novo."
    },
    {
        pergunta: "Quanto e 12 - 5?",
        alternativas: ["5", "6", "7", "8"],
        correta: 2,
        feedback_correto: "Parabens! 12 - 5 = 7",
        feedback_errado: "Revise a subtracao!"
    }
];

// VERDADEIRO OU FALSO
const QUESTOES_VERD_FALSO = [
    {
        afirmacao: "A agua ferve a 100 graus ao nivel do mar.",
        correta: true,
        feedback_correto: "Correto! A 100 graus ao nivel do mar",
        feedback_errado: "Na verdade, a agua ferve a 100 graus ao nivel do mar!"
    },
    {
        afirmacao: "O Sol gira em torno da Terra.",
        correta: false,
        feedback_correto: "Exato! A Terra gira em torno do Sol",
        feedback_errado: "Ops! A Terra que gira em torno do Sol!"
    },
    {
        afirmacao: "O coracao humano tem 4 camaras.",
        correta: true,
        feedback_correto: "Isso mesmo! 2 atrios e 2 ventriculos",
        feedback_errado: "Na verdade, o coracao tem SIM 4 camaras!"
    },
    {
        afirmacao: "A capital do Brasil e Sao Paulo.",
        correta: false,
        feedback_correto: "Correto! A capital e Brasilia",
        feedback_errado: "Ops! A capital do Brasil e Brasilia!"
    }
];

// PREENCHER LACUNAS
const QUESTOES_LACUNAS = [
    {
        frase: "O Brasil foi descoberto em ____.",
        resposta: "1500",
        variacoes_aceitas: ["1500"],
        dica: "Seculo XVI",
        feedback_correto: "Isso mesmo! Em 1500 por Pedro Alvares Cabral",
        feedback_errado: "O Brasil foi descoberto em 1500!"
    },
    {
        frase: "A capital do Brasil e ____.",
        resposta: "Brasilia",
        variacoes_aceitas: ["Brasilia", "brasilia"],
        dica: "Fica no Distrito Federal",
        feedback_correto: "Correto! Brasilia, inaugurada em 1960",
        feedback_errado: "A capital do Brasil e Brasilia!"
    },
    {
        frase: "A agua e composta por hidrogenio e ____.",
        resposta: "oxigenio",
        variacoes_aceitas: ["oxigenio", "O2"],
        dica: "H2O - O elemento O",
        feedback_correto: "Exato! H2O = 2 hidrogenios + 1 oxigenio",
        feedback_errado: "A agua e H2O: hidrogenio e oxigenio!"
    },
    {
        frase: "O maior planeta do Sistema Solar e ____.",
        resposta: "Jupiter",
        variacoes_aceitas: ["Jupiter", "jupiter"],
        dica: "Gigante gasoso",
        feedback_correto: "Isso! Jupiter e enorme!",
        feedback_errado: "O maior planeta e Jupiter!"
    }
];

// ORDENAR SEQUENCIA
const QUESTOES_SEQUENCIA = [
    {
        instrucao: "Ordene os planetas do mais proximo ao mais distante do Sol:",
        itens: ["Mercurio", "Venus", "Terra", "Marte"],
        ordem_correta: ["Mercurio", "Venus", "Terra", "Marte"],
        feedback_correto: "Perfeito! Essa e a ordem correta dos planetas!",
        feedback_errado: "Ops! Veja a ordem correta dos planetas."
    },
    {
        instrucao: "Ordene os numeros do menor para o maior:",
        itens: ["10", "3", "7", "1"],
        ordem_correta: ["1", "3", "7", "10"],
        feedback_correto: "Exato! Ordem crescente correta!",
        feedback_errado: "Quase! A ordem crescente e diferente."
    }
];

// Funcao para injetar quiz em uma fase
function injetarQuizNaFase(numeroFase, questao) {
    const fase = document.getElementById('phase-' + numeroFase);
    if (!fase) {
        console.error('Fase ' + numeroFase + ' nao encontrada!');
        return;
    }
    
    fase.innerHTML = '';
    const quizUI = QUIZ.createUI(questao);
    fase.appendChild(quizUI);
    
    console.log('Quiz injetado na Fase ' + numeroFase);
}

// Expor globalmente
window.QUESTOES_MATEMATICA = QUESTOES_MATEMATICA;
window.QUESTOES_VERD_FALSO = QUESTOES_VERD_FALSO;
window.QUESTOES_LACUNAS = QUESTOES_LACUNAS;
window.QUESTOES_SEQUENCIA = QUESTOES_SEQUENCIA;
window.injetarQuizNaFase = injetarQuizNaFase;

console.log('questoes.js carregado!');
