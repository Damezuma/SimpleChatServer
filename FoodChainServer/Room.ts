import { Message } from "./Message";
import { RoomName } from "./Variables";
import net = require("net");
import Socket = net.Socket;


export class Room {
    private sendersUid: number[];
    private roomName: RoomName;

    public constructor(roomName: RoomName) {
        this.sendersUid = [];
        this.roomName = roomName;
    }

    public enterTheRoom(suid: number) {
        this.sendersUid.push(suid);
    }

    public exitTheRoom(suid: number) {
        this.sendersUid.splice(this.sendersUid.indexOf(suid), 1);
    }
    public broadcastInRoom(msg: Message, senders: Map<number, Socket>) {

        for (let s of this.sendersUid) {
            msg.WriteToSocket(senders.get(s));
        }
    }
}