







let R;  // will hold the Random class instance
// let x=200, y=0.5;
let time =0;
let N = 500;
let pos = [];
let vel = [];
// Recommended class for randomness; remove unneeded functionality
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
    	pos[i] = [R.random_dec()*width, R.random_dec()*height];
    	vel[i] = [R.random_dec()-0.5, R.random_dec()-0.5];
    	}
}

// function draw() {
//     console.log('DRAW')
	
//     let amountOfLines = parseInt(inputData["Amount Of Lines"]);
//     let color = inputData["Paint Color"];

//     background(255);

//     // Color from trait
//     stroke(color);

//     // Use dimension-agnostic variables (e.g., lineWidth based on canvas width)
//     strokeWeight(width * 0.05);

//     for (let i = 0; i < amountOfLines; i++) {
//         // Examples using the Random class
//         let startX = width * R.random_dec();
//         let startY = height * R.random_dec();
//         let endX = width * R.random_dec();
//         let endY = height * R.random_dec();

//         // Draw line
//         line(startX, startY, endX, endY);
//     }

//     // Draw border
//     noFill();
//     rect(0, 0, width, height);
//     noLoop();
//     window.rendered = c.canvas;
// }


function draw() {
	background(0);
	noStroke();
	fill(200);
	let d = 5;
	let spacer = 10;
	// quad(x, y, x, y+d, x+d, y+d, x+d, y);
	// for (let x = 0; x < width; x += spacer) {
	// 	for (let y = 0; y < height; y += spacer) {
	// 		quad(x+time, y, x+time, y+d, x+d+time, y+d, x+d+time, y);
	// 	}
	// }

	for (let i = 0; i < N; i++) {
		let x = pos[i][0]+time*vel[i][0];
		let y = pos[i][1]+time*vel[i][1];
		x = Math.round(x/spacer)*spacer;
		y = Math.round(y/spacer)*spacer;
		console.log(x)
		if (i==N-1) fill(255,0,0);
		quad(x, y, x, y+d, x+d, y+d, x+d, y);
	}
	time +=1;
	// x = x + random(-1, 1);
	// y = y - 1;
	// if (y < 0) {
	// 	y = height;
  	// }
}
new p5();