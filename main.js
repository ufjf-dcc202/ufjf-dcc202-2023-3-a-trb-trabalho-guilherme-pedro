import { matPlayer, matBot, pontuacaoPlayer, pontuacaoBot } from './auxiliar.js';

// PRIMEIRO PASSO
// Cria um link da variável dado em js com o id "dado" em html
let dado = document.getElementById('dado');

// dadoSorteado recebe um valor aleatório de 1 a 6 gerado pela funcao sorteiaNumero
let dadoSorteado = sorteiaNumero();

// Gera um número aleatório entre 1 e 6
function sorteiaNumero() {
    return Math.floor(Math.random() * 6) + 1;
}

// Exibe o número atual no dado
dado.textContent = dadoSorteado;

// SEGUNDO PASSO
// Adiciona uma imagem na tela do usuário correspondente ao dado específico
addImagem();
function addImagem(){

    // Limpa qualquer conteúdo existente, para que a imagem seja o único elemento
    dado.innerText = '';

    // Cria um elemento <img> e obtem o atributo 'src' da imagem
    let criaImg = document.createElement('img');
    criaImg.src = `dado${dadoSorteado}.gif`;

    // Declara a imagem como filho de dado
    dado.appendChild(criaImg);
}

// TERCEIRO PASSO
// Atualiza a tela do jogo com base nos dados presentes nas matrizes matPlayer e matBot
attTela();
function attTela(){

    // Preenche a pontuacao dos jogadores com seus respectivos parametros
    carregaPont(pontuacaoPlayer, '#pontuacaoPlayer');
    carregaPont(pontuacaoBot, '#pontuacaoBot');

    // Preenche o tabuleiro dos jogadores com seus respectivos parametros
    carregaMat(matPlayer, '#player');
    carregaMat(matBot, '#bot');

    // Recalcula e atualiza as pontuações finais do player e do bot
    pontuacao(matPlayer, '#pontuacaoPlayer');
    pontuacao(matBot, '#pontuacaoBot');

    // Exibe a matriz dos jogadores com as imagens dos dados
    attImagem();
}

// Função que preenche cada espaco da pontuação no HTML de algum jogador (player ou bot), com os valores correspondentes de seu vetor
function carregaPont(vetor, escolheID) {
    let casa = document.querySelectorAll(`${escolheID} .espaco-pontuacao`) // Link da casa com "espaco-pontuacao" do jogador da vez
    for (let i = 0; i < vetor.length; i++) {
        let indice = 0;
        casa[indice].textContent = vetor[i]; // Preenche as casas (espaco-pontuacao) com os valores de cada posição da vetor
        indice++;
    }
} // vetor -> pontuacaoPlayer ou pontuacaoBot  ----//----  escolheID -> #pontuacaoPlayer ou #pontuacaoBot


// Funcao que preenche cada casa do tabuleiro no HTML de algum jogador (player ou bot), com os valores correspondentes da matriz
function carregaMat(matriz, escolheID) {
    let casa = document.querySelectorAll(`${escolheID} .espaco-dado`) // Link da variável casa em js com a classe "espaco-dado" da id do jogador da vez
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            let indice = 0;
            casa[indice].textContent = matriz[i][j]; // Preenche as casas (espaco-dado) com os valores de cada posicao da matriz
            indice++;
        }
    }
} // matriz -> matPlayer ou matBot  ----//----  escolheID -> #player ou #bot


// Função que preenche cada casa do tabuleiro no HTML de algum jogador (player ou bot), com a imagem correspondentes do valor da matriz
function carregaMatImg(matriz, escolheID) {
    let casa = document.querySelectorAll(`${escolheID} .espaco-dado`) // Link da casa com "espaco-dado" de seu respectivo jogador
    let indice = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            casa[indice].innerHTML = ''; // Apaga conteúdo dentro de casa
            if (matriz[i][j] >= 1 && matriz[i][j] <= 6) {
                let criaImg = document.createElement('img'); // Cria uma nova img e a declara como 'filho' de casa, preenchendo o espaco com uma img
                criaImg.src = `dado${matriz[i][j]}.gif`;
                casa[indice].appendChild(criaImg);
            } 
            indice++;
        }
    }
} // matriz -> matPlayer ou matBot  ----//----  escolheID -> #player ou #bot


// Atualiza visualmente as matrizes do player e do bot com imagens dos dados lançados
function attImagem() {
    carregaMatImg(matPlayer, '#player'); // Chama a função usando como parametros a matriz de player do js e a id '#player' do HTML
    carregaMatImg(matBot, '#bot'); // Chama a função usando como parametros a matriz do bot do js e a id '#bot' do HTML
}


