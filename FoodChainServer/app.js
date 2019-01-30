"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const buffer_1 = require("buffer");
const Role_1 = require("./Role");
const Receiver_1 = require("./Receiver");
const Message_1 = require("./Message");
exports.EndofTransmissionBlock = 0x17;
var RoomName;
(function (RoomName) {
    RoomName[RoomName["Mountain"] = 0] = "Mountain";
    RoomName[RoomName["Field"] = 1] = "Field";
    RoomName[RoomName["Sky"] = 2] = "Sky";
    RoomName[RoomName["River"] = 3] = "River";
    RoomName[RoomName["Lobby"] = 4] = "Lobby";
})(RoomName = exports.RoomName || (exports.RoomName = {}));
;
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
})(Animal = exports.Animal || (exports.Animal = {}));
var Life;
(function (Life) {
    Life[Life["Alive"] = 0] = "Alive";
    Life[Life["Dead"] = 1] = "Dead";
})(Life = exports.Life || (exports.Life = {}));
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
})(MsgType = exports.MsgType || (exports.MsgType = {}));
var AttackLevel;
(function (AttackLevel) {
    AttackLevel[AttackLevel["Lion"] = 0] = "Lion";
    AttackLevel[AttackLevel["Aligator"] = 1] = "Aligator";
    AttackLevel[AttackLevel["Eagle"] = 2] = "Eagle";
    AttackLevel[AttackLevel["Hyena"] = 3] = "Hyena";
    AttackLevel[AttackLevel["Possible"] = 4] = "Possible";
    AttackLevel[AttackLevel["Impossible"] = 5] = "Impossible";
    AttackLevel[AttackLevel["Reflect"] = 6] = "Reflect";
})(AttackLevel = exports.AttackLevel || (exports.AttackLevel = {}));
function selectRole() {
    let animalList = [Animal.Lion, Animal.Alligator, Animal.BronzeDuck, Animal.Chameleon, Animal.CrocodileBird, Animal.Crow, Animal.Deer, Animal.Eagle,
        Animal.Hyena, Animal.Otter, Animal.Rabbit, Animal.Rat, Animal.Snake];
    for (let rv of receivers) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);
        rv["1"].role = new Role_1.Role(s);
        //전송
        let sk = senders.get(rv["0"]);
        let ETB = new buffer_1.Buffer(1);
        ETB.writeUInt8(exports.EndofTransmissionBlock, 0);
        let msgFlag = new buffer_1.Buffer(1);
        msgFlag.writeUInt8(Message_1.Message.informRole, 0);
        let animalFlag = new buffer_1.Buffer(1);
        animalFlag.writeUInt8(s, 0);
        sk.write(msgFlag);
        sk.write(animalFlag);
        sk.write(ETB);
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
            let receiver = new Receiver_1.Receiver(socket, index);
            receivers.set(index, receiver);
            if (receivers.size == 13) {
                console.log("13명이 모두 모임");
                selectRole();
            }
            else {
                console.log(receivers.size);
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