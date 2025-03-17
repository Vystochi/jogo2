class Entidade {
    constructor(x, y, largura, altura, imagem) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
    }

    desenhar(ctx) {
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }
}

class Personagem extends Entidade {
    constructor(x, y, largura, altura, imagem, larguraPulo, alturaPulo, larguraAndando, alturaAndando) {
        super(x, y, largura, altura, imagem);
        this.desaceleracao = 0.89;
        this.aceleracao = 1;
        this.velocidadeX = 0;
        this.velocidadey = 0;
        this.pulando = false;
        this.larguraPulo = larguraPulo;
        this.alturaPulo = alturaPulo;
        this.olhandoDireita = true;
        this.larguraAndando = larguraAndando;
        this.alturaAndando = alturaAndando;
    }

    get gravidade() {
        return 0.5;
    }

    atualizar(teclas, chaoY) {
        if (teclas.direita) this.velocidadeX += this.aceleracao;
        else if (teclas.esquerda) this.velocidadeX -= this.aceleracao;
        else this.velocidadeX *= this.desaceleracao;

        this.velocidadeX = Math.max(-5, Math.min(5, this.velocidadeX));
        this.x += this.velocidadeX;

        if (this.pulando) {
            this.velocidadey -= this.gravidade;


            if (aceleracaoQueda > 0) {
                this.velocidadey -= aceleracaoQueda;
            }

            this.y -= this.velocidadey;

            if (this.y >= chaoY - this.altura) {
                this.y = chaoY - this.altura;
                this.velocidadey = 0;
                this.pulando = false;
            }
        }
    }

    desenhar(ctx, teclas, imgPersonagem, imgPersonagemPulo, imgAndando) {
        ctx.save();
        let largura, altura, imagemAtual;

        if (this.pulando) {
            largura = this.larguraPulo;
            altura = this.alturaPulo;
            imagemAtual = imgPersonagemPulo;
        } else if (teclas.direita || teclas.esquerda) {
            largura = this.larguraAndando;
            altura = this.alturaAndando;
            imagemAtual = imgAndando;
        } else {
            largura = this.largura;
            altura = this.altura;
            imagemAtual = imgPersonagem;
        }

        if (!this.olhandoDireita) {
            ctx.scale(-1, 1);
            ctx.drawImage(imagemAtual, -this.x - largura, this.y, largura, altura);
        } else {
            ctx.drawImage(imagemAtual, this.x, this.y, largura, altura);
        }

        ctx.restore();
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, imagem, velocidadex) {
        super(x, y, largura, altura, imagem);
        this.velocidadex = velocidadex;
    }

    atualizar(canvas) {
        this.x -= this.velocidadex;
        if (this.x <= -this.largura) {
            this.x = canvas.width + Math.random() * 200;
        }
    }
}

const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');

const chaoY = canvas.height - 43; 
let gameOver = false;
let aceleracaoQueda = 0;
let jogoIniciado = false;
let teclas = { esquerda: false, direita: false, espaco: false };
let fadeIn = false;
let alpha = 0;
let pontuacao = 0;

const imgPersonagem = new Image();
imgPersonagem.src = 'Parado.webp';
const imgPersonagemPulo = new Image();
imgPersonagemPulo.src = 'imagempulo.png';
const imgObstaculo1 = new Image();
imgObstaculo1.src = 'Crawlid.png';
const imgObstaculo2 = new Image();
imgObstaculo2.src = 'obstaculo medio.webp';
const imgObstaculo3 = new Image();
imgObstaculo3.src = 'obstaculo grande.webp';
const imgMorte = new Image();
imgMorte.src = 'gameOver.jpg';
const imgAndando = new Image();
imgAndando.src = 'andando.gif';

const obstaculos = [
    new Obstaculo(850, chaoY - 80, 100, 80, imgObstaculo1, 5),
    new Obstaculo(1200, chaoY - 120, 110, 120, imgObstaculo2, 4),
    new Obstaculo(1500, chaoY - 130, 150, 130, imgObstaculo3, 6)
];

const personagem = new Personagem(100, chaoY - 140, 75, 140, imgPersonagem, 140, 140, 130, 150);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
    if (e.code === 'KeyD') {
        teclas.direita = true;
        personagem.olhandoDireita = true;
    }
    if (e.code === 'KeyA') {
        teclas.esquerda = true;
        personagem.olhandoDireita = false;
    }
    if (e.code === 'KeyS') { 
        aceleracaoQueda = 1; 
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') teclas.direita = false;
    if (e.code === 'KeyA') teclas.esquerda = false;
    if (e.code === 'KeyS') { 
        aceleracaoQueda = 0;
    }
});

document.addEventListener('click', () => { if (gameOver) location.reload(); });

function desenharTelaInicial() {
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clique para começar', canvas.width / 2, canvas.height / 2);
}

document.addEventListener('click', () => {
    if (!jogoIniciado) {
        jogoIniciado = true;
        loop();
    } else if (gameOver) {
        location.reload(); 
    }
});

function desenharObstaculos() {
    obstaculos.forEach(obs => obs.desenhar(ctx));
}

function atualizarObstaculos() {
    obstaculos.forEach(obs => obs.atualizar(canvas));
}

function verificarColisao() {
    obstaculos.forEach(obs => {
        let margem = 20;

        let larguraPersonagem = personagem.pulando ? personagem.larguraPulo : personagem.largura;
        let alturaPersonagem = personagem.pulando ? personagem.alturaPulo : personagem.altura;

        let ajusteX = personagem.pulando ? (personagem.larguraPulo - personagem.largura) / 2 : 0;
        let ajusteY = personagem.pulando ? (personagem.altura - personagem.alturaPulo) / 2 : 0;

        if (!personagem.olhandoDireita) {
            ajusteX = -ajusteX; 
        }

        let xPersonagem = personagem.x + ajusteX;
        let yPersonagem = personagem.y + ajusteY;

        if (
            xPersonagem < obs.x + obs.largura - margem &&
            xPersonagem + larguraPersonagem > obs.x + margem &&
            yPersonagem < obs.y + obs.altura - margem &&
            yPersonagem + alturaPersonagem > obs.y + margem
        ) {
            HouveColisao();
        }
    });
}

function HouveColisao() {
    gameOver = true;
    personagem.velocidadey = 0;
    obstaculos.forEach(obs => obs.velocidadex = 0);
    ctx.drawImage(imgMorte, 0, 0, canvas.width, canvas.height);
}


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!jogoIniciado) {
        desenharTelaInicial();
    } else {
        if (!gameOver) {
            pontuacao += 1;

            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Pontuação: ' + pontuacao, 20, 30); 

            desenharObstaculos();
            personagem.desenhar(ctx, teclas, imgPersonagem, imgPersonagemPulo, imgAndando);
            verificarColisao();
            personagem.atualizar(teclas, chaoY);
            atualizarObstaculos();

            requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgMorte, 0, 0, canvas.width, canvas.height);


            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Pontuação Final: ' + pontuacao, canvas.width / 2, canvas.height / 2 + 50);
        }
    }
}


loop();