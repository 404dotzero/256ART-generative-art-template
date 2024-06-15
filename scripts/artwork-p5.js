

class Point2D {
	constructor(x, y, vx, vy, s, brightness, brightnessFrequency, sizeFrequency) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.initialSize = s;
		this.initialBrightness = brightness;
		this.brightnessFrequency = brightnessFrequency;
		this.sizeFrequency = sizeFrequency;
		this.time = 0;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.time += 0.1;
		this.s = this.initialSize * (0.5 * (1 + Math.sin(this.sizeFrequency * this.time)));
		this.brightness = this.initialBrightness * (0.5 * (1 + Math.sin(this.brightnessFrequency * this.time)));
	}

	setVelocity(vx, vy) {
		this.vx = vx;
		this.vy = vy;
	}

	setSize(s) {
		this.initialSize = s;
	}

	setBrightness(brightness) {
		this.initialBrightness = brightness;
	}

	setBrightnessFrequency(brightnessFrequency) {
		this.brightnessFrequency = brightnessFrequency;
	}

	setSizeFrequency(sizeFrequency) {
		this.sizeFrequency = sizeFrequency;
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
const N = 5000;
const D = 4
const spacer = 10
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
		points.push(new Point2D(x, y, vx, vy, s, brightness, brightnessFrequency, sizeFrequency));
	}

	
}



function draw() {
	background(0);
	noStroke();
	fill(200);

	for (let i = 0; i < N; i++) {
		const x = Math.round(points[i].x/spacer)*spacer;
		const y = Math.round(points[i].y/spacer)*spacer;
		if (i == N-1) fill(255,0,0);
		else {
			const dimmer = points[i].brightness*255;
			fill(dimmer,dimmer,dimmer);
		}
		s = points[i].s*D;
		quad(x-s, y-s, x-s, y+s, x+s, y+s, x+s, y-s);
		points[i].update();
		if (x>width) points[i].x = 0;
		if (x<0) points[i].x = width;
		if (y>height) points[i].y = 0;
		if (y<0) points[i].y = height;
	}

	// for (let i = 0; i < N; i++) {
	// 	let x = pos[i][0]+time*vel[i][0];
	// 	let y = pos[i][1]+time*vel[i][1];
	// 	x = Math.round(x/spacer)*spacer;
	// 	y = Math.round(y/spacer)*spacer;
	// 	console.log(x)
	// 	if (i==N-1) fill(255,0,0);
	// 	quad(x, y, x, y+d, x+d, y+d, x+d, y);
	// }


	// time +=1;
}
new p5();





























