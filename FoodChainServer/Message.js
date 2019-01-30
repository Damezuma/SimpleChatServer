"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatMessage_1 = require("./ChatMessage");
const MoveMessage_1 = require("./MoveMessage");
const Zooho_1 = require("./Zooho");
class Message {
    getMsgType() {
        return this.msgType;
    }
    static Parse(line, from) {
        if (line.length == 0)
            return;
        var flag = line.readUInt8(0); // 가져온 메세지 한 문장 버퍼에서 첫번째 flag 바이트 해석
        let ENV = Zooho_1.ZooHo.Instance;
        switch (flag) {
            case this.chat:
                return new ChatMessage_1.ChatMessage(line.slice(1));
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
                    return new MoveMessage_1.MoveMessage(from, toGoPlace);
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
    get Room() {
        return this.room;
    }
}
Message.chat = 161;
Message.attack = 162;
Message.move = 163;
Message.camouflage = 164;
Message.spy = 165;
Message.predict = 166;
Message.attackSucces = 1621;
Message.attackFail = 1622;
Message.informRole = 167;
exports.Message = Message;
//# sourceMappingURL=Message.js.map