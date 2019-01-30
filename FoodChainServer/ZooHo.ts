import net = require("net");
import Socket = net.Socket;
import { Room } from "./Room";
import { Receiver } from "./Receiver";
import { RoomName } from "./app"

export class ZooHo {
    private static instance: ZooHo = new ZooHo();
    private fieldRoom: Room
    private mountainRoom: Room;
    private skyRoom: Room;
    private riverRoom: Room;
    private lobbyRoom: Room;
    private senders;
    private receivers;


    public static get Instance() {
        return ZooHo.instance;
    };

    private constructor() {
        this.mountainRoom = new Room(RoomName.Mountain);
        this.skyRoom = new Room(RoomName.Sky);
        this.riverRoom = new Room(RoomName.River);
        this.lobbyRoom = new Room(RoomName.Lobby);
        this.senders = new Map<number, Socket>();
        this.receivers = new Map<number, Receiver>();
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
}
