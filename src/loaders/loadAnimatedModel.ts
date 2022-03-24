import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function loadAnimatedModel(path: string) {
    let model = new THREE.Object3D()
    
    let GltfLoader = new GLTFLoader();
    GltfLoader.load(path, (gltf) => {
        let mesh
        mesh = gltf.scene.children[0]
        mesh.scale.set(0.05, 0.05, 0.05)
        mesh.castShadow = true
        model.add( mesh )
    })
    
    return model
}

export default loadAnimatedModel