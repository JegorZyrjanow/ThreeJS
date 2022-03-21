import * as THREE from "three";

let path
let mixer
let T = 11;
let t = 0;

function buildPath( shift = 0, scene ){
    // Path points
    mixer = new THREE.AnimationMixer(scene);
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
    path = new THREE.CatmullRomCurve3( vertices )
    path.closed = true // closing the path

    // Visualize
    let geometry = new THREE.BufferGeometry().setFromPoints( vertices )
    let material = new THREE.LineBasicMaterial( { color : 0x00daa1 } )
    let curveObject = new THREE.Line( geometry, material )
    scene.add( curveObject )

    return path
}

function setPathFor( scene, morph, pathShift = 0 ){
    let delta = clock.getDelta();
    mixer.update( delta );
    t += delta;
    //const oldObjectPosition = new THREE.Vector3()
    //for (let i = 0; i < morphs.length; i++) {
    //morph = morphs[i];
    if ( t >= T )
        t = 0;
    morph.position.copy(( buildPath(pathShift, scene).getPointAt( t / T ) )); // HERE'D BE FLW
    if ( t + 0.1 > T )
        t = 0;
    let nextPoint = new THREE.Vector3();
    nextPoint.copy(path.getPointAt( (t + 0.1) / T) );
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

export { buildPath, setPathFor }