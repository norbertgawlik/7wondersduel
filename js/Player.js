export class Player{
    constructor(name){
        this.name = name;
        this.money = 7;
        this.points = 0;
        this.strategy = 0;
        this.wood = 0;
        this.stone = 0;
        this.clay = 0;
        this.papyrus = 0;
        this.glass = 0;
        this.discounts = {
            "wood" : false,
            "stone" : false,
            "clay" : false,
            "glass" : false,
            "papyrus" : false
        }
        this.tokens = {
            "count" : 0,
            "agriculture" : false, /* 6$ + 4pkt */
            "architecture" : false, /* 2 surowce zignorowane przy bydowie cudów */
            "economy" : false, /* $ wydane na surowce trafiają do enemy */
            "law" : false, /* scientific symbol */
            "masonry" : false, /* 2 surowce zignorowane przy zakupie blue card*/
            "mathematics" : false, /* 3pkt za kazdy token */
            "philosophy" : false, /* 7pkt */
            "strategy" : false, /*kazda karta wojny +1 extra shield */
            "theology" : false, /* kazdy cud "play again" */
            "urbanism" : false, /* 6$ + 4$ za kazdy free build */
        }

        this.cards = [];
        this.science_symbol = [];
        this.free_symbol = [];

    }

    addCard(card){
        this.cards.push(card);
        return false;
    }
    
    checkMoney(){
        console.log(`${this.name} - ${this.money}`);
    }

}