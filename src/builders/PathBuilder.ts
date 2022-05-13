import * as THREE from 'three'
import { callbackify } from 'util'

class PathBuilder {
  private readonly _scene
  private readonly _camera
  private _path: any
  mixer: any
  T: number = 11
  t: number = 0
  private _curves = []

  constructor(scene: any, camera: any) {
    this._scene = scene
    this._camera = camera
  }

  get path() {
    if (this._curves == undefined) {
      console.log("--> path is not loaded yet.")
    }
    return this._path
  }

  // makeFcnBirdMoving(model: any) {
  //   const newPosition = this._curves[0].getPoint()
  //   const tangent = this._curves[0].getTangent()
  //   model.position.copy(newPosition)
  // }
  build(shift: number = 0, scene: any) {
    return new Promise<void>(resolve => {
      // Path points
      this.mixer = new THREE.AnimationMixer(scene)
      let cY = 40
      let firstCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(20 + shift, cY, 20 + shift),
        new THREE.Vector3(20 + shift, cY, -20 + shift),
        new THREE.Vector3(-20 + shift, cY, -20 + shift),
        new THREE.Vector3(-20 + shift, cY, 20 + shift)
      )
      let secondCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(20 + shift, cY, 20 + shift),
        new THREE.Vector3(20 + shift, cY, -20 + shift),
        new THREE.Vector3(-20 + shift, cY, -20 + shift),
        new THREE.Vector3(-20 + shift, cY, 20 + shift)
      )
      let firstVerticesSet = firstCurve.getPoints(20)
      let secondVerticesSet = secondCurve.getPoints(20)
      let vertices = firstVerticesSet.concat(secondVerticesSet)
      // console.log(this._curves)
      // this._curves.push(firstCurve)

      // Create a path
      this._path = new THREE.CatmullRomCurve3(vertices) 
      this._path.closed = true // closing the path
      console.log('--> path is (in the class): ' + this._path)
      resolve()
    })
    // Visualize [NOT USED]
    // let geometry = new THREE.BufferGeometry().setFromPoints(vertices)
    // let material = new THREE.LineBasicMaterial({ color: 0x00daa1 })
    // let curveObject = new THREE.Line(geometry, material)
    // scene.add(curveObject)
  }
//   setPathFor(morph: any, pathShift: any = 0) {
//     let delta = new THREE.Clock().getDelta()
//     this.mixer = new THREE.AnimationMixer(morph)
//     this.mixer.update(delta)
//     this.t = delta
//     if (this.t >= this.T) this.t = 0
//     let pathPoint = this.build(pathShift, this._scene).getPointAt(this.t / this.T)
//     morph.position.copy(pathPoint) // THERE'LL BE FLW
//     if (this.t + 0.1 > this.T) this.t = 0
//     let nextPoint = new THREE.Vector3()
//     nextPoint.copy(this.path.getPointAt((this.t + 0.1) / this.T))
//     morph.lookAt(nextPoint)

//     let relativeCameraOffset = new THREE.Vector3(0, 3, -15)

//     let m1 = new THREE.Matrix4()
//     let m2 = new THREE.Matrix4()

//     // m1.extractRotation(morphs[0].matrixWorld);
//     // m2.extractPosition(morphs[0].matrixWorld);
//     m1.extractRotation(morph.matrixWorld)
//     m2.copyPosition(morph.matrixWorld)
//     m1.multiplyMatrices(m2, m1)

//     let cameraOffset = relativeCameraOffset.applyMatrix4(m1)
//     this._camera.position.copy(cameraOffset)

//     // DONE
//     this._camera.lookAt(morph.position)
//   }
}

export default PathBuilder
