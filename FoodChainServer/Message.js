"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Variables_1 = require("./Variables");
const Zooho_1 = require("./Zooho");
const Variables_2 = require("./Variables");
class Message {
    getMsgType() {
        return this.msgType;
    }
    static Parse(line, from) {
        if (line.length == 0)
            return;
        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        let ENV = Zooho_1.ZooHo.Instance;
        switch (flag) {
            case this.chat:
                return new ChatMessage(line.slice(1));
            case this.attack:
                {
                    let roomNumber = 1;
                    let toAnimal = line.readUInt8(1);
                    let to;
                }
            case this.move:
                {
                    let toGoPlace = line.readUInt8(1);
                    let fromRoomState = from.roomState;
                    //로비룸에서 사용자 빼기
                    fromRoomState.exitTheRoom(from.uid);
                    //toGoPlace룸에 사용자 넣기 , modify from roomState 수정하기
                    switch (toGoPlace) {
                        case 177: // 산
                            ENV.MountainRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.MountainRoom;
                            break;
                        case 178: // 강
                            ENV.RiverRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.RiverRoom;
                            break;
                        case 179: //하늘
                            ENV.SkyRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.SkyRoom;
                            break;
                        case 180: //들
                            ENV.FieldRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.FieldRoom;
                            break;
                    }
                    //사용자에게 방이동 했다는 메세지 보내주기.
                    return new MoveMessage(from, toGoPlace);
                }
                break;
            case this.camouflage:
                break;
            case this.spy: {
                var name = line.slice(1).toString("utf-8");
                var re = ENV.Receivers.get(ENV.Names.get(name));
                break;
            }
            case this.predict:
                break;
        }
    }
    get Room() {
        return this.room;
    }
}
Message.chat = 161;
Message.attack = 162;
Message.move = 163;
Message.camouflage = 164;
Message.spy = 165;
Message.predict = 166;
Message.attackSucces = 1621;
Message.attackFail = 1622;
Message.informRole = 167;
Message.informName = 168;
Message.informAllName = 169;
exports.Message = Message;
class MoveMessage extends Message {
    constructor(from, toGo) {
        super();
        super.msgType = Variables_1.MsgType.Move;
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
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.move, 0);
        socket.write(msgFlag);
        socket.write(this.placeFlag);
        console.log(this.placeFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
class ChatMessage extends Message {
    constructor(line) {
        super();
        super.msgType = Variables_1.MsgType.Chat;
        this.msg = line.toString("utf-8");
    }
    WriteToSocket(socket) {
        let ETB = new Buffer(1);
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.chat, 0);
        socket.write(msgFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
class SpyMessage extends Message {
    constructor(msg) {
        super();
        super.msgType = Variables_1.MsgType.Spy;
        this.msg = msg;
    }
    WriteToSocket(socket) {
        let ETB = new Buffer(1);
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.spy, 0);
        socket.write(msgFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
class NameMessage extends Message {
    constructor(name) {
        super();
        this.name = name;
    }
    WriteToSocket(socket) {
        let names = Variables_2.RandomNames;
        let ETB = new Buffer(1);
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.informName, 0);
        socket.write(msgFlag);
        socket.write(this.name);
        socket.write(ETB);
    }
}
exports.NameMessage = NameMessage;
class AllNameMessage extends Message {
    constructor() {
        super();
    }
    WriteToSocket(socket) {
        let names = Variables_2.RandomNames;
        let ETB = new Buffer(1);
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.informAllName, 0);
        for (let name of names) {
            socket.write(msgFlag);
            socket.write(name);
            socket.write(ETB);
        }
    }
}
exports.AllNameMessage = AllNameMessage;
//# sourceMappingURL=Message.js.map