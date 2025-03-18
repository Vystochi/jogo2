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
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura, imagem);
        this.desaceleracao = 0.89;
        this.aceleracao = 1;
        this.velocidadeX = 0;
        this.velocidadey = 0;
        this.pulando = false;
        this.olhandoDireita = true;
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

    desenhar(ctx, teclas, imgPersonagem, imgPersonagemPulo, imgPersonagemAndando, imgPersonagemParado) {
        ctx.save();
    
        let largura = this.largura;
        let altura = this.altura;
        let posX = this.x; // Posição X original
        let posY = this.y; // Posição Y original
    
        // **Ajuste de tamanho quando o personagem estiver parado (aumentando largura e altura)**
        if (!teclas.direita && !teclas.esquerda && !this.pulando) {
            largura = this.largura * 1.9; // Aumenta a largura em 20% quando parado
            altura = this.altura * 1;   // Aumenta a altura em 20% quando parado
        } else if (this.pulando) {
            largura = this.largura * 1.8; // Aumenta a largura em 20% ao pular
            altura = this.altura * 1;   // Aumenta a altura em 20% ao pular
        } else if (teclas.direita || teclas.esquerda) {
            largura = this.largura * 1.6; // Aumenta a largura em 10% ao andar
            altura = this.altura * 1;   // Aumenta a altura em 10% ao andar
        }
    
        // **Determina o sprite atual**
        let spriteAtual;
                if (this.pulando) {
            spriteAtual = imgPersonagemPulo;
        } else if (teclas.direita || teclas.esquerda) {
            // Animação de andando
            let indiceAndando = Math.floor(Date.now() / 100) % imgPersonagemAndando.length;
            spriteAtual = imgPersonagemAndando[indiceAndando];
        } else {
            // Animação de parado (idle)
            let indiceParado = Math.floor(Date.now() / 200) % imgPersonagemParado.length;
            spriteAtual = imgPersonagemParado[indiceParado];
        }
        
        // Salva o estado do canvas
        ctx.save();
        
        // **Inverte a posição do personagem se necessário**
        if (!this.olhandoDireita) {
            ctx.scale(-1, 1);  // Inverte a imagem horizontalmente
            posX = -(this.x + largura); // Ajusta a posição X para o lado esquerdo
        } else {
            posX = this.x; // Posição normal para o lado direito
        }
        
        // **Desenha o personagem**
        ctx.drawImage(spriteAtual, posX, posY, largura, altura);
        
        // Restaura o estado do canvas
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
const imgTelaInicial = new Image();
imgTelaInicial.src = 'telainiio.png';

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
const imgPersonagemAndando = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
];
imgPersonagemAndando[0].src = 'walk.gif';
imgPersonagemAndando[1].src = 'walk2.gif';
imgPersonagemAndando[2].src = 'walk3.gif';
imgPersonagemAndando[3].src = 'walk4.gif';
imgPersonagemAndando[4].src = 'walk5.gif';
imgPersonagemAndando[5].src = 'walk6.gif';
const imgPersonagemParado = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
];
imgPersonagemParado[0].src = 'stand.png';
imgPersonagemParado[1].src = 'stand2.png';
imgPersonagemParado[2].src = 'stand3.png';
imgPersonagemParado[3].src = 'stand4.png';
imgPersonagemParado[4].src = 'stand5.png';
imgPersonagemParado[5].src = 'stand4.png';
const obstaculos = [
    new Obstaculo(850, chaoY - 80, 100, 80, imgObstaculo1, 5),
    new Obstaculo(1200, chaoY - 120, 110, 120, imgObstaculo2, 4),
    new Obstaculo(1500, chaoY - 130, 150, 130, imgObstaculo3, 6)
];

const personagem = new Personagem(100, chaoY - 140, 75, 140, imgPersonagem);    

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

        if (
            personagem.x < obs.x + obs.largura - margem &&
            personagem.x + personagem.largura > obs.x + margem &&
            personagem.y < obs.y + obs.altura - margem &&
            personagem.y + personagem.altura > obs.y + margem
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
            personagem.desenhar(ctx, teclas, imgPersonagem, imgPersonagemPulo, imgPersonagemAndando, imgPersonagemParado);
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