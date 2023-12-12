// Adiciona a tabela do jogador 1, que é seu player 
let gridJogador = [            
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

// adiciona tabela do bot 
let gridNPC = [           
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

// "jogador" no inicio do jogo
let pontuacaoJogador = [0, 0, 0];          

// "bot" no inicio do jogo
let pontuacaoNPC = [0, 0, 0];             

atualizaTela();    

const dado = document.querySelector('#dado');

let dadoAtual = randomNumber();     // gera numero aleatorio

dado.textContent = dadoAtual;

colocarImagem();

 // adiciona dados nas colunas 

adcDadoJogador(0);      
adcDadoJogador(1);
adcDadoJogador(2);

// preenche a grid com os valor Matriz com [i][j];
function preencherGrid(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .cada-dado`)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            celula[index].textContent = vetor[i][j];
            index++;
        }
    }
} 


function preencherGridPontuacao(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .cada-dado-pontuacao`)
    for (let i = 0; i < vetor.length; i++) {
        celula[index].textContent = vetor[i];
        index++;
    }
}   // Preenche a pontuação baseado no gridPontuacao(vetor).


function preencherGridComImagens(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .cada-dado`)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            celula[index].innerHTML = '';
            if (vetor[i][j] >= 1 && vetor[i][j] <= 6) {
                const imgLocal = document.createElement('img');
                imgLocal.src = `dado${vetor[i][j]}.svg`;
                celula[index].appendChild(imgLocal);
            } 
            index++;
        }
    }
}   // coloca imagens na grid de 1 a 6.

// chama as funções.
function atualizaTelaComImagens() {
    preencherGridComImagens(gridJogador, '#jogador');
    preencherGridComImagens(gridNPC, '#npc');
}   

// ATUALIZA A PONTUACAO DE GRID PONTUACAO aparecendo acima da coluna, na celula 'pontuacao'
function attPontuacao(tipoGrid, tipoIdGrid) {
    const celulas = document.querySelectorAll(`${tipoIdGrid} .cada-dado-pontuacao`);
    for (let i = 0; i < 3; i++){
        let soma = 0;
        for (let j = 0; j < 3; j++){
            soma += tipoGrid[j][i] * contadorColuna(i, tipoGrid[j][i], tipoGrid);
        }
        celulas[i].textContent = soma;
    }
};   


// Conta os valores repetidos nas colunas.
function contadorColuna(coluna, valor, qualGrid){
    let vezes = 0;
    for(let i = 0; i < 3; i++){
        if(qualGrid[i][coluna] == valor){
            vezes++;
        }
    }
    return vezes;
  
}   

// atualiza a tela atualizando o estado do jogo apos as jogadas dos players
function atualizaTela() {
    preencherGrid(gridJogador, '#jogador');
    preencherGrid(gridNPC, '#npc');
    preencherGridPontuacao(pontuacaoJogador, '#pontuacaoJogador');
    preencherGridPontuacao(pontuacaoNPC, '#pontuacaoNPC');
    atualizaTelaComImagens();
    attPontuacao(gridJogador, '#pontuacaoJogador');
    attPontuacao(gridNPC, '#pontuacaoNPC');
}  


function adcDadoJogador(botao) {
    const botoes = document.querySelectorAll('.botao');
    let permitirClique = true;

    botoes[botao].addEventListener('click', () => {
        if (!permitirClique) {
            return;
        }
        permitirClique = false;
        atualizaTela();
        if (verificaFimDoJogo()) {
            return;
        }
        
        const colunaAtual = botao;
        let valorAtual = dadoAtual;

        const posicoesDisponiveis = posicoesDisponiveisJogador(colunaAtual);

        if(posicoesDisponiveis.length === 0){
            return;
        }

        const linha = posicoesDisponiveis[0];   // 0 porque é a primeira posição disponível
        gridJogador[linha][colunaAtual] = valorAtual;

        descartarDados(valorAtual, colunaAtual, gridNPC);
        atualizaTela();
        placar();
        
        if (verificaFimDoJogo()) {
            return;
        }

        dadoAtual = randomNumber();
        dado.textContent = dadoAtual;

        colocarImagem();

        setTimeout(() => {
            adcDadoNpc();
            atualizaTela();
            placar();
            permitirClique = true;
        }, 750);
    });
}   // O JOGO VAI RODAR DENTRO DESSA FUNCAO, QUE PREENCHE A GRID COM O VALOR DO DADO GERADO

// add dado aleatoriamente
function adcDadoNpc() {
    const posicoesDisponiveis = posicoesDisponiveisJogo(gridNPC);

    if (posicoesDisponiveis.length === 0) {
        return;
    }

    const numPosicaoAleatoria = Math.floor(Math.random() * posicoesDisponiveis.length);
    const posicaoAleatoria = posicoesDisponiveis[numPosicaoAleatoria];
    const linha = posicaoAleatoria[0];
    const coluna = posicaoAleatoria[1];

    const novoNumero = randomNumber();

    gridNPC[linha][coluna] = novoNumero;

    descartarDados(novoNumero, coluna, gridJogador);
}   


// verifica o fim do jogo
function verificaFimDoJogo() {
    const posicoesDisponiveisJ = posicoesDisponiveisJogo(gridJogador);
    const posicoesDisponiveisNPC = posicoesDisponiveisJogo(gridNPC);
    if (posicoesDisponiveisJ.length === 0 || posicoesDisponiveisNPC. length === 0) {
        dado.textContent = '';
        defineGanhador();
        return true;
    }
    return false;
}   

// posições disponiveis para o bot jogar.
function posicoesDisponiveisJogo(grid){
    let posicoesDisponiveis = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(grid[i][j].length === 0){
                posicoesDisponiveis.push([i, j]);
            }
        }
    }
    return posicoesDisponiveis;
}   

// posições possiveis na coluna
function posicoesDisponiveisJogador(coluna) {
    let posicoesDisponiveis = [];
    for(let i = 0; i < 3; i++){
        if(gridJogador[i][coluna].length === 0){
            posicoesDisponiveis.push(i);
        }
    }
    return posicoesDisponiveis;   
}  

function defineGanhador(){
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const ganhador = document.querySelector('#ganhador');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');

    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
    
    // condição para descobrir quem vai ser o vencedor do jogo
    if(pontuacaoJogador > pontuacaoNPC){
        ganhador.textContent = 'Ganhador: Jogador';
    } else {
        ganhador.textContent = 'Ganhador: NPC';
    }
}   


// atualiza o placar
function placar() {
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');
    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
}   

function descartarDados(valor, coluna, tipoGrid) {
    for (let i = 0; i < 3; i++) {
        if (tipoGrid[i][coluna] === valor) {
            tipoGrid[i][coluna] = [];
        }
    }
}   // SERVE PARA ELIMINAR O DADO JOGADO CASO ELE JA EXISTA NA MESMO COLUNA

function colocarImagem(){
    dado.innerHTML = '';
    const imgLocal = document.createElement('img');
    imgLocal.src = `dado${dadoAtual}.svg`;
    dado.appendChild(imgLocal);
}   

function somaPontucao(tipo){
    const celula = document.querySelectorAll(`${tipo} .cada-dado-pontuacao`);
    let soma = 0;
    for (let i = 0; i < 3; i++) {
        soma += parseInt(celula[i].textContent);
    }
    return soma;
}   // soma a pontuação.


// numero aleatorio.

function randomNumber() {
    return Math.floor(Math.random() * 6) + 1;
}   