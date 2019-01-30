"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
const ZooHo_1 = require("./ZooHo");
const app_1 = require("./app");
class Receiver {
    constructor(socket, uid) {
        this.ENV = ZooHo_1.ZooHo.Instance;
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data) => this.PollMessage(data));
        this.roomState = this.ENV.LobbyRoom;
        this.uid = uid;
        this.name = "익명";
        this.ENV.LobbyRoom.enterTheRoom(uid);
        this.role = null;
        this.state = app_1.Life.Alive;
    }
    /**
     * PollMessage
     */
    PollMessage(data) {
        let oldBuffer = this.buffer;
        if (oldBuffer.byteLength + data.byteLength > 4096) {
            this.buffer = Buffer.alloc(0, 0);
            return;
        }
        let newBuffer = new Buffer(oldBuffer.byteLength + data.byteLength);
        newBuffer.set(oldBuffer, 0);
        newBuffer.set(data, oldBuffer.byteLength);
        //var s =  data.
        //var s = data.toString("utf-8");
        let lastETBIndex = -1;
        let msgs = Array();
        for (let i = 0; i < newBuffer.byteLength; i++) {
            let ch = newBuffer.readUInt8(i);
            if (ch == app_1.EndofTransmissionBlock) {
                msgs.push(Message_1.Message.Parse(newBuffer.slice(lastETBIndex + 1, i), this));
                lastETBIndex = i;
            }
        }
        if (lastETBIndex != -1) { //ETB 찾음
            this.buffer = newBuffer.slice(lastETBIndex + 1);
        }
        else {
            this.buffer = newBuffer;
        }
        for (let msg of msgs) {
            switch (msg.getMsgType()) {
                case app_1.MsgType.Chat: {
                    this.roomState.broadcastInRoom(msg);
                    break;
                }
                case app_1.MsgType.Move:
                    msg.WriteToSocket(this.ENV.Senders.get(this.uid));
                    break;
            }
        }
    }
}
exports.Receiver = Receiver;
//# sourceMappingURL=Receiver.js.map