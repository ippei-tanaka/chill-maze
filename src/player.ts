import { Map, RoomType } from "./map";

type OnMoveCallback = (newZ:number, newX:number, oldZ:number, oldX:number) => void;
type OnRotateCallback = (newRotation:number, oldRotation:number) => void;
type OnGetKeyCallback = (z:number, x:number) => void;
type OnGetChestCallback = (z:number, x:number) => void;

export class Player 
{
    private _z = 0;
    private _x = 0;
    private _rotation = 0;
    public onMove:OnMoveCallback = () => {};
    public onRotate:OnRotateCallback = () => {};
    public onGetKey:OnGetKeyCallback = () => {};
    public onGetChest:OnGetChestCallback = () => {};
    private _map:Map;
    private _hasKey:boolean = false;

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

        if (oldZ !== this.z || oldX !== this.x) {
            this.onMove(this.z, this.x, oldZ, oldX);
            this._CheckOutRoom();
        }
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

        if (oldZ !== this.z || oldX !== this.x) {
            this.onMove(this.z, this.x, oldZ, oldX);
            this._CheckOutRoom();
        }
    }

    TurnLeft ()
    {
        const oldRotation = this.rotation;
        this._rotation += 1;
        this.onRotate(this.rotation, oldRotation);
    }

    TurnRight ()
    {
        const oldRotation = this.rotation;
        this._rotation -= 1;
        this.onRotate(this.rotation, oldRotation);
    }

    private _CheckOutRoom ()
    {
        const room = this._map.getRoom(this.z, this.x);
        if (room === RoomType.KEY)
        {
            this.onGetKey(this.z, this.x);
            this._map.setRoom(this.z, this.x, RoomType.EMPTY);
            this._hasKey = true;
        } else if (this._hasKey && room === RoomType.CHEST)
        {
            this.onGetChest(this.z, this.x);
        }
    }
}