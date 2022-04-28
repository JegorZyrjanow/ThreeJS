import * as THREE from 'three'

const loadLight = () => {
  const light = new THREE.PointLight(0xffffff, 1, 1000)
  light.position.set(300, 100, 128)
  light.castShadow = true
  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.camera.near = 0.5
  light.shadow.camera.far = 1500
  return light
}

export default loadLight
