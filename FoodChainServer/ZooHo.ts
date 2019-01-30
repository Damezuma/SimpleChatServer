import net = require("net");
import Socket = net.Socket;
import { Room } from "./Room";
import { Receiver } from "./Receiver";
import { RoomName, RandomNames } from "./Variables"

export class ZooHo {
    private static instance: ZooHo = new ZooHo();
    private fieldRoom: Room
    private mountainRoom: Room;
    private skyRoom: Room;
    private riverRoom: Room;
    private lobbyRoom: Room;
    private senders;
    private receivers;
    private randomNames: string[];
    private names: Map<string, number>;

    public static get Instance() {
        return ZooHo.instance;
    };

    public setNameMap(name: string, uid: number) {
        this.names.set(name, uid);
    };

    private constructor() {
        this.mountainRoom = new Room(RoomName.Mountain);
        this.skyRoom = new Room(RoomName.Sky);
        this.fieldRoom = new Room(RoomName.Field);
        this.riverRoom = new Room(RoomName.River);
        this.lobbyRoom = new Room(RoomName.Lobby);
        this.senders = new Map<number, Socket>();
        this.receivers = new Map<number, Receiver>();
        this.randomNames = RandomNames;
        this.names = new Map<string, number>();
    }

    public get FieldRoom() {
        return this.fieldRoom;
    }

    public get SkyRoom() {
        return this.skyRoom;
    }

    public get RiverRoom() {
        return this.riverRoom
    }

    public get LobbyRoom() {
        return this.lobbyRoom
    }

    public get MountainRoom() {
        return this.mountainRoom;
    }

    public get Senders() {
        return this.senders;
    }

    public get Receivers() {
        return this.receivers;
    }

    public get RandomNames() {

        let select = Math.floor(Math.random() * this.randomNames.length);
        let s = this.randomNames[select];
        this.randomNames = this.randomNames.filter((v, it) => it != select);

        return s;

        
    }
    public get Names(): Map<string, number> {
        return this.names;
    }
}
