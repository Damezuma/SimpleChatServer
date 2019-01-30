"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
const app_1 = require("./app");
class MoveMessage extends Message_1.Message {
    constructor(from, toGo) {
        super();
        super.msgType = app_1.MsgType.Move;
        this.placeFlag = new Buffer(1);
        //갈 장소에 따른 메세지 생성
        switch (toGo) {
            case 177: // 산
                this.msg = '`${Receiver.name}`님이 산으로 이동';
                this.placeFlag.writeUInt8(177, 0);
                break;
            case 178: // 강
                this.msg = '`${Receiver.name}`님이 강으로 이동';
                this.placeFlag.writeUInt8(178, 0);
                break;
            case 179: //하늘
                this.msg = '`${Receiver.name}`님이 하늘로 이동';
                this.placeFlag.writeUInt8(179, 0);
                break;
            case 180: //들
                this.msg = '`${Receiver.name}`님이 들로 이동';
                this.placeFlag.writeUInt8(180, 0);
                break;
        }
    }
    WriteToSocket(socket) {
        let ETB = new Buffer(1);
        ETB.writeUInt8(app_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message_1.Message.move, 0);
        socket.write(msgFlag);
        socket.write(this.placeFlag);
        console.log(this.placeFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
exports.MoveMessage = MoveMessage;
//# sourceMappingURL=MoveMessage.js.map