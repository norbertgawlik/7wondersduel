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
                        'accessible' : true,
                    },
                    1 : {
                        'related' : [],
                        'selected' : false,
                        'accessible' : true,
                    },
                    2 : {
                        'related' : [0],
                        'selected' : false,
                        'accessible' : false,
                    },
                    3 : {
                        'related' : [0,1],
                        'selected' : false,
                        'accessible' : false,
                    },
                    4 : {
                        'related' : [1],
                        'selected' : false,
                        'accessible' : false,
                    },
                    5 : {
                        'related' : [2],
                        'selected' : false,
                        'accessible' : false,
                    },
                    6 : {
                        'related' : [2,3],
                        'selected' : false,
                        'accessible' : false,
                    },
                    7 : {
                        'related' : [3,4],
                        'selected' : false,
                        'accessible' : false,
                    },
                    8 : {
                        'related' : [4],
                        'selected' : false,
                        'accessible' : false,
                    },
                    9 : {
                        'related' : [5],
                        'selected' : false,
                        'accessible' : false,
                    },
                    10 : {
                        'related' : [5,6],
                        'selected' : false,
                        'accessible' : false,
                    },
                    11 : {
                        'related' : [6,7],
                        'selected' : false,
                        'accessible' : false
                    },
                    12 : {
                        'related' : [7,8],
                        'selected' : false,
                        'accessible' : false
                    },
                    13 : {
                        'related' : [8],
                        'selected' : false,
                        'accessible' : false
                    },
                    14 : {
                        'related' : [9],
                        'selected' : false,
                        'accessible' : false
                    },
                    15 : {
                        'related' : [9,10],
                        'selected' : false,
                        'accessible' : false
                    },
                    16 : {
                        'related' : [10,11],
                        'selected' : false,
                        'accessible' : false
                    },
                    17 : {
                        'related' : [11,12],
                        'selected' : false,
                        'accessible' : false
                    },
                    18 : {
                        'related' : [12,13],
                        'selected' : false,
                        'accessible' : false
                    },
                    19 : {
                        'related' : [13],
                        'selected' : false,
                        'accessible' : false
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
            this.generateCards(config,wrap);
        }
    }
    drawCards(set,max){
        const shuffled = set.sort(() => 0.5 - Math.random());
        return shuffled.slice(0,max);
    }

    generateCards(config,wrap){
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
                if((Object.values(config.related))[counter].accessible){
                    card.classList.add('accessible');
                }
                counter--;

                card.addEventListener('click',()=>{
                    const id = card.getAttribute('data-id');
                    const isAvailableCard = config.related[id].accessible;
                    if(isAvailableCard){
                        // config.related[id].accessible = false;
                        console.log(id);
                        console.log("mozna wybrac");
                        config.related[id].selected = true;
                        card.classList.add('selected');
                        this.updateAccessibleCards(wrap,config);
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
    updateAccessibleCards(wrap,_config){
        const cardsDom = [...wrap.querySelectorAll('.card')];
        // console.log(cardsDom);
        // console.log(_config);

        cardsDom.forEach(e=>{
            const id = e.getAttribute('data-id');
            const related = _config.related[id].related;
            let isAccessible = true;
            related.forEach(v=>{
                if(!_config.related[v].selected) isAccessible = false;
            })
            if(isAccessible){
                _config.related[id].accessible = true;
                e.classList.add('accessible');
            }

            // console.log(config[id]);
        })
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