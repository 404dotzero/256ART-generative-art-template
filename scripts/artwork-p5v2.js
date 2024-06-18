

class Point2D {
	grad(hash, x) {
		const h = hash & 15;
		const grad = 1 + (h & 7);
		return (h & 8 ? -grad : grad) * x;
	}
	simplex1D(x, p) {
		const G = 0.5 * (Math.sqrt(3) - 1);
		const F = (Math.sqrt(3) - 1) / 2;
		const i0 = Math.floor(x / p);
		const i1 = i0 + 1;
		const x0 = x - i0 * p;
		const x1 = x0 - p;
		const t0 = 1.0 - x0 * x0;
		const t1 = 1.0 - x1 * x1;
		const n0 = t0 * t0 * t0 * t0 * this.grad(i0 % 12, x0);
		const n1 = t1 * t1 * t1 * t1 * this.grad(i1 % 12, x1);
		return 0.395 * (n0 + n1)*0.001;
	}

	constructor(x, y, vx, vy, s, brightness, brightnessFrequency, sizeFrequency, id, ay) {
		this.seed = id*123472;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.initialSize = s;
		this.initialBrightness = brightness;
		this.brightnessFrequency = brightnessFrequency;
		this.sizeFrequency = sizeFrequency;
		this.time = 0;
		this.ax = 0;
		this.ay = ay*0.1;
	}

	update() {
		this.vy += this.ay;
		this.x += this.vx*(1+this.simplex1D(this.time/10+6779+this.seed*0.01, 3));
		// console.log(this.simplex1D(this.time/10+this.seed, 5));
		this.y += this.vy*this.simplex1D(this.time/10+this.seed*0.01, 3);
		this.time += 0.2;
		this.s = this.initialSize * (0.5 * (1 + Math.sin(this.sizeFrequency * this.time)));
		this.brightness = this.initialBrightness * (0.5 * (1 + Math.sin(this.brightnessFrequency * this.time)));
	}

	getInfo() {
		return `Point at (${this.x}, ${this.y}) with velocity (${this.vx}, ${this.vy}), size ${this.s.toFixed(2)}, brightness ${this.brightness.toFixed(2)}, brightness frequency ${this.brightnessFrequency}, size frequency ${this.sizeFrequency}`;
	}
}

class Random {
	constructor() {
		let offset = 0;
		for (let i = 2; i < 66; i += 8) offset += parseInt(inputData.hash.substr(i, 8), 16);
		offset %= 7;

		const p = pos => parseInt(inputData.hash.substr((pos + offset), 8), 16);
		let a = p(2) ^ p(34), b = p(10) ^ p(42), c = p(18) ^ p(50), d = p(26) ^ p(58) ^ p(2 + (8 - offset));

		this.r = () => {
			a |= 0; b |= 0; c |= 0; d |= 0;
			let t = (((a + b) | 0) + d) | 0;
			d = (d + 1) | 0; a = b ^ (b >>> 9);
			b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11);
			c = (c + t) | 0;
			return (t >>> 0) / 4294967296;
		};
		// 256 warmup cycles
		for (let i = 0; i < 256; i++) this.r();
	}
	// Random decimal [0, 1)
	random_dec = () => this.r();
	// Random number [a, b)
	random_num = (a, b) => a + (b - a) * this.random_dec();
	// Random integer [a, b] (a < b required)
	random_int = (a, b) => Math.floor(this.random_num(a, b + 1));
	// Random boolean (p = true probability)
	random_bool = (p) => this.random_dec() < p;
	// Choose random item from array
	random_choice = (list) => list[this.random_int(0, list.length - 1)];
}

let c;
let R;  //RANDOM
const N = 1024;
const D = 4
const spacer = 6
const points = [];


function setup() {
	let aspectRatio = 0.75;


	pixelDensity(displayDensity());
	let ih = windowHeight;
	let iw = windowWidth;
	if (iw / ih < aspectRatio) {
		c = createCanvas(iw, iw / aspectRatio);
	} else {
		c = createCanvas(ih * aspectRatio, ih);
	}
	R = new Random();
	background(0);

	
	for (let i = 0; i < N; i++) {
		const x = R.random_dec()*width;
		const y = R.random_dec()*height;
		const vx = R.random_dec()-0.5;
		const vy = R.random_dec()-0.5;
		const s = R.random_dec();
		const brightness = R.random_dec()*2;
		const brightnessFrequency = R.random_dec()*2;
		const sizeFrequency = R.random_dec();
		points.push(new Point2D(x, y, vx, vy, s, brightness, brightnessFrequency, sizeFrequency , i, R.random_dec()));
	}
}



function engine(){

}


function draw() {
	engine();
	background(0);
	noStroke();
	fill(200);

	for (let i = 0; i < N; i++) {
		const x = Math.round(points[i].x/spacer)*spacer;
		const y = Math.round(points[i].y/spacer)*spacer;
		const owned = 1;
		if (i >= N-owned){
			s = D;
			fill(255,0,0);
			}
		
		else {
			const dimmer = points[i].brightness*255;
			fill(dimmer,dimmer,dimmer);
			s = points[i].s*D;
		}
		
		quad(x-s, y-s, x-s, y+s, x+s, y+s, x+s, y-s);
		points[i].update();
		if (points[i].x>=width) points[i].x = 0;
		if (points[i].x<0) points[i].x = width;
		if (points[i].y>=height) points[i].y = 0;
		if (points[i].y<0) points[i].y = height;
	}

}
new p5();





























