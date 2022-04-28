import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class StaticModelLoader {
  private readonly _objPath: string
  private readonly _mtlPath: string
  private readonly _image: typeof Image
  private readonly _imageData: any
  private _model: THREE.Object3D
  constructor(objPath: string, mtlPath: string, image: typeof Image, imageData: any) {
    this._objPath = objPath
    this._mtlPath = mtlPath
    this._image = image
    this._imageData = imageData
  }
  get model(): THREE.Object3D {
    if (this._model == null) {
      console.log('--> No model loaded.')
    }
    return this._model
  }
  createModel(callback: any) {
    let N = 225 // replace with data.width
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()
    // setting path to the models ???
    // loading the material
    mtlLoader.load(this._mtlPath, materials => {
      materials.preload()
      // setting the material
      objLoader.setMaterials(materials)
      // loading object model
      objLoader.load(this._objPath, obj => {
        // just transforming obj
        obj.position.x = 200
        obj.scale.set(0.15, 0.15, 0.15)
        const x = Math.round(Math.random() * N)
        const z = Math.round(Math.random() * N)
        const h = this.getPixel( z, x )
        obj.position.x = x - 112
        obj.position.z = z - 112
        obj.position.y = h / 10 - 0.1
        this._model = obj // replace with private model field
        callback()
      })
    })
  }
  getPixel(x: number, y: number) {
    const position = (x + this._imageData.width * y) * 4
    const data = this._imageData.data
    return data[position]
  }
}

class AnimatedModelLoader {
  private readonly _path: string
  private readonly _imageData: any
  private _model: THREE.Object3D
  constructor(path: string, imageData: any) {
    this._path = path
    this._imageData = imageData
  }
  get model(): THREE.Object3D {
    if (this._model == null) console.log('--> No model loaded.')
    return this._model
  }
  createModel(callback: any) {
    let GltfLoader = new GLTFLoader()
    let model = new THREE.Object3D()
    GltfLoader.load(this._path, (gltf: any) => {
      let mesh
      mesh = gltf.scene.children[0]
      mesh.scale.set(0.05, 0.05, 0.05)
      mesh.castShadow = true
      this._model = (mesh)
      const z = mesh.position.z
      const x = mesh.position.x
      const h = this.getPixel( z, x )
      this._model.position.setY(h / 10 + 25)
      callback()
    })
  }
  getPixel(x: number, y: number) {
    console.log(this._imageData)
    const position = (x + this._imageData.width * y) * 4
    const data = this._imageData.data
    return data[position]
  }
}

export { StaticModelLoader, AnimatedModelLoader }
