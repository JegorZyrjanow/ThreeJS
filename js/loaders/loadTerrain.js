import * as THREE from '../lib/three.module.js'

var geometry = new THREE.BufferGeometry()
var imageData
const N = 225

function loadTerrain() {
    let model = new THREE.Object3D()
    let canvas = document.createElement( 'canvas' )
    const context = canvas.getContext( '2d' )
    const image = new Image()
    image.src = 'images/normalMap.jpg'
    image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        context.drawImage( image, 0, 0 )
        imageData = context.getImageData(0, 0, image.width, image.height)

        //createTerrain();
        var vertices= []
        var uvs = []
        var faces = []
        for ( let z = 0; z < N; z++ ){
            for ( let x = 0; x < N; x++ ){
                var h = getPixel( imageData, z, x )
                vertices.push( x, h / 10, z )
                uvs.push( z / ( N - 1 ), x / ( N - 1 ) )
            }
        }

        var num = N
        for ( let n = 0; n < N - 1; n++){
            for ( let m = 0; m < N - 1; m++ ){
                faces.push( (num + n - N), (num + n - N) + 1, num + (n + 1) )
                faces.push( (num + n - N), num + (n + 1), num + (n))
            }
          num = num + N
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute( vertices, 3 ));
        geometry.setIndex( faces )
        geometry.setAttribute(
            'uv',
            new THREE.Float32BufferAttribute( uvs, 2));
        geometry.computeVertexNormals();

        var texture = new THREE.TextureLoader().load('../../images/terrain.jpg')
        var material = new THREE.MeshLambertMaterial({
            map: texture,
            wireframe: false,
            side: THREE.DoubleSide
        })

        var mesh = new THREE.Mesh( geometry, material )
        model.add( mesh )
    }
    return model
}

function getPixel(imageData, x, y){
    const position = (x + imageData.width * y) * 4
    const data = imageData.data

    return data[position];
}

export default loadTerrain