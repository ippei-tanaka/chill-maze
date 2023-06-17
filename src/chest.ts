import * as PIXI from 'pixi.js';
import {
    Model, 
    StandardMaterial, 
    StandardMaterialAlphaMode, 
    Color,
    Point3D
} from 'pixi3d/pixi7';

let promise:Promise<any> = null;

export const createChestModel = () => {
    if (!promise)
    {
        promise = PIXI.Assets.load('./models/chest.glb');
    }
    return promise.then((s) => {
        const model = Model.from(s);
        model.meshes.forEach((mesh) => {
            if (mesh.material)
            {
                const material = mesh.material as StandardMaterial;
                material.unlit = false; // Set unlit = true to disable all lighting.
                material.baseColor = new Color(5, 5, 0, 1); // The base color will be blended together with base color texture (if available).
                material.alphaMode = StandardMaterialAlphaMode.opaque; // Set alpha mode to "blend" for transparency (base color alpha less than 1).
                material.exposure = 2; // Set exposure to be able to control the brightness.
                material.metallic = 0; // Set to 1 for a metallic material.
                material.roughness = 0.3; // Value between 0 and 1 which describes the roughness of the material.
            }
        });
        model.scale = new Point3D(0.2, 0.2, 0.2);
        return model;
    });
}

















