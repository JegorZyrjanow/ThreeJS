import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

//let manager = new THREE.LoadingManager()

class StaticModelLoader {
    private readonly _objPath: string
    private readonly _mtlPath: string
    private readonly _image: typeof Image
    private _model: THREE.Object3D
    private _imageData: any // ???

    constructor( objPath: string, mtlPath: string, image: typeof Image) {
        this._objPath = objPath
        this._mtlPath = mtlPath
        this._image = image
    }

    get model(): THREE.Object3D {
        if (this._model == null) {
            console.log("--> No model loaded.")
        }
        return this._model
    }

    createModel(callback: any) {
        let N = 225 // replace with data.width
        let canvas = (document.getElementsByTagName('canvas'))[0] // ???
        let context = canvas.getContext( '2d' ) // ???
        //context.getImageData
        //let imageData = context.getImageData(0, 0, image.width, image.height)  

        // init three's loaders
        let mtlLoader = new MTLLoader()
        let objLoader = new OBJLoader()

        // work with image (normalMap)

        // setting path to the models
        // loading the material
        mtlLoader.load( this._mtlPath, ( materials ) => {
            materials.preload()
            // setting the material
            objLoader.setMaterials( materials )
            // loading object model
            objLoader.load( this._objPath, ( obj ) => {
                // just transforming obj
                obj.position.x = 200
                obj.scale.set( 0.15, 0.15, 0.15 )
                const x = Math.round( Math.random() * N )
                const z = Math.round( Math.random() * N )
                console.log( this._image )
                const h = this.getPixel( this._image, z, x )
                obj.position.x = x
                obj.position.z = z 
                obj.position.y = h / 10 - 1
                this._model.add( obj ) // replace with private model field
                console.log(obj)
                console.log(this._model)
            })
        })

        // call add-model-in-scene function after model loaded
        // callback( image )
    }

    // What to do with this?
    getPixel(image: any, x: number, y: number){
        console.log(image)
        const position = ( x + image.width * y ) * 4
        const data = image.data
        return data[position];
    }
}


export default StaticModelLoader