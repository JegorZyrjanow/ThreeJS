import * as THREE from '../lib/three.module.js'

let geometry = new THREE.BufferGeometry()

class TerrainLoader {
    constructor() {}

    imageData
    N = 225
    geometry = new THREE.BufferGeometry()

    loadTerrain() {
        //let imageData = this.imageData
        let N = this.N
        let model = new THREE.Object3D()
        let canvas = document.createElement( 'canvas' )
        let context = canvas.getContext( '2d' )
        const image = new Image()
        image.src = 'images/normalMap.jpg'
        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            context.drawImage( image, 0, 0 )
            this.imageData = context.getImageData( 0, 0, image.width, image.height )

            //createTerrain();
            let vertices = [];
            let uvs = [];
            let faces = [];
            for (let z = 0; z < N; z++) {
                for (let x = 0; x < N; x++) {
                    let h = getPixel( this.imageData, z, x );
                    vertices.push( x, h/10, z );
                    uvs.push( z / (N - 1), x / (N - 1) );
                }
            }

            let num = N; // создание переменной для перечисления десятков (y)
            for (let m = 0; m < N - 1; m++) {    
                for (let n = 0; n < N - 1; n++) {
                    faces.push( (num + n - N), (num + n - N) + 1, num + (n + 1) ); // треугольник (верхний угол)
                    faces.push( (num + n - N), num + (n + 1), num + (n) ); // треугольник (нижний угол)
                }
                num = num + N; // добавление десятка после отрисовки одной строки
            }

            geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute( vertices, 3 ) );
            geometry.setIndex( faces )
            geometry.setAttribute(
                'uv',
                new THREE.Float32BufferAttribute( uvs, 2 ) );
            geometry.computeVertexNormals();

            let texture = new THREE.TextureLoader().load( '../../images/terrain.jpg' )
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 16, 26 ); 
            let material = new THREE.MeshLambertMaterial({
                map: texture,
                wireframe: false,
                side: THREE.DoubleSide
            })

            let mesh = new THREE.Mesh( geometry, material )
            model.add( mesh )
        }
        return model 
    }

    getImageData() {
        console.log( this.imageData )
        return this.imageData
    }
}

function getPixel(imageData, x, y){
    const position = ( x + imageData.width * y ) * 4
    const data = imageData.data
    return data[position];
}

export default TerrainLoader