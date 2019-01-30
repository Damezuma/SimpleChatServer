import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";

import { Role } from "./Role";
import { Receiver } from "./Receiver";
import { Message } from "./Message";
import { ZooHo } from "./ZooHo";
import { Animal, EndofTransmissionBlock } from "./Variables";

function selectRole() {
    let animalList = [Animal.Lion, Animal.Alligator, Animal.BronzeDuck, Animal.Chameleon, Animal.CrocodileBird, Animal.Crow, Animal.Deer, Animal.Eagle,
    Animal.Hyena, Animal.Otter, Animal.Rabbit, Animal.Rat, Animal.Snake];

    let ENV = ZooHo.Instance;

    for (let rv of ENV.Receivers) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);

        rv["1"].role = new Role(s);

        //전송
        let sk = ENV.Senders.get(rv["0"]);

        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.informRole, 0);
        let animalFlag = new Buffer(1);
        animalFlag.writeUInt8(s, 0);
        
        sk.write(msgFlag)
        sk.write(animalFlag);
        sk.write(ETB);
    }
}

let last_index = 0;

let server = net.createServer((socket) => {

    let ENV = ZooHo.Instance;
    socket.on("data", (data: Buffer) => {
        socket.removeAllListeners("data");
        let index: number = data.readInt32LE(0);
        if (index == 0) {
            last_index++;
            let bu = new Buffer(4);
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
            let receiver = new Receiver(socket,index);

            ENV.Receivers.set(index, receiver);

         

            if (ENV.Receivers.size == 13) {
                console.log("13명이 모두 모임");
                selectRole();
            } else {
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