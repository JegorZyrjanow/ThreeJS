import * as THREE from '../lib/three.module.js'

const loadSphere = (radius, texturePath) => {
    const geometry = new THREE.SphereGeometry(radius, 200, 200)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath)
    texture.minFilter = THREE.NearestFilter

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })

    return new THREE.Mesh( geometry, material )
}

export default loadSphere
