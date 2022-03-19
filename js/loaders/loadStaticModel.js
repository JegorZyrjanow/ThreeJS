import * as THREE from '../lib/three.module.js'
import { MTLLoader } from '../lib/MTLLoader.js'
import { OBJLoader } from '../lib/OBJLoader.js'

//let manager = new THREE.LoadingManager()

function loadStaticModel( path, oName, mName ) {
    // init three's loaders
    let model = new THREE.Object3D()
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()
    // setting path to the models
    mtlLoader.setPath( path ) 
    objLoader.setPath( path )

    // loading the material
    mtlLoader.load( mName, ( materials ) => { // tf is that 'material'? 
        materials.preload()
        // setting the material
        objLoader.setMaterials( materials )
        // loading object model
        objLoader.load( oName, ( obj ) => {
            // just transforming obj
            obj.position.x = 200
            obj.scale.set( 0.15, 0.15, 0.15 )
            const x = Math.round( Math.random() * N )
            const z = Math.round( Math.random() * N )
            const h = getPixel( imageData, z, x )
            obj.position.x = x
            obj.position.z = z 
            obj.position.y = h / 10 - 1
            model.add( obj )
        })
    })
    return model
}

function l1oadStaticModel(path, oName, mName) {
    getStaticModel(path, oName, mName)
    return result
}

export default loadStaticModel