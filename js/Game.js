import { Player } from "./Player.js";
class Game{
    constructor(){
        this.cards = {};
        this.player1 = new Player("Gracz1");
        this.player2 = new Player("Gracz2");
        this.configCards = {
            'age1' : [2,3,4,5,6]
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
            console.log(config.length);
            for(let i=0;i<config.length;i++){
                const row = document.createElement('div');
                row.classList.add('row');
                row.classList.add('center');
                wrap.appendChild(row);
                for(let j=0;j<config[i];j++){
                    const card = document.createElement('div');
                    card.classList.add('card');

                    row.appendChild(card);

                    if(config[i][j] != 0){
                        console.log(cards[counterCards-1]);
                        card.setAttribute('data-cardboard-id',counterCards-1);
                        card.setAttribute('data-color',cards[counterCards-1].color);
                        card.setAttribute('data-type',cards[counterCards-1].type);
                        const name = document.createElement('span');
                        name.classList.add('name');
                        name.innerHTML = cards[counterCards-1].name;
                        card.appendChild(name);
                        counterCards--;
                    }
                }

            }
        }
    }
    drawCards(set,max){
        const shuffled = set.sort(() => 0.5 - Math.random());
        return shuffled.slice(0,max);
    }
}

const newGame = new Game();
document.addEventListener('DOMContentLoaded',()=>{
    newGame.init();
})


/* */
/* konfi kart talii */