import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";
const EndofTransmissionBlock = 0x17;
enum room {
    lobby,
    mountain,
    sky,
    field,
    river,
    ghost
};

class lobbyRoom {
    public readonly name = "lobby";
    private sendersUid: number[];


    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteSendersUid() {
        this.sendersUid = [];
    }

}

class mountainRoom {
    public readonly name = "mountain";
    private sendersUid: number[];

    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteAllSendersUid() {
        this.sendersUid = [];
    }
}

class skyRoom {
    public readonly name = "sky";
    private sendersUid: number[];

    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteAllSendersUid() {
        this.sendersUid = [];
    }
    public deleteSenderUid(uid: number) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}

class fieldRoom {
    public readonly name = "field";
    private sendersUid: number[];

    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteAllSendersUid() {
        this.sendersUid = [];
    }
    public deleteSenderUid(uid: number) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}

class riverRoom {

    public readonly name = "river";
    private sendersUid: number[];

    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteAllSendersUid() {
        this.sendersUid = [];
    }
    public deleteSenderUid(uid: number) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}

class ghostRoom {
    public readonly name = "ghost";
    private sendersUid: number[];

    public addSendersUid(uid: number) {
        this.sendersUid.push(uid);
    }
    public deleteAllSendersUid() {
        this.sendersUid = [];
    }
    public deleteSenderUid(uid: number) {
        this.sendersUid.splice(this.sendersUid.indexOf(uid), 1);
    }
}

abstract class Message {
    private static readonly chat = 161;
    private static readonly attack = 162;
    private static readonly move = 163;
    private static readonly camouflage = 164;
    private static readonly spy = 165;
    private static readonly predict = 166;

    private static room;
    public constructor(room: number) {
        this.room = room;
    }
    public static Parse(line: Buffer): Message {

        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        let roomNumber = line.readUInt8(1);
    
        switch (flag) {
            case this.chat:
                return new ChatMessage(roomNumber,line.slice(2));
        
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
    private room: number;
    public get Room() {
        return this.room;
    }
    public abstract WriteToSocket(socket: Socket);
}
class ChatMessage extends Message {

    private msg;

    public constructor(room: number, line: Buffer) {
        super(room);
        this.msg = line.toString("utf-8");
    }
    public WriteToSocket(socket: Socket) {

        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);

        socket.write(this.msg);
        socket.write(ETB);
    }

    
}
class ActMessage extends Message {
    public WriteToSocket(socket: Socket) {
        //구현해야 함
    }
}

class Receiver {
    
    public constructor(socket: Socket) {
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data: Buffer) => this.PollMessage(data));
        
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
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i)));
                lastETBIndex = i;
            }
        }
        this.buffer = newBuffer.slice(lastETBIndex);
        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        for (let msg of msgs) {
            for (let sender of senders.values()) {
                msg.WriteToSocket(sender);
            }
        }
    }
    public buffer: Buffer;
    public socket: Socket;
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
            let receiver = new Receiver(socket);

            receivers.set(index, receiver);
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