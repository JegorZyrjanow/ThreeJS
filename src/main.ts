import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// Loaders
import loadLight from './loaders/loadLight'
import loadSky from './loaders/loadSky'
import TerrainLoader from './loaders/TerrainLoader'
import { StaticModelLoader, AnimatedModelLoader } from './loaders/ModelLoader'
import loadAnimatedModel from './loaders/loadAnimatedModel'
import PathBuilder from './builders/buildPath'
// Resources
import parrotModel from '../models/Parrot.glb'
import storkModel from '../models/Stork.glb'
import skyImage from '../images/sky.jpg'
import terrainTexture from '../images/terrain.jpg'
import terrainNormalMap from '../images/normalMap.jpg'
import treeObj from '../models/Tree.obj'
import treeMtl from '../models/Tree.mtl'

// VARIABLES
let container: any
let camera: any, scene: any, renderer: any
let chase: number = -1
let angle: number = 45
//var imageData;
const N: number = 225
let fraction: number = 0
let clock: any = new THREE.Clock()
var delta = clock.getDelta()

let relativeCameraOffset = new THREE.Vector3(N / 2, N / 2, 15)
let m1 = new THREE.Matrix4()
let m2 = new THREE.Matrix4()
// VARIABLES-end

// GUI
const gui = new dat.GUI()
const world = {
  terrain: { x: 0, z: 0 }
}
gui.add(world.terrain, 'x', -10, 10).onChange(() => {
  terrain.position.setX(-112 - world.terrain.x)
})
gui.add(world.terrain, 'z', -10, 10).onChange(() => {
  terrain.position.setZ(-112 - world.terrain.z)
})
// GUI-end

// OBJECTS
// Create Terrain
let terrain: THREE.Object3D
function loadTerrain(imageData: any) {
  // let terrainLoader = new TerrainLoader(terrainTexture, terrainNormalMap, 225)
  let terrainLoader = new TerrainLoader(
    terrainTexture,
    terrainNormalMap,
    225,
    imageData
  )
  terrainLoader.createTerrain(() => {
    terrain = terrainLoader.model
    scene.add(terrain)
  })
}
// Static Models (Trees)
function loadStaticModel(count: number, imageData: any) {
  const treeLoader = new StaticModelLoader(
    treeObj,
    treeMtl,
    terrainNormalMap,
    imageData
  )
  for (let i = 0; i < count; i++) {
    treeLoader.createModel(() => {
      const tree = treeLoader.model
      scene.add(tree)
    })
  }
}
// Animated Models
let morphs: any = []
let mixer: any // = new THREE.AnimationMixer(scene)
let clips: any
function loadAnimatedModel(imageData: any, callback: any) {
  // var animations = gltf.animations
  // mixer.clipAnimation( animations[0], mesh ).play()
  // Bird
  const animatedModelLoader = new AnimatedModelLoader(storkModel, imageData)
  animatedModelLoader.createModel(() => {
    const animatedModel = animatedModelLoader.model
    morphs.push(animatedModel) // add to array for animation (?)
    scene.add(animatedModel)
    // Get the list of AnimationClip instances
    mixer = new THREE.AnimationMixer(animatedModel)
    clips = animatedModel.animations
    callback()
  })
  // setPathFor(morphs[1], 50)
}
// OBJECTS-end

init()

function init() {
  // Container
  let el = document.createElement('div')
  el.setAttribute('id', 'container')
  document.body.appendChild(el)
  container = document.getElementById('container')
  // Scene
  scene = new THREE.Scene()
  // Camera
  camera = new THREE.PerspectiveCamera(
    angle,
    window.innerWidth / window.innerHeight,
    1,
    4000
  )
  camera.position.set(N / 2, 100, 300)
  camera.lookAt(new THREE.Vector3(N / 2, 0.0, N / 2))
  renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 1)
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize, false)
  new OrbitControls(camera, renderer.domElement)
  // Add Light
  const light = loadLight()
  scene.add(light)
  // Add Sky
  const sky = loadSky(600, skyImage)
  scene.add(sky)
  // Add Models
  let canvas: any = document.createElement('canvas')
  let context: any = canvas.getContext('2d')

  const image = new Image()
  image.src = terrainNormalMap

  image.onload = () => {
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0)
    let imageData = context.getImageData(0, 0, image.width, image.height)
    // Terrain
    loadTerrain(imageData)
    // Static Models
    loadStaticModel(10, imageData)
    // Animated Models
    loadAnimatedModel(imageData, () => {
      animate()
    })
  }
}

function animate() {
  const pathBuilder = new PathBuilder()
  pathBuilder.setPathFor( scene, camera, morphs[0], );
  // const newPosition = curve.getPoint(fraction);
  // const tangent = curve.getTangent(fraction);
  // morphs[0].position.copy(newPosition);

  mixer.update(delta)
  clips.forEach( function ( clip: any ) {
    mixer.clipAction( clip ).play();
  })
  requestAnimationFrame(animate)
  render()
}

function render() {
  renderer.render(scene, camera)
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
// CONTROLS (replaced with GUI)
function keys() {
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

  if (chase > -1) {
    let mm = new THREE.Matrix4()
    mm.copyPosition(morphs[chase].sphere.matrix)
    let position = new THREE.Vector3(0, 0.0, 0)
    position.setFromMatrixPosition(mm)

    let x =
      position.x + morphs[chase].r * 4 * Math.cos(angle - morphs[chase].a1)
    let z =
      position.z + morphs[chase].r * 4 * Math.sin(angle - morphs[chase].a1)
    camera.position.set(x, 0, z)
    camera.lookAt(position)
  } else {
    camera.position.set(0, 400, 400)
    camera.lookAt(new THREE.Vector3(0, 0.0, 0))
  }
}
