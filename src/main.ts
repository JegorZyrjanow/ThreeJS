import * as THREE from 'three'
import loadLight from './loaders/loadLight'
import loadSky from './loaders/loadSky'
import TerrainLoader from './loaders/loadTerrain'
import loadStaticModel from './loaders/loadStaticModel'
import loadAnimatedModel from './loaders/loadAnimatedModel'
import PathBuilder from "./builders/buildPath";
import createPanel from "./gui/gui.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import parrotModel from '../models/Parrot.glb'
import skyImage from '../images/sky.jpg'
import terrainTexture from '../images/terrain.jpg'
import terrainNormalMap from '../images/normalMap.jpg'

//import * as THREE from './lib/three.module.js';

let container: any;
let camera:any, scene: any, renderer: any

let clock: any = new THREE.Clock();
let chase: number = -1;
let angle: number = 45;

//var imageData;
const N: number = 225;

let morphs: any = [];

let fraction: number = 0;

init();
animate();

function init() {
    let el = document.createElement( 'div' )
    el.setAttribute( "id", "container" )
    document.body.appendChild(el)
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        angle,
        window.innerWidth / window.innerHeight,
        1,
        4000 );
    camera.position.set( N/2, 100, 300 );
    camera.lookAt( new THREE.Vector3( N/2, 0.0, N/2 ) );
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1);
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    // Light
    const light = loadLight()
    scene.add( light )

    // Sky
    const sky = loadSky( 600, skyImage )
    scene.add( sky )

    // Terrain
    let terrainLoader = new TerrainLoader()
    const terrain = terrainLoader.loadTerrain(terrainTexture, terrainNormalMap)
    scene.add( terrain )

    // Trees
    for (let i = 0; i < 10; i++) {
       let imageData = terrainLoader.getImageData()
       console.log( imageData )
       let tree = loadStaticModel("./models/", "Tree.obj", "Tree.mtl", imageData)
       scene.add( tree )
    }

    //var animations = gltf.animations
    //mixer.clipAnimation( animations[0], mesh ).play()
    //let mixer = new THREE.AnimationMixer( scene )
    // Bird
    const animatedModel = loadAnimatedModel( parrotModel )
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
    folder.add ( panelSettings, 'modify camera angle', 30, 90, 10 ).listen().onChange( function ( modAngle: any ) {
        angle = modAngle
    } );

    folder.open()
}

function modifyCameraAngle( modAngle: any ) {
    angle = modAngle
}

// CONTROLS (replaced with gui)
function keys(){
    //if (keyboard.pressed("0")){
    //    chase = -1;
    //}
    //if (keyboard.pressed("1")){
    //    chase = 0;
    //}
    //if (keyboard.pressed("2")){
    //    chase = 1;
    //}
    //if (keyboard.pressed("w")){
    //    object.extractRotation
    //}
    //if (keyboard.pressed("a")){
    //}
    //if (keyboard.pressed("s")){
    //}
    //if (keyboard.pressed("d")){
    //}

    if(chase > -1){
        let mm = new THREE.Matrix4();
        mm.copyPosition(morphs[chase].sphere.matrix);
        let position = new THREE.Vector3(0,0.0,0);
        position.setFromMatrixPosition(mm);

        let x = position.x + morphs[chase].r * 4 * Math.cos(angle - morphs[chase].a1);
        let z = position.z + morphs[chase].r * 4 * Math.sin(angle - morphs[chase].a1);
        camera.position.set(x, 0, z);
        camera.lookAt(position)
    }
    else{
        camera.position.set(0, 400, 400);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0))
    }
}
