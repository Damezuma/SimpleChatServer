"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./Room");
const Variables_1 = require("./Variables");
class ZooHo {
    constructor() {
        this.mountainRoom = new Room_1.Room(Variables_1.RoomName.Mountain);
        this.skyRoom = new Room_1.Room(Variables_1.RoomName.Sky);
        this.fieldRoom = new Room_1.Room(Variables_1.RoomName.Field);
        this.riverRoom = new Room_1.Room(Variables_1.RoomName.River);
        this.lobbyRoom = new Room_1.Room(Variables_1.RoomName.Lobby);
        this.senders = new Map();
        this.receivers = new Map();
        this.randomNames = Variables_1.RandomNames;
        this.names = new Map();
    }
    static get Instance() {
        return ZooHo.instance;
    }
    ;
    setNameMap(name, uid) {
        this.names.set(name, uid);
    }
    ;
    get FieldRoom() {
        return this.fieldRoom;
    }
    get SkyRoom() {
        return this.skyRoom;
    }
    get RiverRoom() {
        return this.riverRoom;
    }
    get LobbyRoom() {
        return this.lobbyRoom;
    }
    get MountainRoom() {
        return this.mountainRoom;
    }
    get Senders() {
        return this.senders;
    }
    get Receivers() {
        return this.receivers;
    }
    get RandomNames() {
        let select = Math.floor(Math.random() * this.randomNames.length);
        let s = this.randomNames[select];
        this.randomNames = this.randomNames.filter((v, it) => it != select);
        return s;
    }
    get Names() {
        return this.names;
    }
}
ZooHo.instance = new ZooHo();
exports.ZooHo = ZooHo;
//# sourceMappingURL=Zooho.js.map