import { Player } from "./Player.js";
class Game{
    constructor(){
        this.cards = {};
        this.activePlayer = 0;
        this.players = [new Player("Player1"),new Player("Player2")];
        this.configCards = {};
    }

    init(){
        this.loadCards('js/cards.json');
    }

    loadCards(cards){
        fetch(cards)
            .then((parse)=>parse.json())
            .then((json)=>{
                this.cards = json;
                this.loadConfig('js/cardsConfig.json');
            })
            .catch((e)=>console.log(e));
    }

    loadConfig(config){
        fetch(config)
        .then((parse)=>parse.json())
        .then((json)=>{
            this.configCards = json;
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
            const arrangement = config.arrangement[i].arrangement;
            for(let j=0;j<arrangement.length;j++){
                const configCard = config.cards[counter];
                const card = document.createElement('div');
                const showDetailsCard = config.arrangement[i].show;
                if(arrangement[j] == 1){
                    // card.innerHTML = `<span class="id">${counter}</span>`;
                    card.setAttribute('data-id',counter);
                    if(showDetailsCard){
                        this.generateCardDetails(card,configCard);
                        if((Object.values(config.related))[counter].accessible){
                            card.classList.add('accessible');
                        }
                    }else{
                        card.classList.add("hidden");
                    }
                    counter--;
                    this.pickCard(card,config,configCard,wrap);
                }else{
                    card.classList.add("emptyplace");
                }
                card.classList.add('card');
                row.appendChild(card);
            }
        }
    }

    generateCardDetails(card,config){
        const head = document.createElement('div');
        card.classList.add(config.color);
        head.classList.add('card-head');
        card.appendChild(head);
        
        const effects_wrap = document.createElement('div');
        effects_wrap.classList.add('effects-wrap');
        head.appendChild(effects_wrap);

        for(let [k,v] of Object.entries(config.effects)){
            const hasEffect = v > 0;
            const isSimpleEffect = k == "money" || k == "points";
            const maxSize = isSimpleEffect ? 1 : v;
            if(hasEffect){
                for(let i=0;i<maxSize;i++){
                    const effect = document.createElement('div');
                    effect.classList.add('effect');
                    effect.classList.add(k);
                    if(isSimpleEffect){
                        console.log(k,v);
                        effect.innerHTML = v;
                    }
                    effects_wrap.appendChild(effect);
                }
            }
        }
        console.log(config);

        const inner = document.createElement('div');
        inner.classList.add('card-inner');
        card.appendChild(inner);

        const cost_wrap = document.createElement('div');
        cost_wrap.classList.add('cost-wrap');
        for(let [k,v] of Object.entries(config.cost)){
            const hasCost = v > 0;
            const isMoneyCost = k == "money";
            const maxSize = isMoneyCost ? 1 : v;
            if(hasCost){
                for(let i=0;i<maxSize;i++){
                    const cost = document.createElement('div');
                    cost.classList.add('cost');
                    cost.classList.add(k);
                    if(isMoneyCost) cost.innerHTML = v;
                    cost_wrap.appendChild(cost);
                }
            }
        }

        inner.appendChild(cost_wrap);
        
        const title = document.createElement('div');
        title.classList.add('card-title');
        title.innerHTML = config.name;
        inner.appendChild(title);
    }

    pickCard(card,config,configCard,wrap){
        // console.log(card);
        card.addEventListener('click',()=>{
            const id = card.getAttribute('data-id');
            const isAvailableCard = config.related[id].accessible;
                if(isAvailableCard){
                    config.related[id].selected = true;
                    card.classList.add('selected');

                    this.updateAccessibleCards(wrap,config);
                    /* dodajemy karte do gracza */
                    // console.log(configCard);
                    this.players[this.activePlayer].addCard(configCard);
                    // console.log(this.players[this.activePlayer].cards);
                    /* aktualizujemy moce */

                    /* aktualizuemy plansze */
                    this.renderPlayerCardsBoard(configCard);
                        /* zmieniamy active player */
                    this.finishPlayerQueue();

                    }else{
                        console.log('nie mozna wybrac');
                    }
                    // console.log(isAvailableCard);
                    // this.player1.checkMoney();
                    // this.activePlayer == 1 ? this.player1()
                })
    }

    renderPlayerCardsBoard(cardConfig){
        const board = document.querySelector(`.player-cards-board.player${this.activePlayer}`);
        const board_row = board.querySelector(`.${cardConfig.type}`);
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(cardConfig.color);
        board_row.appendChild(card);
    }

    finishPlayerQueue(){
        this.activePlayer == 0 ? this.activePlayer = 1 : this.activePlayer = 0;
    }

    updateAccessibleCards(wrap,_config){
        const cardsDom = [...wrap.querySelectorAll('.card:not(.emptyplace)')];

        cardsDom.forEach( e => {
            const id = e.getAttribute('data-id');
            const related = _config.related[id].related;
            let isAccessible = true;
            related.forEach(v=>{
                if(!_config.related[v].selected) isAccessible = false;
            })
            if(isAccessible){
                _config.related[id].accessible = true;
                e.classList.add('accessible');
                e.classList.add(_config.cards[id].color);
                e.classList.remove('hidden');
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