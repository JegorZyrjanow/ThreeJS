import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

class Model {
    gltfLoader = new GLTFLoader()
    objLoader = new OBJLoader()
    mtlLoader = new MTLLoader()

    constructor(
        public path: string,
        public glbName?: string,
        public objName?: any,
        public mtlName?: any,
    ) {
        this.gltfLoader.setPath(path)
        this.objLoader.setPath(path)
        this.mtlLoader.setPath(path)
    }

    
}