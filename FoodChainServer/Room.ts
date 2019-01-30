import { Message } from "./Message";
import { RoomName } from "./app";
import { ZooHo } from "./ZooHo";

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
    public broadcastInRoom(msg: Message) {
        let ENV = ZooHo.Instance;

        for (let s of this.sendersUid) {
            msg.WriteToSocket(ENV.Senders.get(s));
        }
    }
}