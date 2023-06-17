import {
    Mesh3D, 
    StandardMaterial, 
    Color,
    StandardMaterialAlphaMode,
    Point3D,
    Container3D
} from 'pixi3d/pixi7';


// const material = new StandardMaterial();
// material.unlit = false; // Set unlit = true to disable all lighting.
// material.baseColor = new Color(1, 1, 1, 1); // The base color will be blended together with base color texture (if available).
// material.alphaMode = StandardMaterialAlphaMode.opaque; // Set alpha mode to "blend" for transparency (base color alpha less than 1).
// material.exposure = 2; // Set exposure to be able to control the brightness.
// material.metallic = 0; // Set to 1 for a metallic material.
// material.roughness = 0.3; // Value between 0 and 1 which describes the roughness of the material.

const material2 = new StandardMaterial();
material2.unlit = false; // Set unlit = true to disable all lighting.
material2.baseColor = new Color(1, 0, 0, 1); // The base color will be blended together with base color texture (if available).
material2.alphaMode = StandardMaterialAlphaMode.opaque; // Set alpha mode to "blend" for transparency (base color alpha less than 1).
material2.exposure = 2; // Set exposure to be able to control the brightness.
material2.metallic = 0; // Set to 1 for a metallic material.
material2.roughness = 0.3; // Value between 0 and 1 which describes the roughness of the material.

const createMaterial = () => {
    const material = new StandardMaterial();
    material.unlit = false; // Set unlit = true to disable all lighting.
    material.baseColor = new Color(Math.random() * 2, Math.random() * 1, Math.random() * 0.3, 1); // The base color will be blended together with base color texture (if available).
    material.alphaMode = StandardMaterialAlphaMode.opaque; // Set alpha mode to "blend" for transparency (base color alpha less than 1).
    material.exposure = 2; // Set exposure to be able to control the brightness.
    material.metallic = 0; // Set to 1 for a metallic material.
    material.roughness = 0.3; // Value between 0 and 1 which describes the roughness of the material.
    return material;
};

const createPlane = () => {
    const container = new Container3D();
    const plane1 = Mesh3D.createPlane(createMaterial());
    const plane2 = Mesh3D.createPlane(createMaterial());
    plane1.rotationQuaternion.setEulerAngles(0, 0, 180);
    container.addChild(plane1);
    container.addChild(plane2);
    return container;
};

export default class Box extends Container3D {

    public forward: Container3D;
    public back: Container3D;
    public right: Container3D;
    public left: Container3D;
    public floor: Container3D;
    public ceiling: Container3D;
    public item: Mesh3D;

    constructor ()
    {
        super();

        const forward = createPlane();
        forward.scale = new Point3D(0.5, 1, 1);
        forward.rotationQuaternion.setEulerAngles(90, 0, 0);
        forward.z = -0.5;
        this.addChild(forward);
    
        const back = createPlane();
        back.scale = new Point3D(0.5, 1, 1);
        back.rotationQuaternion.setEulerAngles(-90, 0, 0);
        back.z = 0.5;
        this.addChild(back);
    
        const right = createPlane();
        right.scale = new Point3D(0.5, 1, 1);
        right.x = 0.5;
        right.rotationQuaternion.setEulerAngles(90, -90, 0);
        this.addChild(right);
    
        const left = createPlane();
        left.scale = new Point3D(0.5, 1, 1);
        left.x = -0.5;
        left.rotationQuaternion.setEulerAngles(90, 90, 0);
        this.addChild(left);
    
        const floor = createPlane();
        floor.scale = new Point3D(0.5, 1, 0.5);
        floor.y = -1;
        this.addChild(floor);
    
        // const ceiling = Mesh3D.createPlane(material);
        // ceiling.scale = new Point3D(0.5, 1, 0.5);
        // ceiling.y = 1;
        // ceiling.rotationQuaternion.setEulerAngles(0, 90, 180);
        // this.addChild(ceiling);
    
        // const center = Mesh3D.createSphere(createMaterial());
        // center.x = 0;
        // center.y = -1;
        // center.z = 0;
        // center.scale = new Point3D(0.05, 0.05, 0.05);
        // center.interactive = true;
        // center.hitArea = new PickingHitArea(center);
        // center.on("pointerdown", () => {
        //     center.scale.set(0.7);
        // });
        // center.on("pointerup", () => {
        //     center.scale.set(0.05);
        // });
        // this.addChild(center);

        const item = Mesh3D.createCube(createMaterial());
        item.x = 0;
        item.y = -0.9;
        item.z = 0;
        item.scale = new Point3D(0.05, 0.05, 0.05);
        // item.interactive = true;
        // item.hitArea = new PickingHitArea(item);
        // item.on("pointerdown", () => {
        //     item.scale.set(0.7);
        // });
        // item.on("pointerup", () => {
        //     item.scale.set(0.05);
        // });
        item.visible = false;
        this.addChild(item);

        // Mesh3D.createQuad()

        this.forward = forward;
        this.back = back;
        this.right = right;
        this.left = left;
        this.floor = floor;
        this.item = item;
    }

}
