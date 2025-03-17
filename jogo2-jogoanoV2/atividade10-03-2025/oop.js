class veiculo {
    #velocidade;

    constructor(marca, tipo, cor, velocidade, passageiros) {
        this.marca = marca;
        this.tipo = tipo;
        this.cor = cor;
        this.#velocidade = velocidade;
        this.passageiros = passageiros;
    }

    #acelerar(incremento) {
        this.#velocidade += incremento;
        console.log(`A velocidade do ${this.tipo} agora é ${this.#velocidade}.`);
    }

    #frear(decremento) {
        this.#velocidade -= decremento;
        if (this.#velocidade < 0) this.#velocidade = 0;
        console.log(`A velocidade do ${this.tipo} agora é ${this.#velocidade}.`);
    }

    acelerar(incremento) {
        this.#acelerar(incremento);
    }

    frear(decremento) {
        this.#frear(decremento);
    }

    get velocidade() {
        return this.#velocidade;
    }
}

class jato extends veiculo {
    constructor(marca, tipo, velocidade, passageiros, modelo) {
        super(marca, tipo, velocidade, passageiros);
        this.modelo = modelo;
    }

    acelerar(incrementoMach) {
        super.acelerar(incrementoMach);
        console.log(`A velocidade do jato agora é ${this.velocidade} Mach.`);
    }

    frear(decrementoMach) {
        super.frear(decrementoMach);
        console.log(`A velocidade do jato agora é ${this.velocidade} Mach.`);
    }
}

class barco extends veiculo {
    constructor(marca, tipo, cor, velocidade, passageiros, motor) {
        super(marca, tipo, cor, velocidade, passageiros);
        this.motor = motor;
    }

    acelerar(incrementoNoz) {
        super.acelerar(incrementoNoz);
        console.log(`A velocidade do barco agora é ${this.velocidade} nós.`);
    }

    frear(decrementoNoz) {
        super.frear(decrementoNoz);
        console.log(`A velocidade do barco agora é ${this.velocidade} nós.`);
    }
}

const carro = new veiculo('Fiat', '4x4', 'Preto', 0, 4);
const outroCarro = new veiculo('Chevrolet', 'Sedan', 'Branco', 0, 5);
carro.acelerar(10);
carro.frear(5);
outroCarro.acelerar(15);
outroCarro.frear(10);

const aviao = new jato('Boeing', 'Comercial', 0, 200, 'Gol');
aviao.acelerar(0.5);
aviao.frear(0.2);
console.log(aviao);

const barco1 = new barco('Yamaha', 'Lancha', 'Branco', 0, 8, 'Motor de popa');
barco1.acelerar(20);
barco1.frear(10);
console.log(barco1);