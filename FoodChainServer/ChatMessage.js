"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
const app_1 = require("./app");
const app_2 = require("./app");
class ChatMessage extends Message_1.Message {
    constructor(line) {
        super();
        super.msgType = app_1.MsgType.Chat;
        this.msg = line.toString("utf-8");
    }
    WriteToSocket(socket) {
        let ETB = new Buffer(1);
        ETB.writeUInt8(app_2.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message_1.Message.chat, 0);
        socket.write(msgFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=ChatMessage.js.map