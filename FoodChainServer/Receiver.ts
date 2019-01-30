import net = require("net");
import Socket = net.Socket;

import { Message, NameMessage, AllNameMessage } from "./Message";
import { Room } from "./Room";
import { Role } from "./Role";
import { ZooHo } from "./ZooHo";

import { Life, MsgType, EndofTransmissionBlock } from "./Variables";


export class Receiver {

    public constructor(socket: Socket, uid: number) {

        let ENV = ZooHo.Instance;

        
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data: Buffer) => this.PollMessage(data));
        this.roomState = ENV.LobbyRoom;
        this.uid = uid;
        this.name = ENV.RandomNames;
        ENV.LobbyRoom.enterTheRoom(uid);
        this.role = null;
        this.state = Life.Alive;

        ENV.setNameMap(this.name, this.uid);

        let nameMsg = new NameMessage(this.name);
        nameMsg.WriteToSocket(ENV.Senders.get(uid));
        
        let allNameMsg = new AllNameMessage();
        allNameMsg.WriteToSocket(ENV.Senders.get(uid));

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
                    this.roomState.broadcastInRoom(msg, this.ENV.Senders);
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
    public name: string;
    private ENV: ZooHo;
}