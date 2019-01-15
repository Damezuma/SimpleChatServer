"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const buffer_1 = require("buffer");
const EndofTransmissionBlock = 0x17;
var room;
(function (room) {
    room[room["lobby"] = 0] = "lobby";
    room[room["mountain"] = 1] = "mountain";
    room[room["sky"] = 2] = "sky";
    room[room["field"] = 3] = "field";
    room[room["river"] = 4] = "river";
    room[room["ghost"] = 5] = "ghost";
})(room || (room = {}));
;
var animal;
(function (animal) {
    animal[animal["lion"] = 0] = "lion";
    animal[animal["alligator"] = 1] = "alligator";
    animal[animal["eagle"] = 2] = "eagle";
    animal[animal["hyena"] = 3] = "hyena";
    animal[animal["snake"] = 4] = "snake";
    animal[animal["chameleon"] = 5] = "chameleon";
    animal[animal["deer"] = 6] = "deer";
    animal[animal["otter"] = 7] = "otter";
    animal[animal["rabbit"] = 8] = "rabbit";
    animal[animal["bronzeDuck"] = 9] = "bronzeDuck";
    animal[animal["crow"] = 10] = "crow";
    animal[animal["crocodileBird"] = 11] = "crocodileBird";
    animal[animal["rat"] = 12] = "rat";
})(animal || (animal = {}));
class lobbyRoom {
    constructor() {
        this.name = "lobby";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteSendersUid() {
        this.sendersUid = [];
    }
}
class mountainRoom {
    constructor() {
        this.name = "mountain";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteAllSendersUid() {
        this.sendersUid = [];
    }
}
class skyRoom {
    constructor() {
        this.name = "sky";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteAllSendersUid() {
        this.sendersUid = [];
    }
    deleteSenderUid(uid) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}
class fieldRoom {
    constructor() {
        this.name = "field";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteAllSendersUid() {
        this.sendersUid = [];
    }
    deleteSenderUid(uid) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}
class riverRoom {
    constructor() {
        this.name = "river";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteAllSendersUid() {
        this.sendersUid = [];
    }
    deleteSenderUid(uid) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}
class ghostRoom {
    constructor() {
        this.name = "ghost";
    }
    addSendersUid(uid) {
        this.sendersUid.push(uid);
    }
    deleteAllSendersUid() {
        this.sendersUid = [];
    }
    deleteSenderUid(uid) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}
class Message {
    constructor(room) {
        this.room = room;
    }
    static Parse(line) {
        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        let roomNumber = line.readUInt8(1);
        switch (flag) {
            case this.chat:
                return new ChatMessage(roomNumber, line.slice(2));
            case this.attack:
                break;
            case this.move:
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
class ChatMessage extends Message {
    constructor(room, line) {
        super(room);
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
class ActMessage extends Message {
    WriteToSocket(socket) {
        //구현해야 함
    }
}
function selectRole() {
    let animalList = [animal.lion, animal.alligator, animal.bronzeDuck, animal.chameleon, animal.crocodileBird, animal.crow, animal.deer, animal.eagle,
        animal.hyena, animal.otter, animal.rabbit, animal.rat, animal.snake];
    for (let i = 0; i < 13; i++) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);
        //receivers[i].role = select;
    }
}
class Receiver {
    constructor(socket) {
        this.socket = socket;
        this.buffer = new buffer_1.Buffer(0);
        this.socket.on("data", (data) => this.PollMessage(data));
        this.roomState = room.lobby;
        this.role = -1;
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
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i)));
                lastETBIndex = i;
            }
        }
        if (lastETBIndex != -1) {
            this.buffer = newBuffer.slice(lastETBIndex);
        }
        else {
            this.buffer = newBuffer;
        }
        for (let msg of msgs) {
            for (let sender of senders.values()) {
                msg.WriteToSocket(sender);
            }
        }
    }
}
let last_index = 0;
let senders = new Map();
let receivers = new Map();
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
            let receiver = new Receiver(socket);
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