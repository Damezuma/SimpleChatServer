import { Animal } from "./app";
import { Life } from "./app";
import { AttackLevel } from "./app";
import { RoomName } from "./app";

import { Receiver } from "./Receiver";

export class Role {
    private role: Animal; // 역할
    private life: Life; // 생존여부
    private sneekT: number; //엿보기 횟수
    private hungerT: number; // 굶주림 횟수
    private attackLevel: AttackLevel;// 공격등급
    private residenceFlag: number;
    private residence: RoomName; //  주 거주지.
    private receiver: Receiver;
    //우승자 예상??
    //위장도 전역에서 처리해야할듯.

    public constructor(role: Animal) {
        this.receiver = null;

        console.log(role);


        //일단 살아있음
        this.life = Life.Alive;

        //엿보기회수 수정
        switch (role) {
            case Animal.Crow:
            case Animal.CrocodileBird:
            case Animal.Rat:
                this.sneekT = 2;
                break;
            default:
                this.sneekT = 1;
                break;
        }

        //굶주림 허용 횟수 --> 아무것도 안먹으면 굶주림 허용횟수 -1 만약에 뭘먹었다면 초기화(초기값)
        switch (role) {
            case Animal.Lion:
                this.hungerT = 0;
                break;
            case Animal.Alligator:
            case Animal.Eagle:
                this.hungerT = 1;
                break;
            case Animal.Hyena:
                this.hungerT = 2;
                break;
            default:
                this.hungerT = 100;
                break;
        }

        //공격등급 설정
        switch (role) {
            case Animal.Lion:
                this.attackLevel = AttackLevel.Lion;
                break;
            case Animal.Alligator:
                this.attackLevel = AttackLevel.Aligator;
                break;
            case Animal.Eagle:
                this.attackLevel = AttackLevel.Eagle;
                break;
            case Animal.Hyena:
                this.attackLevel = AttackLevel.Hyena;
                break;
            case Animal.Snake:
                this.attackLevel = AttackLevel.Reflect; // 물면 디짐
                break;
            default:
                this.attackLevel = AttackLevel.Possible; // 피식자
                break;
        }
        this.residenceFlag = 1; // 거주지가면 1로 초기화 딴데가면 1깍기.

        //거주지 설정
        switch (role) {
            case Animal.Eagle:
            case Animal.BronzeDuck:
            case Animal.Crow:
                this.residence = RoomName.Sky;
                break;
            case Animal.Alligator:
            case Animal.Otter:
            case Animal.CrocodileBird:
                this.residence = RoomName.River;
                break;
            case Animal.Lion:
            case Animal.Hyena:
            case Animal.Deer:
                this.residence = RoomName.Field;
                break;
            case Animal.Chameleon:
            case Animal.Snake:
            case Animal.Rabbit:
            case Animal.Rat:
                this.residence = RoomName.Mountain;
                break;

        }
    }
}