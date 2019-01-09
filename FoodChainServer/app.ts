import net = require("net");
import Socket = net.Socket;
import { Buffer } from "buffer";
const EndofTransmissionBlock = 0x17;
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
        let msgs = Array<string>();
        for (let i = 0; i < newBuffer.byteLength; i++) {
            let ch = newBuffer.readUInt8(i);
            if (ch == EndofTransmissionBlock) {
                let s = newBuffer.toString("utf8", lastETBIndex + 1, i);
                msgs.push(s);
                lastETBIndex = i;
            }
        }
        if (lastETBIndex != -1) {
            this.buffer = newBuffer.slice(lastETBIndex);
        }
        else {
            this.buffer = newBuffer;
        }
        let ETB = new Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        for (let msg of msgs) {
            for (let sender of senders.values()) {
                sender.write(msg);
                sender.write(ETB);
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