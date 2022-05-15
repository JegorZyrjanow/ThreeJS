import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// Loaders
import TerrainLoader from './loaders/TerrainLoader'
import { StaticModelLoader, AnimatedModelLoader } from './loaders/ModelLoader'
import PathBuilder from './builders/PathBuilder'

// Resources
import parrotModel from       '../public/models/Parrot.glb'
import storkModel from        '../public/models/Stork.glb'
import skyImage from          '../public/images/sky.jpg'
import terrainTexture from    '../public/images/terrain.jpg'
import terrainNormalMap from  '../public/images/normalMap.jpg'
import treeObj from           '../public/models/Tree.obj'
import treeMtl from           '../public/models/Tree.mtl'

// VARIABLES
let container: any
let camera: any, scene: any, renderer: any
let angle: number = 45
//var imageData;
const N: number = 225
let fraction: number = 0
let clock: any = new THREE.Clock()
var delta = clock.getDelta()
let pathBuilder: any
let t = 0.0
let T = 15.0

let relativeCameraOffset = new THREE.Vector3(N / 2, N / 2, 15)
let m1 = new THREE.Matrix4()
let m2 = new THREE.Matrix4()

let controls: any
// VARIABLES-end

// GUI
const gui = new dat.GUI()

// BUTTONS
var followParrot = false
var followStork = false

var clickFirstButton = {
  returnCamera: function () {
    console.log('1st button is clicked')
    // ---
    followParrot = false
    followStork = false
    camera.position.set(N / 1.5, 100, 0)
    camera.lookAt(new THREE.Vector3(N / 2, 0.0, N / 2))
    console.log('1st button is clicked')
  }
}
gui.add(clickFirstButton, 'returnCamera')

let clickSecondButton = {
  lookAtParrot: function () {
    console.log('2nd button is clicked')
    // ---
    followParrot = true
    followStork = false
    console.log(followParrot, followStork)
  }
}
gui.add(clickSecondButton, 'lookAtParrot')

let clickThirdButton = {
  lookAtStork: function () {
    console.log('3rd button is clicked')
    // ---
    followParrot = false
    followStork = true
    console.log(followParrot, followStork)
  }
}
gui.add(clickThirdButton, 'lookAtStork')
// END-BUTTONS

// END-GUI

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
  terrainLoader.createTerrain().then(() => {
    terrain = terrainLoader.model
    scene.add(terrain)
  })
}
// Static Models (Trees)
function loadStaticModel(count: number, imageData: any) {
  for (let i = 0; i < count; i++) {
    const treeLoader = new StaticModelLoader(treeObj, treeMtl, imageData)
    treeLoader.createModel().then(() => {
      scene.add(treeLoader.model)
    })
  }
}
// Animated Models
let morphs: any = []
let mixer: any // = new THREE.AnimationMixer(scene)
let clips: any
let animatedModel: any
// Bird
function loadAnimatedModel(imageData: any) {
  return new Promise(resolve => {
    const animatedModelLoader = new AnimatedModelLoader(storkModel, imageData)
    animatedModelLoader.createModel().then(() => {
      animatedModel = animatedModelLoader.model
      morphs.push(animatedModel) // add to array for animation (?)
      scene.add(animatedModel)
      // Get the list of AnimationClip instances
      mixer = new THREE.AnimationMixer(animatedModel)
      clips = animatedModel.animations // NEVER READ
      resolve('--> loadAnimatedModel is done')
    })
  })
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
  camera.position.set(N / 1.5, 100, 0)
  camera.lookAt(new THREE.Vector3(N / 2, 0.0, N / 2))

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 1)
  container.appendChild(renderer.domElement)
  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    false
  )
  controls = new OrbitControls(camera, renderer.domElement)

  // Add Light
  const light = new THREE.PointLight(0xffffff, 1, 1000)
  light.position.set(300, 100, 128)
  light.castShadow = true
  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.camera.near = 0.5
  light.shadow.camera.far = 1500
  scene.add(light)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  // Add Sky
  let geometry = new THREE.SphereGeometry(1600, 200, 200)
  let texture = new THREE.TextureLoader().load(skyImage)
  texture.minFilter = THREE.NearestFilter
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  })
  const sky = new THREE.Mesh(geometry, material)
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
    loadAnimatedModel(imageData).then(() => {
      pathBuilder = new PathBuilder(scene, camera)

      pathBuilder.build(scene).then(buildAPath())

      function buildAPath() {
        morphs[0].route = pathBuilder.path
        animate()
      }
    })
  }
}

function animate() {
  controls.update()
  let delta = clock.getDelta()
  mixer.update(delta)
  for (let i = 0; i < morphs.length; i++) {
    let morph = morphs[i]
    var pos = new THREE.Vector3()

    if (t >= T) t = 0

    pos.copy(morph.route.getPointAt(t / T))
    morph.position.copy(pos)
    t += 0.015

    if (t >= T) t = 0

    let nextPoint = new THREE.Vector3()
    nextPoint.copy(morph.route.getPointAt(t / T))
    morph.lookAt(nextPoint)

    if (followParrot && i == 0) {
      cameraFollow(morph)
    }

    if (followStork && i == 0) {
      cameraFollow(morph)
    }
  }

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function cameraFollow(morph: any) {
  let relativeCameraOffset = new THREE.Vector3(0, 15, -40)
  let m1 = new THREE.Matrix4()
  let m2 = new THREE.Matrix4()

  m1.extractRotation(morph.matrixWorld)
  m1.copyPosition(morph.matrixWorld)
  m1.multiplyMatrices(m2, m1)

  let cameraOffset = relativeCameraOffset.applyMatrix4(m1)
  camera.position.copy(cameraOffset)
  camera.lookAt(morph.position)
}
