"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndofTransmissionBlock = 0x17;
var RoomName;
(function (RoomName) {
    RoomName[RoomName["Mountain"] = 0] = "Mountain";
    RoomName[RoomName["Field"] = 1] = "Field";
    RoomName[RoomName["Sky"] = 2] = "Sky";
    RoomName[RoomName["River"] = 3] = "River";
    RoomName[RoomName["Lobby"] = 4] = "Lobby";
})(RoomName = exports.RoomName || (exports.RoomName = {}));
;
var Animal;
(function (Animal) {
    Animal[Animal["Lion"] = 0] = "Lion";
    Animal[Animal["Alligator"] = 1] = "Alligator";
    Animal[Animal["Eagle"] = 2] = "Eagle";
    Animal[Animal["Hyena"] = 3] = "Hyena";
    Animal[Animal["Snake"] = 4] = "Snake";
    Animal[Animal["Chameleon"] = 5] = "Chameleon";
    Animal[Animal["Deer"] = 6] = "Deer";
    Animal[Animal["Otter"] = 7] = "Otter";
    Animal[Animal["Rabbit"] = 8] = "Rabbit";
    Animal[Animal["BronzeDuck"] = 9] = "BronzeDuck";
    Animal[Animal["Crow"] = 10] = "Crow";
    Animal[Animal["CrocodileBird"] = 11] = "CrocodileBird";
    Animal[Animal["Rat"] = 12] = "Rat";
})(Animal = exports.Animal || (exports.Animal = {}));
var Life;
(function (Life) {
    Life[Life["Alive"] = 0] = "Alive";
    Life[Life["Dead"] = 1] = "Dead";
})(Life = exports.Life || (exports.Life = {}));
;
var MsgType;
(function (MsgType) {
    MsgType[MsgType["Chat"] = 0] = "Chat";
    MsgType[MsgType["Attack"] = 1] = "Attack";
    MsgType[MsgType["Move"] = 2] = "Move";
    MsgType[MsgType["Camouflage"] = 3] = "Camouflage";
    MsgType[MsgType["Spy"] = 4] = "Spy";
    MsgType[MsgType["Predict"] = 5] = "Predict";
    MsgType[MsgType["AttackSucces"] = 6] = "AttackSucces";
    MsgType[MsgType["AttackFail"] = 7] = "AttackFail";
})(MsgType = exports.MsgType || (exports.MsgType = {}));
var AttackLevel;
(function (AttackLevel) {
    AttackLevel[AttackLevel["Lion"] = 0] = "Lion";
    AttackLevel[AttackLevel["Aligator"] = 1] = "Aligator";
    AttackLevel[AttackLevel["Eagle"] = 2] = "Eagle";
    AttackLevel[AttackLevel["Hyena"] = 3] = "Hyena";
    AttackLevel[AttackLevel["Possible"] = 4] = "Possible";
    AttackLevel[AttackLevel["Impossible"] = 5] = "Impossible";
    AttackLevel[AttackLevel["Reflect"] = 6] = "Reflect";
})(AttackLevel = exports.AttackLevel || (exports.AttackLevel = {}));
exports.RandomNames = [
    "익명1",
    "마구니",
    "기러기",
    "개소리",
    "노트북",
    "쇠똥구리",
    "황산벌",
    "이순신",
    "ㅇㄱㄹㅇ",
    "크리스피",
    "냉장고",
    "라노벨",
    "재수옴"
];
//# sourceMappingURL=Variables.js.map