// Calcula e atualiza visualmente a pontuação associada ao player ou bot em um jogo
function pontuacao(matriz, escolheID) {
    let casa = document.querySelectorAll(`${escolheID} .espaco-pontuacao`); // Linka 'casa' com "espaco-pontuacao" do jogador da vez
    for (let i = 0; i < 3; i++){
        let acc = 0; // Cria acumulador
        for (let j = 0; j < 3; j++){
            acc += matriz[j][i] * contaColuna(i, matriz[j][i], matriz); // 'acc' recebe a multiplicação do valor da casa pela quantidade de vezes que este
        }                                                               //  valor aparece na mesma coluna
        casa[i].textContent = acc; // Atualiza a pontuação das colunas
    }
} // matriz -> matPlayer ou matBot  ----//----  escolheID -> #pontuacaoPlayer ou #pontuacaoBot


// Conta quantas vezes um determinado valor ocorre em uma coluna específica de uma matriz.
function contaColuna(coluna, valor, matriz){
    let vezes = 0;
    for(let i = 0; i < 3; i++){ // Roda apenas nas linhas da matriz

        if(matriz[i][coluna] == valor){   // Verifica se o valor na coluna especificada é igual ao valor do dado

            vezes++; // Se for verdadeiro, aumenta em 1 a quantidade de vezes que é multiplicado o valor do dado
        }
    }
    return vezes; // Retorna o número de vezes que o valor ocorre na coluna especificada

} // coluna -> i  ----//----  valor -> valor do dado  ----//----  matriz --> matPlayer ou matBot


// QUARTO PASSO
// Adiciona um dado a matriz do player quando um dos 3 botões é clicado
jogadaPlayer(0);       
jogadaPlayer(1);
jogadaPlayer(2);
function jogadaPlayer(botoes) {

    let botao = document.querySelectorAll('.botao'); // Linka botao com todas as classes 'botao' no HTML
    let permiteClick = true;

    botao[botoes].addEventListener('click', () => { // Associa um evento de clique ao botão específico identificado pelo parâmetro botoes

        if (!permiteClick) { // Se nao for permitido click, a funcao retorna e nao executa mais nada
            return;
        }

        permiteClick = false; // Impede o player clickar várias vezes seguidas e jogar antes do bot

        attTela(); // Atualiza a tela depois do click

        if (termino()) { // Chama funcao para verificar o fim do jogo
            return; // Se for verdadeiro a funcao retorna e nao executa mais nada
        }
        // Se for falso, o programa continua

        // Obtém a coluna atual do botao clickado e o valor do dado
        let coluna = botoes;
        let valor = dadoSorteado;

        // Verifica as casas disponiveis para o player
        let casasLivres = casasLivresPlayer(coluna);
        if(casasLivres.length === 0){
            return; // Se nao tiver posicao disponível, retorna e nao acontece nada
        }

        // Adiciona o valor atual do dado ao grid do player na posição encontrada
        let linha = casasLivres[0]; // Adiciona sempre a primeira posicao disponível
        matPlayer[linha][coluna] = valor;

        // Verifica se há dados com o mesmo valor na mesma coluna do bot
        eliminaDado(valor, coluna, matBot);
        attTela(); // Reflete as mudancas feitas

        // Gera um novo valor para o dado e atualiza o seu valor, e depois sua imagem
        dadoSorteado = sorteiaNumero();
        dado.textContent = dadoSorteado;
        addImagem();
        
        // Realiza a jogada aleatória do bot
        jogadaBot();

        // Atualizar as alterações após a jogada do bot
        attTela();

        // Permite novamente o click do player
        permiteClick = true;

        attTela(); // Reflete as mudancas feitas

        if (termino()) { // Verifica novamente após a jogada do player se o jogo chegou ao fim
            return;
        }

    });
} // botoes -> botao 0, botao 1 ou botao 2


// Verifica se o jogo chegou ao fim, se não houver mais casas disponíveis para jogadas, tanto para o player quanto para o bot
function termino() {

    // Obtem as casas disponíveis nas matrizes do player e do bot
    let casasLivresP = casasLivresGeral(matPlayer);
    let casasLivresB = casasLivresGeral(matBot);

    // Verifica se não há mais casas livres para o player ou para o bot
    if (casasLivresP.length == 0 || casasLivresB. length == 0) {
        vencedor(); // Define o vencedor
        return true; // Retorna true indicando que o jogo chegou ao fim
    }
    return false; // Se nao, retorna false indicando que o jogo nao acabou
}

