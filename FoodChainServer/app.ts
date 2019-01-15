import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";
import { Readable } from "stream";
const EndofTransmissionBlock = 0x17;
enum room {
    lobby,
    mountain,
    sky,
    field,
    river,
    ghost
};

enum animal {
    lion,
    alligator,
    eagle,
    hyena,
    snake,
    chameleon,
    deer,
    otter,
    rabbit,
    bronzeDuck,
    crow,
    crocodileBird,
    rat
}

enum life {
    alive,
    dead
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
    protected static readonly chat = 161;
    protected static readonly attack = 162;
    protected static readonly move = 163;
    protected static readonly camouflage = 164;
    protected static readonly spy = 165;
    protected static readonly predict = 166;
    protected static readonly attackSucces = 1621;
    protected static readonly attackFail = 1622;

    private static room;
    public constructor(room: number) {
        this.room = room;
    }
    public static Parse(line: Buffer, from: Receiver): Message {

        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        let roomNumber = line.readUInt8(1);
    
        switch (flag) {
            case this.chat:
                return new ChatMessage(roomNumber,line.slice(2));
        
            case this.attack:
                let toAnimal = line.readUInt8(1);
                let to;
                for (let i = 0; receivers.size; i++) {
                    if (receivers[i].role == toAnimal) {
                        to = receivers[i];
                    }
                }
                if(to != null)
                    return new attackMessage(roomNumber,from,to);

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
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.chat, 0); 
        socket.write(msgFlag)
        socket.write(this.msg);
        socket.write(ETB);
    }

    
}
class attackMessage extends Message {

    private msg;

    public constructor(room: number, from: Receiver, to: Receiver) {
        super(room);
        if (from.role < 4 && from.role < to.role) {
            //방에있는 사람에게 from이 to를 잡아먹었다고 전송
            //to의 roomState변경
            //to에게 죽었다고 전송.
        } else {
            console.log('아무일도 발생하지 않았습니다.')
        }

        
    }

    public WriteToSocket(socket: Socket) {
        //구현해야 함
        let ETB = new Buffer(1);
        let msgFlag = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        msgFlag.writeUInt8(Message., 0); 
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
    
    public constructor(socket: Socket) {
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data: Buffer) => this.PollMessage(data));
        this.roomState = room.lobby;
        this.role = -1;
        this.state = life.alive;
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
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i),this));
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
            for (let entry of receivers.entries()) {
                let number = entry["0"];
                let rv = entry["1"];
                if (rv.roomState == this.roomState) {
                    msg.WriteToSocket(senders[number].Socket);
                }
            }
        }
    }
    public buffer: Buffer;
    public socket: Socket;
    public roomState: room;
    public role: animal;
    public state: life;
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

         

            if (receivers.size == 13) {
                console.log("13명이 모두 모임")
            } else {
                console.log("13명이 모자람")
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