import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader();

const loadSphere = (radius, texturePath) => {
    let geometry = new THREE.SphereGeometry(radius, 200, 200)
    let texture = textureLoader.load(texturePath)
    texture.minFilter = THREE.NearestFilter
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })

    return new THREE.Mesh( geometry, material )
}

export default loadSphere