// Encontra e retorna as casas disponíveis em determinada matriz, verificando se há algum espaco vazio, indicando uma casa livre
function casasLivresGeral(matriz){

    // Declara um vetor vazio que armazena posições disponíveis no formato [linha, coluna]
    let casasLivres = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            // Verifica se a celula atual na matriz está vazia
            if(matriz[i][j].length == 0){
                // Adiciona a posição [linha, coluna] ao vetor de casas disponíveis
                casasLivres.push([i, j]);
            }
        }
    }
    return casasLivres; // Retorna o vetor contendo todas as casa disponíveis

} // matriz -> matPlayer ou matBot


// Determina o vencedor do jogo com base nas pontuações do player e do bot
function vencedor(){

    // Obtém as pontuações do player e do bot usando a função somaPontos
    let pontuacaoPlayer = somaPontos('#pontuacaoPlayer');
    let pontuacaoBot = somaPontos('#pontuacaoBot');

    // Linka os elementos HTML que exibem o vencedor
    let vencedor = document.getElementById('fim-de-jogo');

    // Compara as pontuações e determina quem venceu
    if(pontuacaoPlayer > pontuacaoBot){
        vencedor.textContent = 'FIM DE JOGO';
        let msg = "PARABÉNS! VOCÊ VENCEU!";
        alert(msg);
    } else {
        vencedor.textContent = 'FIM DE JOGO';
        let msg = "TENTE NOVAMENTE! O BOT VENCEU! :(";
        alert(msg);
    }
}

// Encontra e retorna as linhas disponíveis para uma jogada do player em uma coluna específica da matriz
function casasLivresPlayer(coluna) {

    // Armazena as linhas disponíveis para o player na coluna especificada
    let casasLivres = [];

    for(let i = 0; i < 3; i++){
        // Verifica se a celula na coluna especificada está vazia
        if(matPlayer[i][coluna].length === 0){
            // Adiciona a linha ao vetor de linhas disponíveis
            casasLivres.push(i);
        }
    }
    return casasLivres; // Retorna o vetor contendo todas as linhas livres na coluna especificada
}

// Remove um valor específico de uma coluna em uma determinada coluna de uma matriz
function eliminaDado(valor, coluna, matriz) {

    for (let i = 0; i < 3; i++) {
        // Verifica se o valor na posição atual da coluna é igual ao valor fornecido pelo parametro
        if (matriz[i][coluna] === valor) {
            // Se for encontrado, atribui um vetor vazio à posição correspondente na coluna, removendo o valor.
            matriz[i][coluna] = [];
        }
    }
} // Valor -> valor de um dado específico -------//------- coluna -> coluna em que o valor está -------//------- matriz -> matPlayer ou matBot


// Soma os valores contidos nas casas de uma coluna específica
function somaPontos(escolheID){

    // Seleciona todas as casas da pontuação de uma coluna específica
    let casa = document.querySelectorAll(`${escolheID} .espaco-pontuacao`);
    let soma = 0;
    for (let i = 0; i < 3; i++) {
        soma += parseInt(casa[i].textContent); // Converte uma string em um número inteiro
    }
    return soma; // Retorna a soma de sua coluna

} // escolheID -> #pontuacaoPlayer ou #pontuacaoBot


// Realiza a jogada do bot, adicionando um dado a matriz do bot em uma posição aleatória disponível
function jogadaBot() {
    
    // Verifica as casas livres para o bot, se nao houver mais espaco, retorna sem executar
    let casasLivres = casasLivresGeral(matBot);
    if (casasLivres.length === 0) {
        return;
    }

    // Se houver, gera um indice aleatório para uma posicao disponivel
    let posicaoGerada = Math.floor(Math.random() * casasLivres.length);
    let posicaoAleatoria = casasLivres[posicaoGerada]; // posicaoAleatória é um vetor que acumula dois valores

    // O primeiro valor representa a linha, e o segundo valor a coluna
    let linha = posicaoAleatoria[0];
    let coluna = posicaoAleatoria[1];

    // Gera um novo dado para ser utilizado pelo bot
    let novoDado = sorteiaNumero();

    // Armazena o novo dado na matriz do bot
    matBot[linha][coluna] = novoDado;

    // Verifica se há dados com o mesmo valor na mesma coluna da matriz do player para poder eliminar
    eliminaDado(novoDado, coluna, matPlayer);
}