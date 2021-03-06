import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class ModelLoader {
  protected readonly _imageData: any
  constructor(imageData: any) {
    this._imageData = imageData
  }
  getHeight(x: number, y: number) {
    const position = (x + this._imageData.width * y) * 4
    const data = this._imageData.data
    return data[position]
  }
}

class StaticModelLoader extends ModelLoader {
  private readonly _objPath: string
  private readonly _mtlPath: string
  private _model: THREE.Object3D
  constructor(objPath: string, mtlPath: string, imageData: any) {
    super(imageData)
    this._objPath = objPath
    this._mtlPath = mtlPath
  }
  get model(): THREE.Object3D {
    if (this._model == null) console.log('--> No model loaded.')
    return this._model
  }
  createModel() {
    return new Promise(resolve => {
      const N = 225 // replace with data.width
      // setting path to the models ???
      // loading the material
      new MTLLoader().load(this._mtlPath, materials => {
        const objLoader = new OBJLoader()
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
          const h = super.getHeight(z, x)
          obj.position.x = x - 112
          obj.position.z = z - 112
          obj.position.y = h / 10 - 0.1
          this._model = obj // replace with private model field
          resolve('--> createModel is done')
        })
      })
    })
  }
}

class AnimatedModelLoader extends ModelLoader {
  private readonly _path: string
  private _model: THREE.Object3D
  constructor(path: string, imageData: any) {
    super(imageData)
    this._path = path
  }
  get model(): THREE.Object3D {
    if (this._model == null) console.log('--> No model loaded.')
    return this._model
  }
  createModel() {
    return new Promise(resolve => {
      new GLTFLoader().load(this._path, (gltf: any) => {
        const mesh = gltf.scene.children[0]
        mesh.scale.set(0.05, 0.05, 0.05)
        mesh.castShadow = true
        this._model = mesh
        const z = mesh.position.z
        const x = mesh.position.x
        const h = super.getHeight(z, x)
        this._model.position.setY(h / 10 + 25)
        resolve('--> createModel is done')
      })
    })
  }
}

export { StaticModelLoader, AnimatedModelLoader }
