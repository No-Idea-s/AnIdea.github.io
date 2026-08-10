/*--------------------
Vars
--------------------*/
const deg = (a) => (Math.PI / 180) * a;
const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));

const opt = {
    particles: window.innerWidth > 700 ? 250 : 125,
    noiseScale: 0.0045,
    angle: deg(-90),
    h1: rand(0, 360),
    h2: rand(0, 360),
    s1: rand(45, 90),
    s2: rand(45, 90),
    l1: rand(45, 75),
    l2: rand(40, 70),
    strokeWeight: 1.8,
    tail: 88,
};

changeTitleColor();

const Particles = [];
let time = 0;

document.body.addEventListener('click', () => {
    if (inGame) return;

    opt.h1 = rand(0, 360);
    opt.h2 = (opt.h1 + rand(70, 180)) % 360;

    opt.s1 = rand(50, 90);
    opt.s2 = rand(45, 85);
    opt.l1 = rand(50, 75);
    opt.l2 = rand(42, 68);

    opt.angle += deg(rand(12, 35)) * (Math.random() > 0.5 ? 1 : -1);

    setTimeout(() => {
        changeTitleColor();
    }, 120);

    for (let p of Particles) {
        p.randomize();
    }
});

/*--------------------
Particle
--------------------*/
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lx = x;
        this.ly = y;

        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;

        this.hueSem = Math.random();
        this.hue = 0;
        this.sat = 0;
        this.light = 0;
        this.maxSpeed = 0;

        this.randomize();
    }

    randomize() {
        this.hueSem = Math.random();

        this.hue =
            this.hueSem > 0.5
                ? opt.h1 + rand(-12, 13)
                : opt.h2 + rand(-12, 13);

        this.sat = this.hueSem > 0.5 ? opt.s1 : opt.s2;
        this.light = this.hueSem > 0.5 ? opt.l1 : opt.l2;
        this.maxSpeed = this.hueSem > 0.5 ? 3.2 : 2.4;
    }

    update() {
        this.follow();

        this.vx += this.ax;
        this.vy += this.ay;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const angle = Math.atan2(this.vy, this.vx);
        const limitedSpeed = Math.min(this.maxSpeed, speed);

        this.vx = Math.cos(angle) * limitedSpeed;
        this.vy = Math.sin(angle) * limitedSpeed;

        this.x += this.vx;
        this.y += this.vy;

        this.ax = 0;
        this.ay = 0;

        this.edges();
    }

    follow() {
        const angle =
            noise(
                this.x * opt.noiseScale,
                this.y * opt.noiseScale,
                time * 0.003
            ) *
                Math.PI *
                1.5 +
            opt.angle;

        this.ax += Math.cos(angle) * 0.85;
        this.ay += Math.sin(angle) * 0.85;
    }

    updatePrev() {
        this.lx = this.x;
        this.ly = this.y;
    }

    edges() {
        if (this.x < 0) {
            this.x = width;
            this.updatePrev();
        }

        if (this.x > width) {
            this.x = 0;
            this.updatePrev();
        }

        if (this.y < 0) {
            this.y = height;
            this.updatePrev();
        }

        if (this.y > height) {
            this.y = 0;
            this.updatePrev();
        }
    }

    render() {
        const alpha = this.hueSem > 0.5 ? 0.42 : 0.3;

        stroke(
            `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${alpha})`
        );

        line(this.x, this.y, this.lx, this.ly);
        this.updatePrev();
    }
}

/*--------------------
Setup
--------------------*/
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('particles');

    for (let i = 0; i < opt.particles; i++) {
        Particles.push(
            new Particle(
                Math.random() * width,
                Math.random() * height
            )
        );
    }

    strokeWeight(opt.strokeWeight);
}

/*--------------------
Draw
--------------------*/
let inGame = false;

function draw() {
    if (!inGame && document.visibilityState === 'visible') {
        time++;

        background(0, 100 - opt.tail);

        for (let p of Particles) {
            p.update();
            p.render();
        }
    } else {
        background(0);
    }
}

/*--------------------
Resize
--------------------*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/*--------------------
Title Color
--------------------*/
function changeTitleColor() {
    document.getElementById('title').style.backgroundImage = `
        linear-gradient(
            115deg,
            hsl(${opt.h1}, ${opt.s1}%, ${opt.l1}%),
            hsl(${opt.h2}, ${opt.s2}%, ${opt.l2}%)
        )
    `;
}
