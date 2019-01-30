import net = require("net");
import Socket = net.Socket;
import { MsgType, EndofTransmissionBlock } from "./Variables";

import { Receiver } from "./Receiver";
import { ZooHo } from "./Zooho";
import { RandomNames } from "./Variables";

export abstract class Message {
    public static readonly chat = 161;
    public static readonly attack = 162;
    public static readonly move = 163;
    public static readonly camouflage = 164;
    public static readonly spy = 165;
    public static readonly predict = 166;
    public static readonly attackSucces = 1621;
    public static readonly attackFail = 1622;
    public static readonly informRole = 167;
    public static readonly informName = 168;
    public static readonly informAllName = 169;

    protected msgType: MsgType;

    public getMsgType() {
        return this.msgType;
    }

    public static Parse(line: Buffer, from: Receiver): Message {
        if (line.length == 0)
            return;
        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석

        let ENV = ZooHo.Instance;
        switch (flag) {
            case this.chat:
                return new ChatMessage(line.slice(1));

            case this.attack:
                {
                    let roomNumber = 1;
                    let toAnimal = line.readUInt8(1);
                    let to;


                }
            case this.move:
                {
                    let toGoPlace = line.readUInt8(1);
                    let fromRoomState = from.roomState;

                    //로비룸에서 사용자 빼기
                    fromRoomState.exitTheRoom(from.uid);
                    //toGoPlace룸에 사용자 넣기 , modify from roomState 수정하기
                    switch (toGoPlace) {
                        case 177: // 산
                            ENV.MountainRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.MountainRoom;
                            break;
                        case 178: // 강
                            ENV.RiverRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.RiverRoom;
                            break;
                        case 179: //하늘
                            ENV.SkyRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.SkyRoom;
                            break;
                        case 180: //들
                            ENV.FieldRoom.enterTheRoom(from.uid);
                            from.roomState = ENV.FieldRoom;
                            break;
                    }
                    //사용자에게 방이동 했다는 메세지 보내주기.
                    return new MoveMessage(from, toGoPlace);

                }
                break;
            case this.camouflage:
                break;
            case this.spy: {
                var name = line.slice(1).toString("utf-8");
                var re = ENV.Receivers.get(ENV.Names.get(name));

                
                break;
            }
                
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

class MoveMessage extends Message {
    private msg;
    private placeFlag: Buffer;

    public constructor(from: Receiver, toGo: number) {
        super();
        super.msgType = MsgType.Move;
        this.placeFlag = new Buffer(1);
        //갈 장소에 따른 메세지 생성
        switch (toGo) {
            case 177: // 산
                this.msg = '`${Receiver.name}`님이 산으로 이동';
                this.placeFlag.writeUInt8(177, 0);
                break;
            case 178: // 강
                this.msg = '`${Receiver.name}`님이 강으로 이동';
                this.placeFlag.writeUInt8(178, 0);
                break;
            case 179: //하늘
                this.msg = '`${Receiver.name}`님이 하늘로 이동';
                this.placeFlag.writeUInt8(179, 0);
                break;
            case 180: //들
                this.msg = '`${Receiver.name}`님이 들로 이동';
                this.placeFlag.writeUInt8(180, 0);
                break;
        }

    }

    public WriteToSocket(socket: Socket) {

        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.move, 0);
        socket.write(msgFlag)
        socket.write(this.placeFlag);
        console.log(this.placeFlag);
        socket.write(this.msg);
        socket.write(ETB);
    }
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

class SpyMessage extends Message {

    private msg;

    public constructor(msg: string) {
        super();
        super.msgType = MsgType.Spy;
        this.msg = msg;
    }
    public WriteToSocket(socket: Socket) {

        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.spy, 0);
        socket.write(msgFlag)
        socket.write(this.msg);
        socket.write(ETB);
    }


}

export class NameMessage extends Message {
    private name : string;

    public constructor(name: string) {
        super();
        this.name = name;

    }

    public WriteToSocket(socket: Socket) {

        let names = RandomNames;
        
        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.informName, 0);
        
        socket.write(msgFlag);
        socket.write(this.name);
        socket.write(ETB);

    }
}

export class AllNameMessage extends Message {
    private names: string[];

    public constructor() {
        super();
    }

    public WriteToSocket(socket: Socket) {

        let names = RandomNames;

        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        let msgFlag = new Buffer(1);
        msgFlag.writeUInt8(Message.informAllName, 0);

        
        for (let name of names) {
            socket.write(msgFlag);
            socket.write(name);
            socket.write(ETB);
        }
        

    }
}