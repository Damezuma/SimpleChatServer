"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZooHo_1 = require("./ZooHo");
class Room {
    constructor(roomName) {
        this.sendersUid = [];
        this.roomName = roomName;
    }
    enterTheRoom(suid) {
        this.sendersUid.push(suid);
    }
    broadcastInRoom(msg) {
        let ENV = ZooHo_1.ZooHo.Instance;
        for (let s of this.sendersUid) {
            msg.WriteToSocket(ENV.Senders.get(s));
        }
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map