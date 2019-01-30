"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(roomName) {
        this.sendersUid = [];
        this.roomName = roomName;
    }
    enterTheRoom(suid) {
        this.sendersUid.push(suid);
    }
    exitTheRoom(suid) {
        this.sendersUid.splice(this.sendersUid.indexOf(suid), 1);
    }
    broadcastInRoom(msg, senders) {
        for (let s of this.sendersUid) {
            msg.WriteToSocket(senders.get(s));
        }
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map