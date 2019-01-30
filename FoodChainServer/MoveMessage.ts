import net = require("net");
import Socket = net.Socket;
import { Message } from "./Message";
import { Receiver } from "./Receiver";
import { MsgType, EndofTransmissionBlock } from "./app";

export class MoveMessage extends Message {
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