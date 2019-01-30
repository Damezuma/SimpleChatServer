"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./Room");
const app_1 = require("./app");
class ZooHo {
    constructor() {
        this.mountainRoom = new Room_1.Room(app_1.RoomName.Mountain);
        this.skyRoom = new Room_1.Room(app_1.RoomName.Sky);
        this.riverRoom = new Room_1.Room(app_1.RoomName.River);
        this.lobbyRoom = new Room_1.Room(app_1.RoomName.Lobby);
        this.senders = new Map();
        this.receivers = new Map();
    }
    static get Instance() {
        return ZooHo.instance;
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
}
ZooHo.instance = new ZooHo();
exports.ZooHo = ZooHo;
//# sourceMappingURL=Zooho.js.map