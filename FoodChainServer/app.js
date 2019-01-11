"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const buffer_1 = require("buffer");
const EndofTransmissionBlock = 0x17;
class Receiver {
    constructor(socket) {
        this.socket = socket;
        this.buffer = new buffer_1.Buffer(0);
        this.socket.on("data", (data) => this.PollMessage(data));
    }
    /**
     * PollMessage
     */
    PollMessage(data) {
        let oldBuffer = this.buffer;
        if (oldBuffer.byteLength + data.byteLength > 4096) {
            this.buffer = buffer_1.Buffer.alloc(0, 0);
            return;
        }
        let newBuffer = new buffer_1.Buffer(oldBuffer.byteLength + data.byteLength);
        newBuffer.set(oldBuffer, 0);
        newBuffer.set(data, oldBuffer.byteLength);
        //var s =  data.
        //var s = data.toString("utf-8");
        let lastETBIndex = -1;
        let msgs = Array();
        let localFlag = 0x00;
        let roomState = 0x00;
        for (let i = 0; i < newBuffer.byteLength; i++) {
            let ch = newBuffer.readUInt8(i);
            if (ch == EndofTransmissionBlock) {
                localFlag = newBuffer.readUInt8(lastETBIndex + 1);
                roomState = newBuffer.readUInt8(lastETBIndex + 2);
                let s = newBuffer.toString("utf8", lastETBIndex + 3, i);
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
        let ETB = new buffer_1.Buffer(1);
        ETB.writeUInt8(EndofTransmissionBlock, 0);
        for (let msg of msgs) {
            for (let sender of senders.values()) {
                if (localFlag != 0x00) {
                    console.log(localFlag);
                    sender.write(localFlag);
                }
                if (roomState != 0x00) {
                    console.log(roomState);
                    sender.write(roomState);
                }
                sender.write(msg);
                sender.write(ETB);
            }
        }
    }
}
let last_index = 0;
let senders = new Map();
let receivers = new Map();
let server = net.createServer((socket) => {
    socket.on("data", (data) => {
        socket.removeAllListeners("data");
        let index = data.readInt32LE(0);
        if (index == 0) {
            last_index++;
            let bu = new buffer_1.Buffer(4);
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
//# sourceMappingURL=app.js.map