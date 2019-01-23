import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";
import { Readable } from "stream";
const EndofTransmissionBlock = 0x17;


enum Animal {
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

enum Life {
    Alive,
    Dead
};

enum MsgType {
    Chat,
    Attack,
    Move,
    Camouflage,
    Spy,
    Predict,
    AttackSucces,
    AttackFail

}

class Room {
    private sendersUid: number[];
    private roomName: string;

    public constructor() {
        this.sendersUid = [];
    }

    public enterTheRoom(suid: number) {
        this.sendersUid.push(suid);
    }
    public broadcastInRoom(msg: Message) {
        for (let s of this.sendersUid) {
            msg.WriteToSocket(senders.get(s));
        }
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

    protected msgType: MsgType;

    public getMsgType() {
        return this.msgType;
    }
   
    public static Parse(line: Buffer, from: Receiver): Message {
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
    private room: number;
    public get Room() {
        return this.room;
    }
    public abstract WriteToSocket(socket: Socket);
}
class ChatMessage extends Message {

    private msg;

    public constructor(line: Buffer) {
        super();
        super.msgType = MsgType.Chat;
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
class moveMessage extends Message {
    private msg;

    public constructor(room: number, line: Buffer) {
        super();
        super.msgType = MsgType.Move;
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
        super();
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
    
    public constructor(socket: Socket, uid: number) {
        this.socket = socket;
        this.buffer = new Buffer(0);
        this.socket.on("data", (data: Buffer) => this.PollMessage(data));
        this.roomState = lobbyRoom;
        lobbyRoom.enterTheRoom(uid);
        this.role = -1;
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
                msgs.push(Message.Parse(newBuffer.slice(lastETBIndex + 1, i),this));
                lastETBIndex = i;
            }
        }
        if (lastETBIndex != -1) {//ETB 찾음
            this.buffer = newBuffer.slice(lastETBIndex+1);
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

    public buffer: Buffer;
    public socket: Socket;
    public roomState: Room;
    public role: Animal;
    public state: Life;
}
let last_index = 0;
let senders = new Map<number, Socket>();
let receivers = new Map<number, Receiver>();
let fieldRoom = new Room();
let mountainRoom = new Room();
let lobbyRoom = new Room();

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