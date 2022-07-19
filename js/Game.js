import { Player } from "./Player.js";
class Game{
    constructor(){
        this.cards = {};
        this.activePlayer = 0;
        this.players = [];
        this.configCards = {};
    }

    init(){
        /* tu bedzie start gry: menu gry: imiona graczy itd */
        this.createPlayer('Player1');
        this.createPlayer('Player1');
        this.loadCards('js/cards.json');
    }

    createPlayer(name){
        const player = new Player(name);
        this.players.push(player);
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
                    card.setAttribute('data-id',counter);
                    if(showDetailsCard){
                        if((Object.values(config.related))[counter].accessible){
                            card.classList.add('accessible');
                            this.generateCardDetails(card,config,configCard,wrap,true);
                        }else{
                            this.generateCardDetails(card,config,configCard,wrap,false);
                        }
                    }else{
                        card.classList.add("hidden");
                    }
                    counter--;
                }else{
                    card.classList.add("emptyplace");
                }
                card.classList.add('card');
                row.appendChild(card);
            }
        }
    }

    generateCardDetails(card,config,configCard,wrap,showCost){
        // console.log(config);
        const head = document.createElement('div');
        card.classList.add(configCard.color);
        head.classList.add('card-head');
        card.appendChild(head);
        
        const effects_wrap = document.createElement('div');
        effects_wrap.classList.add('effects-wrap');
        head.appendChild(effects_wrap);

        /* effects */
        for(let [k,v] of Object.entries(configCard.effects)){
            const hasEffect = v > 0;
            const isSimpleEffect = k == "money" || k == "points";
            const maxSize = isSimpleEffect ? 1 : v;
            if(hasEffect){
                for(let i=0;i<maxSize;i++){
                    const effect = document.createElement('div');
                    effect.classList.add('effect');
                    effect.classList.add(k);
                    if(isSimpleEffect){
                        effect.innerHTML = v;
                    }
                    effects_wrap.appendChild(effect);
                }
            }
        }

        /* science */
        if(configCard.science_symbol.status){
            const science_symbol = document.createElement('div');
            science_symbol.classList.add('science-symbol');
            science_symbol.classList.add('effect')
            science_symbol.innerHTML = `s${configCard.science_symbol.id}`;
            effects_wrap.appendChild(science_symbol);
        }

        const inner = document.createElement('div');
        inner.classList.add('card-inner');
        card.appendChild(inner);

        const cost_wrap = document.createElement('div');
        cost_wrap.classList.add('cost-wrap');
        for(let [k,v] of Object.entries(configCard.cost)){
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

        /* symbol */
        if(configCard.free_symbol.status){
            const free_symbol = document.createElement('div');
            free_symbol.classList.add('free-symbol');
            free_symbol.innerHTML = `<span>s${configCard.free_symbol.id}</span>`;
            
            configCard.free_symbol.position == "top" ? effects_wrap.appendChild(free_symbol) : inner.appendChild(free_symbol);
        }

        const title = document.createElement('div');
        title.classList.add('card-title');
        title.innerHTML = `<span>${configCard.name}</span>`;
        inner.appendChild(title);

        /* cost info */
        const moneyInfoBar = document.createElement('div');
        moneyInfoBar.classList.add('money-info-bar');
        card.appendChild(moneyInfoBar);

        const buyInfo = document.createElement('div');
        buyInfo.classList.add('money-info');
        buyInfo.classList.add('buy');
        moneyInfoBar.appendChild(buyInfo);

        // const sellInfo = document.createElement('div');
        // sellInfo.classList.add('money-info');
        // sellInfo.classList.add('sell');
        // moneyInfoBar.appendChild(sellInfo);

        if(showCost) this.generateCardCost(card,configCard);
        this.generateCardMenu(card,config,configCard,wrap);
    }

    generateCardMenu(card,config,configCard,wrap){
        const cardMenu = document.createElement('div');
        cardMenu.classList.add('card-menu');
        
        const pick = document.createElement('div');
        pick.classList.add('btn');
        pick.classList.add('buy');
        pick.innerHTML = "BUY";

        const sell = document.createElement('div');
        sell.classList.add('btn');
        sell.classList.add('sell');
        sell.innerHTML = "SELL";

        cardMenu.appendChild(pick);
        cardMenu.appendChild(sell);
        card.appendChild(cardMenu);


        card.addEventListener('click',()=>{
            if(!cardMenu.classList.contains('active')){
                const cards = [...document.querySelectorAll('#cards-board .card .card-menu')];
                cards.forEach((e)=>{
                    e.classList.remove('active');
                })
            }
            cardMenu.classList.toggle('active');
        })

        this.pickCard(pick,card,config,configCard,wrap);
    }

    pickCard(target,card,config,configCard,wrap){
        target.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const isAvailableCard = config.related[id].accessible;
            const active_player = this.players[this.activePlayer];
            if(isAvailableCard){
                const {cost,isEnough} = this.checkCardCost(configCard,active_player);
                console.log(`cardcost: ${cost}`);
                console.log(`isEnough: ${isEnough}`);

                if(isEnough){
                    console.log('canbuy!');
                    /* player*/
                    active_player.addCard(configCard);
                    /* this.updatePlayerPowers() */
                    this.finishPlayerTour();

                    /* board */
                    config.related[id].selected = true;
                    card.classList.add('selected');
                    this.updateAccessibleCards(wrap,config);
                    this.renderPlayerCardsBoard(configCard);
                }else{
                    console.log("cant buy!");
                }
            }
        })
    }

    checkCardCost(configCard,player){
        let cost = 0,
            isEnough = false;

        for(let [k,v] of Object.entries(configCard.cost)){
            if(k == "money"){
                cost+=v;
            }else{
                if(v != 0){
                    /* czy gracz ma surowiec */
                    console.log(player);
                    const difference = player[k] - v;
                    if(difference < 0){
                        const notEnoughCount = difference * (-1);
                        const secondPlayerConfig = this.activePlayer == 0 ? this.players[1] : this.players[0];
                        const secondPlayerCount = secondPlayerConfig[k];
                        const playerHasDicount = player.discounts[k];
                        console.log("----");
                        console.log(player);
                        console.log(`not enough material ${k} in count: ${notEnoughCount}`);
                        console.log(`enemy has material count: ${secondPlayerCount}`);
                        console.log(`active player has material discount: ${playerHasDicount}`);
                        console.log("----");
                        if(playerHasDicount){
                            cost += notEnoughCount;
                        }else{
                            cost += (notEnoughCount*(2 + secondPlayerCount))
                        }
                    }
                }
            }
        }
        if(player.money >= cost) isEnough = true;
        return {isEnough,cost};
    }

    finishPlayerTour(){
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
                if(e.classList.contains('hidden')){
                    this.generateCardDetails(e,_config,_config.cards[id],wrap,true);
                    e.classList.remove('hidden');
                }

                if(!e.classList.contains('selected')) this.generateCardCost(e,_config.cards[id]);
            }

        })
    }

    checkAvailableCard(id,config){
        const related = config.related[id].related;
        let isAvailable = true;
        related.forEach(e=>{
            if(!config.related[e].selected) isAvailable = false;
        })
        return isAvailable;
    }

    generateCardCost(card,configCard){
        const active_player = this.players[this.activePlayer];
        const {cost,isEnough} = this.checkCardCost(configCard,active_player);
        
        const wrap = card.querySelector('.money-info-bar');
        const cost_wrap = wrap.querySelector('.buy');
        cost_wrap.innerHTML = `${cost}$`;
        cost_wrap.classList.add('canbuy');
        wrap.classList.add('loaded');
        // console.log(cost,isEnough);
    }

    renderPlayerCardsBoard(configCard){
        const board = document.querySelector(`.player-cards-board.player${this.activePlayer}`);
        const board_row = board.querySelector(`.${configCard.type}`);
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(configCard.color);
        board_row.appendChild(card);
    }
}

const newGame = new Game();
document.addEventListener('DOMContentLoaded',()=>{
    newGame.init();
})