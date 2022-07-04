import { Player } from "./Player.js";
class Game{
    constructor(){
        this.cards = {};
        this.configCards = {
            'age1' : {
                'count' : 20,
                'arrangement' : [6,5,4,3,2],
                'priority' : {
                    1 : [],
                    2 : [],
                    3 : [1],
                    4 : [1,2],
                    5 : [2],
                    6 : [3],
                    7 : [3,4],
                    8 : [4,5],
                    9 : [5],
                    10 : [6],
                    11 : [6,7],
                    12 : [7,8],
                    13 : [8,9],
                    14 : [9],
                    15 : [10],
                    16 : [10,11],
                    17 : [11,12],
                    18 : [12,13],
                    19 : [13,14],
                    20 : [14]
                }
            }
        }
    }

    init(){
        this.loadCards('js/cards.json');
    }

    loadCards(cards){
        fetch(cards)
            .then((parse)=>parse.json())
            .then((json)=>{
                this.cards = json;
                this.loadAge("age1");
            })
            .catch((e)=>console.log(e));
        }
    loadAge(age){
        const wrap = document.querySelector('#cards-board');
        if(age = "age1"){
            let counterCards = 20;
            const cards = this.drawCards(this.cards.age1,20);
            const config = this.configCards[age];
            console.log(cards);
            this.generateCards(cards,config);
        }
    }
    drawCards(set,max){
        const shuffled = set.sort(() => 0.5 - Math.random());
        return shuffled.slice(0,max);
    }

    generateCards(cards,config){
        const wrap = document.querySelector('#cards-board');
        let counter = config.count;
        for(let i=0;i<config.arrangement.length;i++){
            const row = document.createElement('div');
            row.classList.add('row');
            wrap.appendChild(row);
            for(let j=0;j<config.arrangement[i];j++){
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('data-id',counter);
                card.innerHTML = `<span class="id">${counter}</span>`
                row.appendChild(card);
                counter--;
            }
        }
    }
}

const newGame = new Game();
document.addEventListener('DOMContentLoaded',()=>{
    newGame.init();
})