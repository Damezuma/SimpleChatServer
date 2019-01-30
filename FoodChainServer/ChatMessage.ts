import net = require("net");
import Socket = net.Socket;
import { Message } from "./Message";
import { MsgType } from "./app";
import { EndofTransmissionBlock } from "./app";

export class ChatMessage extends Message {

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