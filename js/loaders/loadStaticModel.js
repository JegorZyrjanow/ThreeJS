import * as THREE from '../lib/three.module.js'
import { MTLLoader } from '../lib/MTLLoader.js'
import { OBJLoader } from '../lib/OBJLoader.js'

let manager = new THREE.LoadingManager()
let result

function getStaticModel( path, oName, mName ) {
  let MtlLoader = new MTLLoader( manager )
  let ObjLoader = new OBJLoader( manager )

  MtlLoader.setPath( path ) 
  MtlLoader.load( mName, ( materials ) => { 
    materials.preload()
    ObjLoader.setMaterials( materials )
    ObjLoader.setPath( path )
    ObjLoader.load( oName, ( obj ) => {
      obj.position.x = 200
      obj.scale.set( 0.15, 0.15, 0.15 )
      const x = Math.round( Math.random() * N )
      const z = Math.round( Math.random() * N )
      const h = getPixel( imageData, z, x )
      obj.position.x = x
      obj.position.z = z 
      obj.position.y = h / 10 - 1
      console.log( obj )
      result = obj
    })
  })
}

function loadStaticModel(path, oName, mName) {
  getStaticModel(path, oName, mName)
  return result
}

export default loadStaticModel