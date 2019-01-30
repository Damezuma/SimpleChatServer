"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Variables_1 = require("./Variables");
class Role {
    //우승자 예상??
    //위장도 전역에서 처리해야할듯.
    constructor(role) {
        this.receiver = null;
        console.log(role);
        //일단 살아있음
        this.life = Variables_1.Life.Alive;
        //엿보기회수 수정
        switch (role) {
            case Variables_1.Animal.Crow:
            case Variables_1.Animal.CrocodileBird:
            case Variables_1.Animal.Rat:
                this.sneekT = 2;
                break;
            default:
                this.sneekT = 1;
                break;
        }
        //굶주림 허용 횟수 --> 아무것도 안먹으면 굶주림 허용횟수 -1 만약에 뭘먹었다면 초기화(초기값)
        switch (role) {
            case Variables_1.Animal.Lion:
                this.hungerT = 0;
                break;
            case Variables_1.Animal.Alligator:
            case Variables_1.Animal.Eagle:
                this.hungerT = 1;
                break;
            case Variables_1.Animal.Hyena:
                this.hungerT = 2;
                break;
            default:
                this.hungerT = 100;
                break;
        }
        //공격등급 설정
        switch (role) {
            case Variables_1.Animal.Lion:
                this.attackLevel = Variables_1.AttackLevel.Lion;
                break;
            case Variables_1.Animal.Alligator:
                this.attackLevel = Variables_1.AttackLevel.Aligator;
                break;
            case Variables_1.Animal.Eagle:
                this.attackLevel = Variables_1.AttackLevel.Eagle;
                break;
            case Variables_1.Animal.Hyena:
                this.attackLevel = Variables_1.AttackLevel.Hyena;
                break;
            case Variables_1.Animal.Snake:
                this.attackLevel = Variables_1.AttackLevel.Reflect; // 물면 디짐
                break;
            default:
                this.attackLevel = Variables_1.AttackLevel.Possible; // 피식자
                break;
        }
        this.residenceFlag = 1; // 거주지가면 1로 초기화 딴데가면 1깍기.
        //거주지 설정
        switch (role) {
            case Variables_1.Animal.Eagle:
            case Variables_1.Animal.BronzeDuck:
            case Variables_1.Animal.Crow:
                this.residence = Variables_1.RoomName.Sky;
                break;
            case Variables_1.Animal.Alligator:
            case Variables_1.Animal.Otter:
            case Variables_1.Animal.CrocodileBird:
                this.residence = Variables_1.RoomName.River;
                break;
            case Variables_1.Animal.Lion:
            case Variables_1.Animal.Hyena:
            case Variables_1.Animal.Deer:
                this.residence = Variables_1.RoomName.Field;
                break;
            case Variables_1.Animal.Chameleon:
            case Variables_1.Animal.Snake:
            case Variables_1.Animal.Rabbit:
            case Variables_1.Animal.Rat:
                this.residence = Variables_1.RoomName.Mountain;
                break;
        }
    }
}
exports.Role = Role;
//# sourceMappingURL=Role.js.map