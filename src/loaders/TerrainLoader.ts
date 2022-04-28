import * as THREE from 'three'

class TerrainLoader {
  private readonly _terrainTexture: string
  private readonly _normalMap: string
  private readonly _size: number
  private readonly _image: any = new Image()
  private _model: THREE.Object3D
  private _imageData: any = null

  constructor(terrainTexture: string, normalMap: string, size: number) {
    this._terrainTexture = terrainTexture
    this._normalMap = normalMap
    this._size = size
  }
  public get image(): any {
    if (this._image == null) {
      console.log('--> No image loaded.')
    }
    return this._image
  }
  public get model(): THREE.Object3D {
    if (this._model == null) {
      console.log('--> No model loaded.')
    }
    return this._model
  }
  createTerrain(callback: any) {
    const texture = new THREE.TextureLoader().load(this._terrainTexture)
    const size = this._size

    // -- how to extraxt this from here?
    let canvas: any = document.createElement('canvas')
    let context: any = canvas.getContext('2d')
    // --

    const image = this._image
    image.src = this._normalMap

    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)
      this._imageData = context.getImageData(0, 0, image.width, image.height)

      // create field of vertices with uvs
      let vertices: any = []
      let uvs: any = []
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          let h = this.getPixel(this._imageData, z, x)
          vertices.push(x, h / 10, z)
          uvs.push(z / (size - 1), x / (size - 1))
        }
      }

      // building plane from triangles [algorythm]
      let faces: any = []
      let num: number = size // another variable to calculate decades (y)
      for (let m = 0; m < size - 1; m++) {
        for (let n = 0; n < size - 1; n++) {
          // triangle (upper corner)
          faces.push(num + n - size, num + n - size + 1, num + n + 1)

          // triangle (lower corner)
          faces.push(num + n - size, num + n + 1, num + n)
        }
        num = num + size // add decade after one row rendered
      }

      // setting terrain geometry
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      )
      geometry.setIndex(faces)
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
      geometry.computeVertexNormals()

      // setting terrain texture
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(16, 26)
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        wireframe: false,
        side: THREE.DoubleSide
      })

      // bake and throw mesh to model's public field
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(-112, 0, -112)
      this._model = mesh

      // call add-model-in-scene function after model loaded
      callback(image)
    }
  }

  getPixel(imageData: any, x: number, y: number) {
    const position = (x + imageData.width * y) * 4
    const data = imageData.data
    return data[position]
  }

  addModel(model: any) {}

  loadModels() {}
}

export default TerrainLoader
