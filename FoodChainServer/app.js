"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const buffer_1 = require("buffer");
const EndofTransmissionBlock = 0x17;
var Animal;
(function (Animal) {
    Animal[Animal["Lion"] = 0] = "Lion";
    Animal[Animal["Alligator"] = 1] = "Alligator";
    Animal[Animal["Eagle"] = 2] = "Eagle";
    Animal[Animal["Hyena"] = 3] = "Hyena";
    Animal[Animal["Snake"] = 4] = "Snake";
    Animal[Animal["Chameleon"] = 5] = "Chameleon";
    Animal[Animal["Deer"] = 6] = "Deer";
    Animal[Animal["Otter"] = 7] = "Otter";
    Animal[Animal["Rabbit"] = 8] = "Rabbit";
    Animal[Animal["BronzeDuck"] = 9] = "BronzeDuck";
    Animal[Animal["Crow"] = 10] = "Crow";
    Animal[Animal["CrocodileBird"] = 11] = "CrocodileBird";
    Animal[Animal["Rat"] = 12] = "Rat";
})(Animal || (Animal = {}));
var Life;
(function (Life) {
    Life[Life["Alive"] = 0] = "Alive";
    Life[Life["Dead"] = 1] = "Dead";
})(Life || (Life = {}));
;
var MsgType;
(function (MsgType) {
    MsgType[MsgType["Chat"] = 0] = "Chat";
    MsgType[MsgType["Attack"] = 1] = "Attack";
    MsgType[MsgType["Move"] = 2] = "Move";
    MsgType[MsgType["Camouflage"] = 3] = "Camouflage";
    MsgType[MsgType["Spy"] = 4] = "Spy";
    MsgType[MsgType["Predict"] = 5] = "Predict";
    MsgType[MsgType["AttackSucces"] = 6] = "AttackSucces";
    MsgType[MsgType["AttackFail"] = 7] = "AttackFail";
})(MsgType || (MsgType = {}));
class Room {
    constructor() {
        this.sendersUid = [];
    }
    enterTheRoom(suid) {
        this.sendersUid.push(suid);
    }
    broadcastInRoom(msg) {
        for (let s of this.sendersUid) {
            msg.WriteToSocket(senders.get(s));
        }
    }
}
class Message {
    getMsgType() {
        return this.msgType;
    }
    static Parse(line, from) {
        if (line.length == 0)
            return;
        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        switch (flag) {
            case this.chat:
                return new ChatMessage(line.slice(1));
            case this.attack:
                {
                    let roomNumber = 1;
                    let toAnimal = line.readUInt8(1);
                    let to;
                    for (let i = 0; receivers.size; i++) {
                        if (receivers[i].role == toAnimal) {
                            to = receivers[i];
                        }
                    }
                    if (to != null)
                        return new attackMessage(roomNumber, from, to);
                }
            case this.move:
                {
                    let toGoPlace = line.readUInt8(1);
                    let fromRoomState = from.roomState;
                }
                break;
            case this.camouflage:
                break;
            case this.spy:
                break;
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
class ChatMessage extends Message {
    constructor(line) {
        super();
        super.msgType = MsgType.Chat;
        this.msg = line.toString("utf-8");
    }
    WriteToSocket(socket) {
        let ETB = new buffer_1.Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new buffer_1.Buffer(1);
        msgFlag.writeUInt8(Message.chat, 0);
        socket.write(msgFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
class moveMessage extends Message {
    constructor(room, line) {
        super();
        super.msgType = MsgType.Move;
        this.msg = line.toString("utf-8");
    }
    WriteToSocket(socket) {
        let ETB = new buffer_1.Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new buffer_1.Buffer(1);
        msgFlag.writeUInt8(Message.chat, 0);
        socket.write(msgFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
}
class attackMessage extends Message {
    constructor(room, from, to) {
        super();
        if (from.role < 4 && from.role < to.role) {
            //방에있는 사람에게 from이 to를 잡아먹었다고 전송
            //to의 roomState변경
            //to에게 죽었다고 전송.
        }
        else {
            console.log('아무일도 발생하지 않았습니다.');
        }
    }
    WriteToSocket(socket) {
        //구현해야 함
        let ETB = new buffer_1.Buffer(1);
        let msgFlag = new buffer_1.Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
    }
}
function selectRole() {
    let animalList = [Animal.Lion, Animal.Alligator, Animal.BronzeDuck, Animal.Chameleon, Animal.CrocodileBird, Animal.Crow, Animal.Deer, Animal.Eagle,
        Animal.Hyena, Animal.Otter, Animal.Rabbit, Animal.Rat, Animal.Snake];
    for (let i = 0; i < 13; i++) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);
        //receivers[i].role = select;
    }
}
class Receiver {
    constructor(socket, uid) {
        this.socket = socket;
        this.buffer = new buffer_1.Buffer(0);
        this.socket.on("data", (data) => this.PollMessage(data));
        this.roomState = lobbyRoom;
        lobbyRoom.enterTheRoom(uid);
        this.role = -1;
        this.state = Life.Alive;
    }
    /**
     * PollMessage
     */
    PollMessage(data) {
        let oldBuffer = this.buffer;
        if (oldBuffer.byteLength + data.byteLength > 4096) {
            this.buffer = buffer_1.Buffer.alloc(0, 0);
            return;
        }
        let newBuffer = new buffer_1.Buffer(oldBuffer.byteLength + data.byteLength);
        newBuffer.set(oldBuffer, 0);
        newBuffer.set(data, oldBuffer.byteLength);
        //var s =  data.
        //var s = data.toString("utf-8");
        let lastETBIndex = -1;
        let msgs = Array();
        for (let i = 0; i < newBuffer.byteLength; i++) {
            let ch = newBuffer.readUInt8(i);
            if (ch == EndofTransmissionBlock) {
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i), this));
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
                case MsgType.Chat: {
                    this.roomState.broadcastInRoom(msg);
                    break;
                }
                case MsgType.Move:
                    break;
            }
        }
    }
}
let last_index = 0;
let senders = new Map();
let receivers = new Map();
let fieldRoom = new Room();
let mountainRoom = new Room();
let lobbyRoom = new Room();
let server = net.createServer((socket) => {
    socket.on("data", (data) => {
        socket.removeAllListeners("data");
        let index = data.readInt32LE(0);
        if (index == 0) {
            last_index++;
            let bu = new buffer_1.Buffer(4);
            bu.writeInt32LE(last_index, 0);
            socket.write(bu);
            senders.set(last_index, socket);
            socket.on("close", () => {
                senders.delete(index);
            });
            socket.on("error", () => {
                senders.delete(index);
            });
            return;
        }
        if (senders.has(index) && !receivers.has(index)) {
            socket.write(data);
            let receiver = new Receiver(socket, index);
            receivers.set(index, receiver);
            if (receivers.size == 13) {
                console.log("13명이 모두 모임");
            }
            else {
                console.log("13명이 모자람");
                selectRole();
            }
            socket.on("close", () => {
                receivers.delete(index);
            });
            socket.on("error", () => {
                receivers.delete(index);
            });
        }
        else {
            socket.destroy();
        }
    });
});
server.listen(8080);
//# sourceMappingURL=app.js.map