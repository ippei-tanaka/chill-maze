import { Map } from "./map";

type OnMoveCallback = (newZ:number, newX:number, oldZ:number, oldX:number) => void;
type OnRotateCallback = (newRotation:number, oldRotation:number) => void;

export class Player 
{
    private _z = 0;
    private _x = 0;
    private _rotation = 0;
    private _onMoveCallback:OnMoveCallback = () => {};
    private _onRotateCallback:OnRotateCallback = () => {};
    private _map:Map;

    constructor (map:Map)
    {
        this._map = map;
    }

    get z () {
        return this._z;
    }

    get x () {
        return this._x;
    }

    get rotation () {
        return this._rotation;
    }

    get direction () {
        return ((this._rotation % 4) + 4) % 4;
    }

    onMove (callback:OnMoveCallback)
    {
        this._onMoveCallback = callback;
    }

    onRotate (callback:OnRotateCallback)
    {
        this._onRotateCallback = callback;
    }

    MoveForward ()
    {
        const oldZ = this.z;
        const oldX = this.x;

        switch (this.direction)
        {
            case 0:
                if (!!this._map.getRoom(this.z + 1, this.x)) 
                    this._z += 1;
                break;
            case 1:
                if (!!this._map.getRoom(this.z, this.x + 1)) 
                    this._x += 1;
                break;
            case 2:
                if (!!this._map.getRoom(this.z - 1, this.x)) 
                    this._z -= 1;
                break;
            case 3:
                if (!!this._map.getRoom(this.z, this.x - 1)) 
                    this._x -= 1;
                break;
        }

        if (oldZ !== this.z || oldX !== this.x)
            this._onMoveCallback(this._z, this._x, oldZ, oldX);
    }

    MoveBackward ()
    {
        const oldZ = this.z;
        const oldX = this.x;

        switch (this.direction)
        {
            case 0:
                if (!!this._map.getRoom(this.z - 1, this.x)) 
                    this._z -= 1;
                
                break;
            case 1:
                if (!!this._map.getRoom(this.z, this.x - 1)) 
                    this._x -= 1;
                break;
            case 2:
                if (!!this._map.getRoom(this.z + 1, this.x)) 
                    this._z += 1;
                break;
            case 3:
                if (!!this._map.getRoom(this.z, this.x + 1)) 
                    this._x += 1;
                break;
        }

        if (oldZ !== this.z || oldX !== this.x)
            this._onMoveCallback(this.z, this.x, oldZ, oldX);
    }

    TurnLeft ()
    {
        const oldRotation = this.rotation;
        this._rotation += 1;
        this._onRotateCallback(this.rotation, oldRotation);
    }

    TurnRight ()
    {
        const oldRotation = this.rotation;
        this._rotation -= 1;
        this._onRotateCallback(this.rotation, oldRotation);
    }
}