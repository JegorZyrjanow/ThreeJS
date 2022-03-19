import * as THREE from '../lib/three.module.js'
import { GLTFLoader } from '../lib/GLTFLoader.js'

var mesh

function loadAnimatedModel(path, scene) {
  let mixer = new THREE.AnimationMixer( scene )
  let GltfLoader = new GLTFLoader();
  let model
  GltfLoader.load(path, (gltf) => {
    mesh = gltf.scene.children[0]

    var animations = gltf.animations
    mixer.clipAnimation( animations[0], mesh ).play()

    mesh.scale.set(0.05, 0.05, 0.05)
    mesh.castShadow = true

    model = mesh
  })
  return model
}

export default loadAnimatedModel
