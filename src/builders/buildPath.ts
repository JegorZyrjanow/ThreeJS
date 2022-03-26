import * as THREE from "three";

class PathBuilder {
    constructor() {

    }
    path: any
    mixer: any
    T: number = 11
    t: number = 0

    buildPath( shift: number = 0, scene: any ){
        // Path points
        this.mixer = new THREE.AnimationMixer(scene);
        let curve
        let cY = 40
        curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3( 120 + shift, cY, 120 + shift ),
            new THREE.Vector3( 120 + shift, cY, 25 + shift ),
            new THREE.Vector3( 50 + shift, cY, 25 + shift ),
            new THREE.Vector3( 50 + shift, cY, 120 + shift )
        );
        let vertices = [] = curve.getPoints( 100 )

        // New path with points
        this.path = new THREE.CatmullRomCurve3( vertices )
        this.path.closed = true // closing the path

        // Visualize
        let geometry = new THREE.BufferGeometry().setFromPoints( vertices )
        let material = new THREE.LineBasicMaterial( { color : 0x00daa1 } )
        let curveObject = new THREE.Line( geometry, material )
        scene.add( curveObject )

        return this.path
    }

    setPathFor( scene: any, camera: any, morph: any, pathShift: any = 0 ){
        let delta = new THREE.Clock().getDelta();
        this.mixer = new THREE.AnimationMixer( morph )
        this.mixer.update( delta );
        this.t = delta;
        if ( this.t >= this.T )
            this.t = 0;
        let pathPoint = ( this.buildPath(pathShift, scene).getPointAt( this.t / this.T ) ) 
        morph.position.copy( pathPoint ); // THERE'LL BE FLW
        if ( this.t + 0.1 > this.T )
            this.t = 0;
        let nextPoint = new THREE.Vector3();
        nextPoint.copy(this.path.getPointAt( (this.t + 0.1) / this.T) );
        morph.lookAt( nextPoint );
    
        let relativeCameraOffset = new THREE.Vector3( 0, 3, -15 )
    
        let m1 = new THREE.Matrix4();
        let m2 = new THREE.Matrix4();
    
        // m1.extractRotation(morphs[0].matrixWorld);
        // m2.extractPosition(morphs[0].matrixWorld);
        m1.extractRotation( morph.matrixWorld );
        m2.copyPosition( morph.matrixWorld );
        m1.multiplyMatrices( m2, m1 );
    
        let cameraOffset = relativeCameraOffset.applyMatrix4(m1);
        camera.position.copy( cameraOffset );
    
        // DONE
        camera.lookAt( morph.position );
    }
}

export default PathBuilder