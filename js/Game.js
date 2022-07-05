import { Player } from "./Player.js";
class Game{
    constructor(){
        this.cards = {};
        this.activePlayer = 1;
        this.player1 = new Player('Player1');
        this.player2 = new Player('Player2');
        this.configCards = {
            'age1' : {
                'count' : 19,
                'cards' : {},
                'arrangement' : [6,5,4,3,2],
                'related' : {
                    0 : {
                        'related' : [],
                        'selected' : false,
                    },
                    1 : {
                        'related' : [],
                        'selected' : false,
                    },
                    2 : {
                        'related' : [0],
                        'selected' : false
                    },
                    3 : {
                        'related' : [0,1],
                        'selected' : false,
                    },
                    4 : {
                        'related' : [2],
                        'selected' : false
                    },
                    5 : {
                        'related' : [2],
                        'selected' : false,
                    },
                    6 : {
                        'related' : [2,3],
                        'selected' : false
                    },
                    7 : {
                        'related' : [3,4],
                        'selected' : false
                    },
                    8 : {
                        'related' : [4],
                        'selected' : false
                    },
                    9 : {
                        'related' : [5],
                        'selected' : false
                    },
                    10 : {
                        'related' : [5,6],
                        'selected' : false
                    },
                    11 : {
                        'related' : [6,7],
                        'selected' : false
                    },
                    12 : {
                        'related' : [7,8],
                        'selected' : false
                    },
                    13 : {
                        'related' : [8],
                        'selected' : false
                    },
                    14 : {
                        'related' : [9],
                        'selected' : false
                    },
                    15 : {
                        'related' : [9,10],
                        'selected' : false
                    },
                    16 : {
                        'related' : [10,11],
                        'selected' : false
                    },
                    17 : {
                        'related' : [11,12],
                        'selected' : false
                    },
                    18 : {
                        'related' : [12,13],
                        'selected' : false
                    },
                    19 : {
                        'related' : [13],
                        'selected' : false
                    }
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
            const config = this.configCards[age];
            config.cards = this.drawCards(this.cards.age1,20);
            this.generateCards(config);
        }
    }
    drawCards(set,max){
        const shuffled = set.sort(() => 0.5 - Math.random());
        return shuffled.slice(0,max);
    }

    generateCards(config){
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
                if((Object.values(config.related))[counter].related.length == 0){
                    card.classList.add('accessible');
                }
                counter--;

                card.addEventListener('click',()=>{
                    console.log(config.related);
                    const id = card.getAttribute('data-id');
                    const isAvailableCard = this.checkAvailableCard(id,config);
                    if(isAvailableCard){
                        console.log("mozna wybrac");
                        config.related[id].selected = true;
                    }else{
                        console.log('nie mozna wybrac');
                    }
                    // console.log(isAvailableCard);
                    // this.player1.checkMoney();
                    // this.activePlayer == 1 ? this.player1()
                })
            }
        }
    }

    checkAvailableCard(id,config){
        const related = config.related[id].related;
        let isAvailable = true;
        related.forEach(e=>{
            if(!config.related[e].selected) isAvailable = false;
        })
        return isAvailable;
        // console.log(cards);
        // for(let i=0;i<con)
    }
}

const newGame = new Game();
document.addEventListener('DOMContentLoaded',()=>{
    newGame.init();
})