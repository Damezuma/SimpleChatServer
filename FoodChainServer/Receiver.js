"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
const ZooHo_1 = require("./ZooHo");
const Variables_1 = require("./Variables");
class Receiver {
    constructor(socket, uid) {
        let ENV = ZooHo_1.ZooHo.Instance;
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data) => this.PollMessage(data));
        this.roomState = ENV.LobbyRoom;
        this.uid = uid;
        this.name = ENV.RandomNames;
        ENV.LobbyRoom.enterTheRoom(uid);
        this.role = null;
        this.state = Variables_1.Life.Alive;
        ENV.setNameMap(this.name, this.uid);
        let nameMsg = new Message_1.NameMessage(this.name);
        nameMsg.WriteToSocket(ENV.Senders.get(uid));
        let allNameMsg = new Message_1.AllNameMessage();
        allNameMsg.WriteToSocket(ENV.Senders.get(uid));
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
            if (ch == Variables_1.EndofTransmissionBlock) {
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
                case Variables_1.MsgType.Chat: {
                    this.roomState.broadcastInRoom(msg, this.ENV.Senders);
                    break;
                }
                case Variables_1.MsgType.Move:
                    msg.WriteToSocket(this.ENV.Senders.get(this.uid));
                    break;
            }
        }
    }
}
exports.Receiver = Receiver;
//# sourceMappingURL=Receiver.js.map