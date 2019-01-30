﻿import net = require("net");
import Socket = net.Socket;

import { Message } from "./Message";
import { Room } from "./Room";
import { Role } from "./Role";
import { ZooHo } from "./ZooHo";

import { Life, MsgType, EndofTransmissionBlock } from "./app";


export class Receiver {

    public constructor(socket: Socket, uid: number) {

        this.ENV = ZooHo.Instance;

        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data: Buffer) => this.PollMessage(data));
        this.roomState = this.ENV.LobbyRoom;
        this.uid = uid;
        this.name = "익명";
        this.ENV.LobbyRoom.enterTheRoom(uid);
        this.role = null;
        this.state = Life.Alive;
    }
    /**
     * PollMessage
     */
    public PollMessage(data: Buffer) {
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
        let msgs = Array<Message>();
        for (let i = 0; i < newBuffer.byteLength; i++) {
            let ch = newBuffer.readUInt8(i);
            if (ch == EndofTransmissionBlock) {
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i), this));
                lastETBIndex = i;
            }
        }
        if (lastETBIndex != -1) {//ETB 찾음
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
                    msg.WriteToSocket(this.ENV.Senders.get(this.uid));
                    break;

            }
        }
    }

    public buffer: Buffer;
    public socket: Socket;
    public roomState: Room;
    public role: Role;
    public state: Life;
    public uid: number;
    public name: String;
    private ENV: ZooHo;
}