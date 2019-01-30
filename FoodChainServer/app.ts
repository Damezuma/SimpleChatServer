import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";

import { Role } from "./Role";
import { Receiver } from "./Receiver";

import { Message } from "./Message";
export const EndofTransmissionBlock = 0x17;

export enum RoomName {
    Mountain,
    Field,
    Sky,
    River,
    Lobby
};

export enum Animal {
    Lion,
    Alligator,
    Eagle,
    Hyena,
    Snake,
    Chameleon,
    Deer,
    Otter,
    Rabbit,
    BronzeDuck,
    Crow,
    CrocodileBird,
    Rat
}

export enum Life {
    Alive,
    Dead
};

export enum MsgType {
    Chat,
    Attack,
    Move,
    Camouflage,
    Spy,
    Predict,
    AttackSucces,
    AttackFail

}

export enum AttackLevel {
    Lion,
    Aligator,
    Eagle,
    Hyena,
    Possible,
    Impossible,
    Reflect,

}

function selectRole() {
    let animalList = [Animal.Lion, Animal.Alligator, Animal.BronzeDuck, Animal.Chameleon, Animal.CrocodileBird, Animal.Crow, Animal.Deer, Animal.Eagle,
    Animal.Hyena, Animal.Otter, Animal.Rabbit, Animal.Rat, Animal.Snake];

    for (let rv of receivers) {
        let select = Math.floor(Math.random() * animalList.length);
        let s = animalList[select];
        animalList = animalList.filter((v, it) => it != select);
        console.log(s);

        rv["1"].role = new Role(s);

        //전송
        let sk = senders.get(rv["0"]);

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
let senders = new Map<number, Socket>();
let receivers = new Map<number, Receiver>();


let server = net.createServer((socket) => {
    
    socket.on("data", (data: Buffer) => {
        socket.removeAllListeners("data");
        let index: number = data.readInt32LE(0);
        if (index == 0) {
            last_index++;
            let bu = new Buffer(4);
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
            let receiver = new Receiver(socket,index);

            receivers.set(index, receiver);

         

            if (receivers.size == 13) {
                console.log("13명이 모두 모임");
                selectRole();
            } else {
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