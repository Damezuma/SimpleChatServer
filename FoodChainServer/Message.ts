import net = require("net");
import Socket = net.Socket;
import { MsgType } from "./app";

import { ChatMessage } from "./ChatMessage";
import { MoveMessage } from "./MoveMessage";
import { Receiver } from "./Receiver";
import { ZooHo } from "./Zooho";

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
                    fromRoomState.enterTheRoom(from.uid);
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