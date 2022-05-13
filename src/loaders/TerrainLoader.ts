import * as THREE from 'three'

class TerrainLoader {
  private readonly _texture: string
  private readonly _normalMap: string
  private readonly _size: number
  private readonly _image: any = new Image()
  private _model: THREE.Object3D
  private _imageData: any = null

  constructor(
    terrainTexture: string,
    normalMap: string,
    size: number,
    imageData: any
  ) {
    this._texture = terrainTexture
    this._normalMap = normalMap
    this._size = size
    this._imageData = imageData
  }
  public get model(): THREE.Object3D {
    if (this._model == null) console.log('--> No model loaded.')
    return this._model
  }
  createTerrain() {
    return new Promise(resolve => {
      const texture = new THREE.TextureLoader().load(this._texture)
      const size = this._size
      // create vertices
      let vertices: any = []
      let uvs: any = []
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          let h = this.getHeightAt(this._imageData, z, x)
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
    })
  }
  // get height on normalmap pixel
  getHeightAt(imageData: any, x: number, y: number) {
    const position = (x + imageData.width * y) * 4
    const data = imageData.data
    return data[position]
  }
}

export default TerrainLoader
