import './style.css'

import * as THREE from 'three';

import { setupScroll } from './scroll'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg')!,
	alpha: true
});


let r_color_range: number[] = [0, 0]
let g_color_range: number[] = [0, 0]
let b_color_range: number[] = [0, 0]

function init() {
	scene.background = new THREE.Color(0x071d2d);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.setZ(1000);

	const file_name = window.location.pathname.split('/').pop();
	console.log(file_name);
	if (file_name === "theo.html") {
		// TODO: Couleurs de fumée pour Théo
	} else if (file_name == "lucas.html") {
		r_color_range = [1, 0]
		g_color_range = [0.5450980392156862, 1]
		b_color_range = [0, 0.803921568627451]
	} else {
		r_color_range = [0, 1]
		g_color_range = [0.24313725490196078, 0]
		b_color_range = [0.803921568627451, 0]
	}

	smoke_material.color = new THREE.Color(r_color_range[0], g_color_range[0], b_color_range[0])
	load_background();
	renderer.render(scene, camera);
}


// FRAME RATE
let then = Date.now();
const fps = 1000 / 60;


let smoke_elements: THREE.Mesh[] = [];
let smoke_rotation: number[] = [];

const smoke_texture = (new THREE.TextureLoader()).load("smoke.png");
const smoke_material = new THREE.MeshBasicMaterial({
	map: smoke_texture,
	transparent: true,
	opacity: 1
});
const smoke_geometry = new THREE.PlaneGeometry(500, 500);
function load_background() {
	for (let i=0; i<100; i++) {
		const elt = new THREE.Mesh(smoke_geometry, smoke_material);

		elt.position.set(
			Math.random() * ((window.innerWidth / 2.75) * 2) - (window.innerWidth / 2.75),
			Math.random() * ((window.innerHeight / 2.75) * 2) - (window.innerHeight / 2.75),
			Math.random() * 400
		);
		elt.rotation.z = Math.random() * 360;

		smoke_rotation.push((Math.random() >= 0.5) ? -1 : 1);
		
		scene.add(elt);
		smoke_elements.push(elt);
	}
}

const scroll_info = document.getElementById("scroll_image")!;
let scroll_time = 0;

function animate() {
	requestAnimationFrame(animate);

	const now = Date.now();
	const elapsed = now - then;
	if (elapsed > fps) {
		for (let i=0; i<smoke_elements.length; i++)
			smoke_elements[i].rotation.z += fps / elapsed * 0.01 * smoke_rotation[i];

		renderer.setClearColor(0x000000, 1);

		renderer.render(scene, camera);
		then = now - (elapsed % fps);

		if (scroll_time > 0) {
			scroll_time -= elapsed;
			scroll_info.style.opacity = "0";
		}
		else
			scroll_info.style.opacity = "0.25";
	}
}

// Initialize and launch animations
init();
animate();

// Set scrolling
function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	const previous_pos_z = camera.position.z;
	camera.position.z = t * -0.05;

	const color_ratio = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));

	let color_r: number = 0;
	if (r_color_range[0] > r_color_range[1])
		color_r = (1 - color_ratio) * r_color_range[0];
	else
		color_r = color_ratio * (r_color_range[1] - r_color_range[0]) + r_color_range[0];
	
	let color_g: number = 0;
	if (g_color_range[0] > g_color_range[1])
		color_g = (1 - color_ratio) * g_color_range[0];
	else
		color_g = color_ratio * (g_color_range[1] - g_color_range[0]) + g_color_range[0];

	let color_b: number = 0;
	if (b_color_range[0] > b_color_range[1])
		color_b =  (1 - color_ratio) * b_color_range[0];
	else
		color_b = color_ratio * (b_color_range[1] - b_color_range[0]) + b_color_range[0];

	for (let i=0; i<smoke_elements.length; i++) {
		smoke_elements[i].position.z -= (previous_pos_z - camera.position.z);		
		(smoke_elements[i].material as THREE.MeshBasicMaterial).color.setRGB(color_r, color_g, color_b);
	}

	scroll_time = 2000;
}
document.body.onscroll = moveCamera;
setupScroll();

// Set resize call handling
document.body.onresize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
}
