import * as THREE from 'three';

import { OrbitControls } from 'https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from "https://unpkg.com/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";


const canvasHTML = document.getElementById("canvas-box");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, canvasHTML.offsetWidth / canvasHTML.offsetHeight, 0.1, 2000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasHTML.offsetWidth - 30,  canvasHTML.offsetHeight - 30);
renderer.setAnimationLoop( animate );
canvasHTML.appendChild(renderer.domElement);

const onWindowResize = () => { // window resize function
	camera.aspect = canvasHTML.offsetWidth / canvasHTML.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(canvasHTML.offsetWidth - 30,  canvasHTML.offsetHeight - 30);
}

//main GLTF custom objects
class GLTFObject {
	constructor(src, scale) {
		const loader  = new GLTFLoader().setPath("assets/");
		this.mesh;
		loader.load(
    		src,  // called when the resource is loaded
    		(gltf) => {
        	this.mesh = gltf.scene;
			this.mesh.scale.set(1, 1, 1)
			scene.add(this.mesh); //add GLTF to the scene
			},
    		// called when loading is in progresses
    		(xhr) => {console.log((xhr.loaded / xhr.total * 100) + '% loaded');},
    		// called when loading has errors
    		(error) => {console.log('Error: ' + error)}
		);
	}

	handle() {
		this.mixer.update(.01);
	}
}

const createskybox = () => { //Skybox function
	let bgMesh;
	const sphereGeometry = new THREE.SphereGeometry( 400, 32, 16 );
	const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x75b4bd, side: THREE.DoubleSide})
	bgMesh  = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(bgMesh);
}
createskybox();

//create light
const createLights = ()=>{
	const ambientLight = new THREE.HemisphereLight( 0xddeeff, // sky color
	0x202020, // ground color
	0.8, // intensity
	);
	const mainLight = new THREE.DirectionalLight( 0xffffff, 1 );
	mainLight.position.set( 10, 10, 10 ); 
	scene.add(ambientLight, mainLight);
	}
	//call light function createLights();

createLights();


const obj = new GLTFObject('slot_wars_car.glb', 1); // Create and add mesh to the scene.

camera.position.x = -20;
camera.position.y = 2;

let controls;
const createcontrols = () => { // Orbit controls, control the camera with the mouse.
	controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 10;
	controls.maxDistance = 50;
	controls.autoRotate = true;
	controls.enablePan = false;
}
createcontrols();

let clock = new THREE.Clock();

function animate() {
	controls.update(clock.deltaTime);
	onWindowResize();
	renderer.render( scene, camera );
};
