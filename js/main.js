import * as THREE from 'three'
import loadLight from './loaders/loadLight.js'
import loadSphere from './loaders/loadSphere.js'
import TerrainLoader from './loaders/loadTerrain.js'
import loadStaticModel from './loaders/loadStaticModel.js'
import loadAnimatedModel from './loaders/loadAnimatedModel.js'

import { buildPath } from "./builders/buildPath.js";
import { setPathFor } from "./builders/buildPath.js";
import createPanel from "./gui/gui.js";
import { GUI } from "../node_modules/three/examples/jsm/libs/lil-gui.module.min.js";

//import * as THREE from './lib/three.module.js';

let container;
let camera, scene, renderer;

let clock = new THREE.Clock();
let chase = -1;
let angle = 45;

//var imageData;
const N = 225;

let morphs = [];

let fraction = 0;

init();
animate();

function init() {
    container = document.getElementById('container');
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        angle,
        window.innerWidth / window.innerHeight,
        1,
        4000);
    camera.position.set(N/2, 100, 300);
    camera.lookAt(new THREE.Vector3(N/2, 0.0, N/2));
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    // Light
    const light = loadLight()
    scene.add( light )

    // Sky
    const sphere = loadSphere(600, "images/sky.jpg")
    scene.add( sphere )

    // Terrain
    let terrainLoader = new TerrainLoader()
    const terrain = terrainLoader.loadTerrain()
    scene.add( terrain )

    // Trees
    //for (let i = 0; i < 10; i++) {
    //    let imageData = terrainLoader.getImageData()
    //    console.log( imageData )
    //    let tree = loadStaticModel("./models/", "Tree.obj", "Tree.mtl", imageData)
    //    scene.add( tree )
    //}

    //var animations = gltf.animations
    //mixer.clipAnimation( animations[0], mesh ).play()
    //let mixer = new THREE.AnimationMixer( scene )
    // Bird
    const animatedModel = loadAnimatedModel("../models/Parrot.glb")
    morphs.push( animatedModel ) // add to array
    scene.add( animatedModel )
    //setPathFor(morphs[1], 50)
    createPanelTest()
}

let relativeCameraOffset = new THREE.Vector3(N / 2, N / 2, 15);
let m1 = new THREE.Matrix4();
let m2 = new THREE.Matrix4();

function animate() {
    setPathFor( scene, camera, morphs[0], 80 );
    // ???
    // const newPosition = curve.getPoint(fraction);
    // const tangent = curve.getTangent(fraction);
    //morph.position.copy(newPosition);
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function createPanelTest() {
    const panel = new GUI( { width: 310} )
    const folder = panel.addFolder( 'camera edit' )
    let panelSettings = {
        'modify camera angle': 90
    };
    folder.add ( panelSettings, 'modify camera angle', 30, 90, 10 ).listen().onChange( function ( modAngle ) {
        angle = modAngle
    } );

    folder.open()
}

function modifyCameraAngle( modAngle ) {
    angle = modAngle
}

// CONTROLS (replaced with gui)
function keys(){
    if (keyboard.pressed("0")){
        chase = -1;
    }
    if (keyboard.pressed("1")){
        chase = 0;
    }
    if (keyboard.pressed("2")){
        chase = 1;
    }
    if (keyboard.pressed("w")){
        object.extractRotation
    }
    if (keyboard.pressed("a")){
    }
    if (keyboard.pressed("s")){
    }
    if (keyboard.pressed("d")){
    }

    if(chase > -1){
        let mm = new THREE.Matrix4();
        mm.copyPosition(planets[chase].sphere.matrix);
        let position = new THREE.Vector3(0,0.0,0);
        position.setFromMatrixPosition(mm);

        let x = position.x + planets[chase].r * 4 * Math.cos(angle - planets[chase].a1);
        let z = position.z + planets[chase].r * 4 * Math.sin(angle - planets[chase].a1);
        camera.position.set(x, 0, z);
        camera.lookAt(position)
    }
    else{
        camera.position.set(0, 400, 400);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0))
    }
}
