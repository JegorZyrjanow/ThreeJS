import * as THREE from 'three'
import { MTLLoader } from '../../node_modules/three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'

//let manager = new THREE.LoadingManager()

function loadStaticModel( path, oName, mName, imageData ) {
    let N = 225
    let canvas = (document.getElementsByTagName('canvas'))[0]
    let context = canvas.getContext( '2d' )
    //context.getImageData
    //let imageData = context.getImageData(0, 0, image.width, image.height)  
    // init three's loaders
    let model = new THREE.Object3D()
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()
    // setting path to the models
    mtlLoader.setPath( path )
    objLoader.setPath( path )

    // loading the material
    mtlLoader.load( mName, ( materials ) => {
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
            console.log( imageData )
            const h = getPixel( imageData, z, x )
            obj.position.x = x
            obj.position.z = z 
            obj.position.y = h / 10 - 1
            model.add( obj )
        })
    })
    return model
}

function getPixel(imageData, x, y){
    const position = ( x + imageData.width * y ) * 4
    const data = imageData.data
    return data[position];
}

export default loadStaticModel