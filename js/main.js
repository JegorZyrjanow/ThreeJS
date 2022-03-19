import loadSphere from './loaders/loadSphere.js'
import loadTerrain from './loaders/loadTerrain.js'
import loadStaticModel from './loaders/loadStaticModel.js'
import loadAnimatedModel from './loaders/loadAnimatedModel.js'
import loadLight from './loaders/loadLight.js'
import * as THREE from './lib/three.module.js';
import { GLTFLoader } from "./lib/GLTFLoader.js";

var container;
var camera, scene, renderer;
var keyboard = new THREEx.KeyboardState();

var tLoader = new THREE.TextureLoader();
var GltfLoader = new GLTFLoader();    

var clock = new THREE.Clock();
var chase = -1;
var angle = 45;

var imageData;
const N = 225;
var geometry = new THREE.BufferGeometry();

var morphs = [];
var mixer = new THREE.AnimationMixer(scene);

var curve;
let fraction = 0;

var mesh;
var T = 11;
var t = 0;
var path = null;

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
    scene.add( light );

    // Terrain
    loadTerrain() //???

    // Sky
    const sphere = loadSphere(600, "images/sky.jpg")
    scene.add( sphere )

    // Trees
    for (let i = 0; i < 10; i++) {
      let tree = loadStaticModel("./models/", "Tree.obj", "Tree.mtl")
      scene.add( tree )
    }

    // Bird
    const animatedModel = loadAnimatedModel("../models/Parrot.glb", scene)
    //setPathFor(morphs[0])
    morphs.push( animatedModel )
    scene.add( animatedModel )
    //loadAnimatedModel("../models/Stork.glb")
    //setPathFor(morphs[1], 50)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var relativeCameraOffset = new THREE.Vector3(N / 2, N / 2, 15);
var m1 = new THREE.Matrix4();
var m2 = new THREE.Matrix4();

function animate() {
    var morph;
    
    setPathFor(morph, 80);

    // ???
    // const newPosition = curve.getPoint(fraction);
    // const tangent = curve.getTangent(fraction);
    //morph.position.copy(newPosition);
    
    requestAnimationFrame(animate);
    render();
}

function setPathFor(morph, pathShift = 0){
    var delta = clock.getDelta();
    mixer.update( delta );
    t += delta;
    var position = new THREE.Vector3();       
    var morph;
    //const oldObjectPosition = new THREE.Vector3()
    for (let i = 0; i < morphs.length; i++) {
        morph = morphs[i];
        position = new THREE.Vector3();
        if (t >= T)
	    t = 0;
        morph.position.copy((buildPath(pathShift).getPointAt(t/T))); // HERE'D BE FLW
        if (t + 0.1 > T)
	    t = 0;
        var nextPoint = new THREE.Vector3();
        nextPoint.copy(path.getPointAt((t + 0.1) / T));
        morph.lookAt(nextPoint);

    var relativeCameraOffset = new THREE.Vector3(0,3,-15)

    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();

	// m1.extractRotation(morphs[0].matrixWorld);
	// m2.extractPosition(morphs[0].matrixWorld);
	m1.extractRotation(morph.matrixWorld);
	m2.extractPosition(morph.matrixWorld);
    m1.multiplyMatrices(m2, m1);

	var cameraOffset = relativeCameraOffset.applyMatrix4(m1);
	camera.position.copy(cameraOffset);

	// DONE
	camera.lookAt(morph.position);
    }
}

function buildPath(shift = 0){
    // Path points
    var cY = 40;
    curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(120 + shift, cY, 120 + shift),
        new THREE.Vector3(120 + shift, cY, 25 + shift),
        new THREE.Vector3(50 + shift, cY, 25 + shift),
        new THREE.Vector3(50 + shift, cY, 120 + shift)
    );
    
    var vertices = [] = curve.getPoints( 100 );
    
    // New path with points
    path = new THREE.CatmullRomCurve3( vertices ); 
    path.closed = true; // closing the path

    // Visualize
    var geometry = new THREE.BufferGeometry().setFromPoints( vertices );
    var material = new THREE.LineBasicMaterial( { color : 0x00daa1 } );
    var curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject);

    return path;
}

function render() {
    renderer.render(scene, camera);
}

//function loadAnimatedModel(path) {
//    GltfLoader.load(path, (gltf) => {
//        mesh = gltf.scene.children[0];
//    
//	// Animation [?]
//    var animations = gltf.animations;
//    //mixer.clipAction(clip, mesh).setDuration(1).startAt(0).play();
//	mixer.clipAction( animations[0], mesh ).play()
//	
//	// Scaling
//    mesh.scale.set(0.05, 0.05, 0.05);
//    mesh.castShadow = true;
//
//	// Put a model
//    morphs.push(mesh);
//    scene.add(mesh);
//    });
//}

function CreateTerrain(){
    var vertices = [];
    var uvs = [];
    var faces = [];

    for(let z = 0; z < N; z++){
        for(let x = 0; x < N; x++){
            var h = getPixel(imageData, z, x);
            vertices.push(x, h/10, z);
            uvs.push(z / (N - 1), x / (N - 1));
        }
    }

    let num = N; // создание переменной для перечисления десятков (y)
    for(let m = 0; m < N - 1; m++){    
        for(let n = 0; n < N - 1; n++){
            faces.push((num + n - N), (num + n - N) + 1, num + (n + 1)); // треугольник (верхний угол)
            faces.push((num + n - N), num + (n + 1), num + (n)); // треугольник (нижний угол)
        }
        num = num + N; // добавление десятка после отрисовки одной строки
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(faces);
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    geometry.computeVertexNormals();

    var texture = new THREE.TextureLoader().load('images/terrain.jpg')

    var planeMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        wireframe: false,
        side: THREE.DoubleSide
    })
    
    const plane = new THREE.Mesh( geometry, planeMaterial );
    scene.add( plane );
}

function getPixel(imageData, x, y){
    var position = (x + imageData.width * y) * 4
    var data = imageData.data;

    return data[position];
}

var chase = -1;

function keys(){                    // Shift scaling by pressing the btn
    if(keyboard.pressed("0")){
        chase = -1;
    }
    if(keyboard.pressed("1")){
        chase = 0;
    }
    if(keyboard.pressed("2")){
        chase = 1;
    }

    if(keyboard.pressed("w")){
        while (true){
            //object.setposition += ...
        }
    }

    if(chase > -1){
        var mm = new THREE.Matrix4();
        mm.copyPosition(planets[chase].sphere.matrix);
        var position = new THREE.Vector3(0,0.0,0);
        position.setFromMatrixPosition(mm);

        var x = position.x + planets[chase].r * 4 * Math.cos(angle - planets[chase].a1);
        var z = position.z + planets[chase].r * 4 * Math.sin(angle - planets[chase].a1);
        camera.position.set(x, 0, z);
        camera.lookAt(position)
    }
    else{
        camera.position.set(0, 400, 400);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0))
    }
}
