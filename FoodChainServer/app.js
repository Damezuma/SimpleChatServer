"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const buffer_1 = require("buffer");
const Role_1 = require("./Role");
const Receiver_1 = require("./Receiver");
const Message_1 = require("./Message");
const ZooHo_1 = require("./ZooHo");
const Variables_1 = require("./Variables");
function selectRole() {
    let animalList = [Variables_1.Animal.Lion, Variables_1.Animal.Alligator, Variables_1.Animal.BronzeDuck, Variables_1.Animal.Chameleon, Variables_1.Animal.CrocodileBird, Variables_1.Animal.Crow, Variables_1.Animal.Deer, Variables_1.Animal.Eagle,
        Variables_1.Animal.Hyena, Variables_1.Animal.Otter, Variables_1.Animal.Rabbit, Variables_1.Animal.Rat, Variables_1.Animal.Snake];
    let ENV = ZooHo_1.ZooHo.Instance;
    for (let rv of ENV.Receivers) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);
        rv["1"].role = new Role_1.Role(s);
        //전송
        let sk = ENV.Senders.get(rv["0"]);
        let ETB = new buffer_1.Buffer(1);
        ETB.writeUInt8(Variables_1.EndofTransmissionBlock, 0);
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
let server = net.createServer((socket) => {
    let ENV = ZooHo_1.ZooHo.Instance;
    socket.on("data", (data) => {
        socket.removeAllListeners("data");
        let index = data.readInt32LE(0);
        if (index == 0) {
            last_index++;
            let bu = new buffer_1.Buffer(4);
            bu.writeInt32LE(last_index, 0);
            socket.write(bu);
            ENV.Senders.set(last_index, socket);
            socket.on("close", () => {
                ENV.Senders.delete(index);
            });
            socket.on("error", () => {
                ENV.Senders.delete(index);
            });
            return;
        }
        if (ENV.Senders.has(index) && !ENV.Receivers.has(index)) {
            socket.write(data);
            let receiver = new Receiver_1.Receiver(socket, index);
            ENV.Receivers.set(index, receiver);
            if (ENV.Receivers.size == 13) {
                console.log("13명이 모두 모임");
                selectRole();
            }
            else {
                console.log(ENV.Receivers.size);
            }
            socket.on("close", () => {
                ENV.Receivers.delete(index);
            });
            socket.on("error", () => {
                ENV.Receivers.delete(index);
            });
        }
        else {
            socket.destroy();
        }
    });
});
server.listen(8080);
//# sourceMappingURL=app.js.map