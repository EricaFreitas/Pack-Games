const canvas = document.querySelector("canvas")

const contexto = canvas.getContext("2d") 

const pontuacao = document.querySelector(".pontuacao--valor") 

const pontuacaoFinal = document.querySelector(".pontuacao-final > span") 

const menu = document.querySelector(".menu-screen")

const botaoPlay = document.querySelector(".botao-play")

const audio = new Audio("./assets/audio.mp3") 
const audioFundo = new Audio("./assets/audioFundo.mp3")
const botaoMute = document.querySelector(".botao-mute");

let audioMuted = false;
botaoMute.addEventListener("click", () => {
    audioMuted = !audioMuted;

    if (audioMuted) {
        audio.muted = true;
        audioFundo.muted = true;
        botaoMute.innerText = "🔇";
    } else {
        audio.muted = false;
        audioFundo.muted = false;
        botaoMute.innerText = "🔊";
    }
});

const tamanho = 30

const posicaoInicial = { x: 270, y: 240 }

let cobra = [posicaoInicial] 

const recorde = localStorage.getItem('recorde') || 0; /*Recupera o recorde do armazenamento local. Se nenhum recorde existir, ele assume o valor 0*/
const recordeElemento = document.createElement('div'); /*Cria um novo elemento div no DOM*/
recordeElemento.classList.add('recorde'); /*Adiciona a classe CSS ‘recorde’ ao novo elemento div*/
recordeElemento.innerText = `Recorde: ${recorde}`;
document.body.insertBefore(recordeElemento, canvas); /*Insere o elemento div antes do elemento canvas no corpo do HTML*/

const adicionarPontuacao = () => {
    pontuacao.innerText = (+pontuacao.innerText + 10).toString().padStart(2, '0');/*extrai a pontuação atual do elemento com o ID pontuacao e convert para um número inteiro, adc 10 ao valor converte pra string e garante que ele tenha pelo menos 2 dígitos, preenchendo com zeros à esquerda, se necessário*/
}

const numeroAleatorio = (min, max) => { 
    return Math.round(Math.random() * (max - min) + min) 
}

const posicaoAleatoria = () => { 
    const numero = numeroAleatorio(0, canvas.width - tamanho) 
    return Math.round(numero / 30) * 30
}

const corAleatoria = () => { 
    const vermelho = numeroAleatorio(0, 255) 
    const verde = numeroAleatorio(0, 255)
    const azul = numeroAleatorio(0, 255)

    return `rgb(${vermelho}, ${verde}, ${azul})`
}

const comida = { 
    x: posicaoAleatoria(),
    y: posicaoAleatoria(),
    cor: corAleatoria()
}

let direcao, loopId

const desenhoComida = () => {
    const { x, y, cor } = comida 

    contexto.shadowColor = cor
    contexto.shadowBlur = 6
    contexto.fillStyle = cor
    contexto.fillRect(x, y, tamanho, tamanho)
    contexto.shadowBlur = 0
}

const desenhoCobra = () => {
    cobra.forEach((posicao, index) => {
        if (index == cobra.length - 1) {
            contexto.fillStyle = "#008000"
            contexto.fillRect(posicao.x, posicao.y, tamanho, tamanho)
        } else {
            contexto.fillStyle = "#006400"
            contexto.fillRect(posicao.x, posicao.y, tamanho, tamanho)
            contexto.strokeStyle = '#008000'
            contexto.lineWidth = 1;
            contexto.strokeRect(posicao.x, posicao.y, tamanho, tamanho)
        }

    })
}

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direcao != "esquerda") {
        direcao = "direita"
    }

    if (key == "ArrowLeft" && direcao != "direita") {
        direcao = "esquerda"
    }

    if (key == "ArrowDown" && direcao != "cima") {
        direcao = "baixo"
    }

    if (key == "ArrowUp" && direcao != "baixo") {
        direcao = "cima"
    }

    if (key == "d" && direcao != "esquerda") {
        direcao = "direita"
    }

    if (key == "a" && direcao != "direita") {
        direcao = "esquerda"
    }

    if (key == "s" && direcao != "cima") {
        direcao = "baixo"
    }

    if (key == "w" && direcao != "baixo") {
        direcao = "cima"
    }
})

const moverCobra = () => {
    if (!jogoEmAndamento) return
    if (!direcao) return

    const cabeca = cobra[cobra.length - 1]

    if (direcao == "direita") {
        cobra.push({ x: cabeca.x + tamanho, y: cabeca.y })
    }

    if (direcao == "esquerda") {
        cobra.push({ x: cabeca.x - tamanho, y: cabeca.y })
    }

    if (direcao == "baixo") {
        cobra.push({ x: cabeca.x, y: cabeca.y + tamanho })
    }

    if (direcao == "cima") {
        cobra.push({ x: cabeca.x, y: cabeca.y - tamanho })
    }

    cobra.shift()
}

const checarComida = () => {
    const cabeca = cobra[cobra.length - 1]

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        adicionarPontuacao()
        cobra.push(cabeca)
        audio.play()

        let x = posicaoAleatoria()
        let y = posicaoAleatoria()

        while (cobra.find((posicao) => posicao.x == x && posicao.y == y)) {
            x = posicaoAleatoria()
            y = posicaoAleatoria()
        }

        comida.x = x
        comida.y = y
        comida.cor = corAleatoria()
    }
}

const checarColisao = () => {
    const cabeca = cobra[cobra.length - 1]
    const canvasLimite = canvas.width - tamanho
    const pescocoIndex = cobra.length - 2

    const paredeColisao =
        cabeca.x < 0 || cabeca.x > canvasLimite || cabeca.y < 0 || cabeca.y > canvasLimite

    const autoColisao = cobra.find((posicao, index) => {
        return index < pescocoIndex && posicao.x == cabeca.x && posicao.y == cabeca.y
    })

    if (paredeColisao || autoColisao) {
        gameOver()
    }
}

let jogoEmAndamento = true

const gameOver = () => {
    direcao = undefined

    jogoEmAndamento = false
    menu.style.display = "flex"
    pontuacaoFinal.innerText = pontuacao.innerText

    const pontuacaoAtual = parseInt(pontuacao.innerText, 10); /*extrai a pontuação atual do elemento com o ID pontuacao e convert para um número inteiro*/
    if (pontuacaoAtual > parseInt(recorde, 10)) { /*verifica se a pontuação atual é maior do que o recorde armazenado, se for verdade ele atualiza o recorde com a pontuação atual*/
        localStorage.setItem('recorde', pontuacaoAtual);/*armazena a pontuação atual como o novo recorde no armazenamento local. O armazenamento local permite que você armazene dados persistentemente no navegador do usuário*/
        recordeElemento.innerText = `Recorde: ${pontuacaoAtual}`;
    }

    canvas.style.filter = "blur(2px)"
}

const reiniciarJogo = () => {
    pontuacao.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    cobra = [posicaoInicial]
    jogoEmAndamento = true
}

const gameLoop = () => {
    clearInterval(loopId)

    contexto.clearRect(0, 0, 600, 600)
    desenhoComida()
    moverCobra()
    desenhoCobra()
    checarComida()
    checarColisao()
    audioFundo.play()

    loopId = setTimeout(() => {
        gameLoop()
    }, 200)
}

gameLoop()

botaoPlay.addEventListener("click", () => {
    pontuacao.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    reiniciarJogo()

    cobra = [posicaoInicial]
})