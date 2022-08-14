export default class Board{
    constructor(){
    }

    generateBoard(playerName1,playerName2){
        console.log(playerName1);
        console.log("generujemy plansze");
        const wrap = document.querySelector('#board2');

        const leftBoard = document.createElement('div');
        leftBoard.classList.add('left-board');
        wrap.appendChild(leftBoard);

        const avatar1 = document.createElement('div');
        avatar1.classList.add('avatar-board');
        avatar1.classList.add('player1');
        avatar1.innerHTML = playerName1;
        leftBoard.appendChild(avatar1);

        const avatar2 = document.createElement('div');
        avatar2.classList.add('avatar-board');
        avatar2.classList.add('player2');
        avatar2.innerHTML = playerName2;
        leftBoard.appendChild(avatar2);

        const militaryBoard = document.createElement('div');
        militaryBoard.classList.add('military-board');
        leftBoard.appendChild(militaryBoard);

        for(let i=0;i<19;i++){
            const token = document.createElement('div');
            token.classList.add('token');
            const item = document.createElement('div');
            item.classList.add('item');
            token.appendChild(item);
            if(i==0 || i==18) item.innerHTML = '<img src="assets/images/military_win.png" width="14"/>'
            if(i==10){
                item.classList.add('active');
                item.classList.add('start');
            }
            militaryBoard.appendChild(token);
        }       
    }
}