var container, camera, scene, renderer;
var loader = new THREE.TextureLoader();
var clock = new THREE.Clock();

var planets = [];
var keyboard = new THREEx.KeyboardState();
var chase = -1;
var angle = Math.PI/2;

init();

animate();

function init(){
    container = document.getElementById('container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        4000);
    camera.position.set(0, 400, 400);
    camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    
    var lightAmbient = new THREE.AmbientLight( 0x202020 );
    scene.add(lightAmbient);
    var lightSun = new THREE.PointLight( 0xdfdfdf );
    scene.add(lightSun);
    
    addSphere(750, "images/starmap.jpg", 0); // Star field
    addSphere(25, "images/sunmap.jpg", 0); // Sun
    
    
    planets.push(addPlanet(5, "images/venusmap.jpg", 100, 0.15, 0.2, null)); // Venus
    planets.push(addPlanet(6, "images/earthmap1k.jpg", 150, 0.12, 0.3, addPlanet(2, "images/moonmap1k.jpg", 10, 1, 1, null))); // Earth
    planets.push(addPlanet(5, "images/marsmap1k.jpg", 200, 0.1, 0.1, null)); // Mars
    
    // addPlanet(2, "images/moonmap1k.jpg", 30, 0, 0); // Moon
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate(){
    var delta = clock.getDelta();

    keys(delta);

    for(var i = 0; i < planets.length; i++){
        var m0 = new THREE.Matrix4();
        var mRotation = new THREE.Matrix4();
        var mPosition = new THREE.Matrix4();
        var mIdk = new THREE.Matrix4();

        planets[i].a1 += planets[i].s1 * delta;
        planets[i].a2 += planets[i].s2 * delta;

        mRotation.makeRotationY(planets[i].a1);
        mPosition.setPosition(new THREE.Vector3(planets[i].position, 0, 0));
        
        m0.multiplyMatrices(mRotation, mPosition);
        
        mIdk.makeRotationY(planets[i].a2);
        
        m0.multiplyMatrices(m0, mIdk);
        
        planets[i].sphere.matrix = m0;
        planets[i].sphere.matrixAutoUpdate = false;

        if( planets[i].satelite != null){
            var sm0 = new THREE.Matrix4();
            var smRotation = new THREE.Matrix4();
            var smPosition = new THREE.Matrix4();
            var smIdk = new THREE.Matrix4();

            planets[i].satelite.a1 += planets[i].satelite.s1 * delta;
            planets[i].satelite.a2 += planets[i].satelite.s2 * delta;

            smRotation.makeRotationY(planets[i].a1);
            smPosition.setPosition(new THREE.Vector3(planets[i].satelite.position, 0, 0));
            
            sm0.multiplyMatrices(smRotation, smPosition);
            smRotation.makeRotationY(planets[i].satelite.a2)
            sm0.multiplyMatrices(smRotation, sm0);

            var mm = new THREE.Matrix4();
            mm.copyPosition(planets[i].sphere.matrix);
            var position = new THREE.Vector3(0,0,0);
            position.setFromMatrixPosition(mm);

            smPosition.setPosition(position);
            sm0.multiplyMatrices( smPosition, sm0);
            
            planets[i].satelite.sphere.matrix = sm0;
            planets[i].satelite.sphere.matrixAutoUpdate = false;

            planets[i].satelite.trace.position.copy(position);
        }
    }

    requestAnimationFrame(animate);
    render();

}

function render(){
    renderer.render(scene, camera);

}

function addSphere(radius, textureLocation, position){
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var texture = loader.load(textureLocation);
    texture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    })
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = position;
    scene.add(sphere);
}

function keys(delta){
    if(keyboard.pressed("0")){
        chase = -1;
    }
    if(keyboard.pressed("1")){
        chase = 0;
    }
    if(keyboard.pressed("2")){
        chase = 1;
    }
    if(keyboard.pressed("3")){
        chase = 2;
    }
    if(chase > -1){
        var mm = new THREE.Matrix4();
        mm.copyPosition(planets[chase].sphere.matrix);
        var position = new THREE.Vector3(0,0.0,0);
        position.setFromMatrixPosition(mm);

        var x = position.x + planets[chase].r * 4 * Math.cos(angle - planets[chase].a1);
        var z = position.z + planets[chase].r * 4 * Math.sin(angle - planets[chase].a1);
        camera.position.set(x, 0, z);
        camera.lookAt(position)
    }
    else{
        camera.position.set(0, 400, 400);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0))
    }
}