import loadLight from './loaders/loadLight.js'
import loadSphere from './loaders/loadSphere.js'
import TerrainLoader from './loaders/loadTerrain.js'
import loadStaticModel from './loaders/loadStaticModel.js'
import loadAnimatedModel from './loaders/loadAnimatedModel.js'

import * as THREE from './lib/three.module.js';

let keyboard = new THREEx.KeyboardState();

let container;
let camera, scene, renderer;

let clock = new THREE.Clock();
let chase = -1;
let angle = 45;

//var imageData;
const N = 225;

let morphs = [];
let mixer = new THREE.AnimationMixer(scene);

let curve;
let fraction = 0;

let T = 11;
let t = 0;
let path = null;

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
    for (let i = 0; i < 10; i++) {
        let imageData = terrainLoader.getImageData()
        console.log( imageData )
        let tree = loadStaticModel("./models/", "Tree.obj", "Tree.mtl", imageData)
        scene.add( tree )
    }

    // Bird
    //var animations = gltf.animations
    //mixer.clipAnimation( animations[0], mesh ).play()
    //let mixer = new THREE.AnimationMixer( scene )
    const animatedModel = loadAnimatedModel("../models/Parrot.glb")
    morphs.push( animatedModel ) // add to array
    scene.add( animatedModel )
    //setPathFor(morphs[1], 50)
}

let relativeCameraOffset = new THREE.Vector3(N / 2, N / 2, 15);
let m1 = new THREE.Matrix4();
let m2 = new THREE.Matrix4();

function animate() {
    setPathFor( morphs[0], 80 );
    // ???
    // const newPosition = curve.getPoint(fraction);
    // const tangent = curve.getTangent(fraction);
    //morph.position.copy(newPosition);
    requestAnimationFrame( animate );
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function setPathFor( morph, pathShift = 0 ){
    let delta = clock.getDelta();
    mixer.update( delta );
    t += delta;
    let position = new THREE.Vector3();       
    //const oldObjectPosition = new THREE.Vector3()
    //for (let i = 0; i < morphs.length; i++) {
        //morph = morphs[i];
        position = new THREE.Vector3();
        if ( t >= T )
	    t = 0;
        morph.position.copy(( buildPath(pathShift).getPointAt(t / T) )); // HERE'D BE FLW
        if ( t + 0.1 > T )
	    t = 0;
        let nextPoint = new THREE.Vector3();
        nextPoint.copy(path.getPointAt( (t + 0.1) / T) );
        morph.lookAt( nextPoint );

    let relativeCameraOffset = new THREE.Vector3( 0, 3, -15 )

    let m1 = new THREE.Matrix4();
    let m2 = new THREE.Matrix4();

	// m1.extractRotation(morphs[0].matrixWorld);
	// m2.extractPosition(morphs[0].matrixWorld);
	m1.extractRotation( morph.matrixWorld );
	m2.copyPosition( morph.matrixWorld );
    m1.multiplyMatrices( m2, m1 );

	let cameraOffset = relativeCameraOffset.applyMatrix4(m1);
	camera.position.copy( cameraOffset );

	// DONE
	camera.lookAt( morph.position );
}

function buildPath( shift = 0 ){
    // Path points
    let cY = 40
    curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3( 120 + shift, cY, 120 + shift ),
        new THREE.Vector3( 120 + shift, cY, 25 + shift ),
        new THREE.Vector3( 50 + shift, cY, 25 + shift ),
        new THREE.Vector3( 50 + shift, cY, 120 + shift )
    );
    
    let vertices = [] = curve.getPoints( 100 )
    
    // New path with points
    path = new THREE.CatmullRomCurve3( vertices )
    path.closed = true // closing the path

    // Visualize
    let geometry = new THREE.BufferGeometry().setFromPoints( vertices )
    let material = new THREE.LineBasicMaterial( { color : 0x00daa1 } )
    let curveObject = new THREE.Line( geometry, material )
    scene.add( curveObject )

    return path
}

function render() {
    renderer.render( scene, camera )
}

// CONTROLS
function keys(){                    // Shift scaling by pressing the btn
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
