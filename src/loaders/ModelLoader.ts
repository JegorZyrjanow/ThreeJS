import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

//let manager = new THREE.LoadingManager()

class StaticModelLoader {
  private readonly _objPath: string
  private readonly _mtlPath: string
  private readonly _image: typeof Image
  private _model: THREE.Object3D
  private _imageData: any // ???

  constructor(objPath: string, mtlPath: string, image: typeof Image) {
    this._objPath = objPath
    this._mtlPath = mtlPath
    this._image = image
  }

set

  get model(): THREE.Object3D {
    if (this._model == null) {
      console.log('--> No model loaded.')
    }
    return this._model
  }

  createModel(callback: any) {
    let N = 225 // replace with data.width
    let canvas = document.getElementsByTagName('canvas')[0] // ???
    let context = canvas.getContext('2d') // ???
    //context.getImageData
    //let imageData = context.getImageData(0, 0, image.width, image.height)

    // init three's loaders
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()

    // work with image (normalMap)

    // setting path to the models
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
        console.log(this._image)
        // const h = this.getPixel( this._image, z, x )
        obj.position.x = x - 112
        obj.position.z = z - 112
        // obj.position.y = h / 10 - 1
        this._model = obj // replace with private model field
        console.log(obj)
        console.log(this._model)
        callback()
      })
    })
    // call add-model-in-scene function after model loaded
  }

  // What to do with this?
  getPixel(image: any, x: number, y: number) {
    console.log(image)
    const position = (x + image.width * y) * 4
    const data = image.data
    return data[position]
  }
}

class AnimatedModelLoader {
  private readonly _path: string
  private _model: THREE.Object3D
  constructor(path: string) {
    this._path = path
  }
  get model(): THREE.Object3D {
    if (this._model == null) console.log('--> No model loaded.')
    return this._model
  }
  createModel() {
    let GltfLoader = new GLTFLoader()
    let model = new THREE.Object3D()
    GltfLoader.load(this._path, (gltf: any) => {
      let mesh
      mesh = gltf.scene.children[0]
      mesh.scale.set(0.05, 0.05, 0.05)
      mesh.castShadow = true
      model.add(mesh)
    })
    return model
  }
}

export { StaticModelLoader, AnimatedModelLoader }
