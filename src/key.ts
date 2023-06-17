import * as PIXI from 'pixi.js';
import {
    Model
} from 'pixi3d/pixi7';



export default () => {
    const texturePromise = PIXI.Assets.load('./models/key.glb');

    texturePromise.then((s) => {
        console.log(s.gltf);
        console.log(Model.from(s));
    });
}
