
export enum RoomType {
    EMPTY = "EMPTY",
    KEY = "KEY"
}

export class Map 
{
    rooms:Array<Array<RoomType>>;

    constructor (mapString:string) 
    {
        const strArr = mapString.trim().split(/\n/).map(line => {
            return line.trim().split('');
        });

        this.rooms = [];
        for (let z = 0; z < strArr.length; z++)
        {
            this.rooms[z] = [];
            for (let x = 0; x < strArr[z].length; x++)
            {
                if (strArr[z][x] === '#')
                {
                    this.rooms[z][x] = RoomType.EMPTY;
                } 
                else if (strArr[z][x] === '?')
                {
                    this.rooms[z][x] = RoomType.KEY;
                } else {
                    this.rooms[z][x] = null;
                }
            }
        }
    }

    public getRoom (z:number, x:number)
    {
        try {
            return this.rooms[z][x];
        } catch (e)
        {
            return null;
        }
    }

    public forEach (callback:(z:number, x:number, room:RoomType) => void)
    {
        for (let z = 0; z < this.rooms.length; z++)
        {
            for (let x = 0; x < this.rooms[z].length; x++)
            {
                callback(z, x, this.getRoom(z, x));
            }
        }
    }
}
