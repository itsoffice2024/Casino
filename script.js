const txtbet = document.querySelector('#bet');
const elwin = document.querySelector('#el-win');
const txtwin = document.querySelector('#win');
const elmoney = document.querySelector('#el-money');
const txtmoney = document.querySelector('#money');
const elgame = document.querySelector('#game-area');
const btnbet = document.querySelector('#btn-bet');
const btnspin = document.querySelector('#btn-spin');
const btnputmn = document.querySelector('#btn-putmoney');
///////////////////////////////////////////////////////////////////////
let money = 0;
let bet = 1;
let betstep = 0;
const betarr = [1,3,5,10,20,30,50,100,200,500,1000];
const arr = ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🥭','🥝'];
//const arr = ['🍏','🍎','🍐','🍊'];
function getItem(i){
    return arr[i];
}
///////////////////////////////////////////////////////////
const cols = document.querySelectorAll('.column');
const col1 = cols[0];
const col2 = cols[1];
const col3 = cols[2];
const col4 = cols[3];
const col5 = cols[4];
//////////////////////////////////////////////////////////
btnputmn.addEventListener('click',()=>{
    if(money == 0){
        money = 1000;
        elmoney.classList.remove('col-red');
        startGame();
    }
},false);
//////////////////////////////////////////////////////////
function startGame(){
    ///////////////////////////////////////////////////////////
    function showMoney(){
        elwin.style.display = 'none';
        elmoney.style.display = '';
        txtmoney.innerHTML = money;
    }
    showMoney();
    function showWin(w){
        elmoney.style.display = 'none';
        elwin.style.display = '';
        txtwin.innerHTML = w;
        setTimeout(()=>{
            showMoney();
            enableBtns();
        }, 2000);
    }
    ///////////////////////////////////////////////////////////
    var audioCash = new Audio('media/cash.mp3');
    var audioClick = new Audio('media/click.mp3');
    var audioSpin = new Audio('media/spin.mp3');
    var audioWin = new Audio('media/win.mp3');
    var audioOver = new Audio('media/over.mp3');
    audioCash.play();
    // Change Bet
    function setBet(){
        audioClick.play();
        betstep++;
        if(betstep < betarr.length){
            bet = betarr[betstep];
        }else{
            betstep = 0;
            bet = betarr[betstep];
        }
        txtbet.innerHTML = bet;
        elmoney.classList.remove('col-red');
    }
    btnbet.addEventListener('click',setBet,false);
    //////////////////////////////////////////////////////////
    // Create Items
    function getRandomInt(){
        var max = arr.length;
        return Math.floor(Math.random()*max);
    }
    function addItems(el,n){
        for(var i=0;i<n;i++){
            var ind = getRandomInt();
            var d = document.createElement('div');
            d.setAttribute('data-ind',ind);
            d.innerHTML = `<i>${getItem(ind)}</i>`;
            el.prepend(d);
        }
    }
    function getColumns(){
        addItems(col1,10);
        addItems(col2,20);
        addItems(col3,30);
        addItems(col4,40);
        addItems(col5,50);
    }
    /////////////////////////////////////////////////////////
    // Get first items
    function getStartItems(){
        for(const c of cols){
            addItems(c,3);
        }
    }
    getStartItems();
    /////////////////////////////////////////////////////////
    // Check Money
    function checkMoney(){
        if(money > 0 && money >= bet){
            return true;
        }else if(money > 0 && money < bet){
            elmoney.classList.add('col-red');
            audioOver.play();
            return false;
        }else{
            elmoney.classList.add('col-red');
            audioOver.play();
            return false;
        }
    }
    /////////////////////////////////////////////////////////
    // Disabled buttons
    function disableBtns(){
        btnbet.setAttribute('disabled','1');
        btnspin.setAttribute('disabled','1');
    }
    // Enabled buttons
    function enableBtns(){
        btnbet.removeAttribute('disabled');
        btnspin.removeAttribute('disabled');
    }
    // Spin
    function Spin(){
        var check = checkMoney();
        if(check){
            audioSpin.play();
            money = money - bet;
            showMoney();
            disableBtns();
            getColumns();
            var tr = 1;
            for(const c of cols){
                c.style.transition = `${tr}s ease-out`;
                var n = c.querySelectorAll('div').length;
                var b = (n - 3)*160;
                c.style.bottom = `-${b}px`;
                tr = tr+0.5;
            }
            col5.ontransitionend = ()=>{
                checkWin();
                for(const c of cols){
                    var ditm = c.querySelectorAll('div');
                    for(var i=0;i<ditm.length;i++){
                        if(i>=3){
                            ditm[i].remove();
                        }
                    }
                    c.style.transition = '0s';
                    c.style.bottom = '0px';
                }
            }
        }
    }
    btnspin.addEventListener('click',Spin,false);
    /////////////////////////////////////////////////////////
    // Check Win
    function checkWin(){
        var arrLine1 = [];
        var arrLine2 = [];
        var arrLine3 = [];
        for(const c of cols){
            var l1 = Number(c.querySelectorAll('div')[0].dataset.ind);
            var l2 = Number(c.querySelectorAll('div')[1].dataset.ind);
            var l3 = Number(c.querySelectorAll('div')[2].dataset.ind);
            arrLine1.push(l1);
            arrLine2.push(l2);
            arrLine3.push(l3);
        }
        function copiesArr(arr, copies) {
            let map = new Map();
            for (let elem of arr) {
                let counter = map.get(elem);
                map.set(elem, counter ? counter + 1 : 1);
            }
            let res = [];
            for (let [elem, counter] of map.entries())
                if (counter >= copies)
                    res.push(elem+':'+counter);
            return res;
        }
        var arrC1 = copiesArr(arrLine1, 3);
        var arrC2 = copiesArr(arrLine2, 3);
        var arrC3 = copiesArr(arrLine3, 3);
        ///
        function getCountCopies(arr){
            var str = arr[0];
            return Number(str.split(':')[1]);
        }
        function setBG(arr,row){
            var str = arr[0];
            var ind = str.split(':')[0];
            var cnt = Number(str.split(':')[1]);
            for(const c of cols){
                var bitem = c.querySelectorAll('div')[row];
                if(bitem.dataset.ind == ind){
                    bitem.classList.add('bg');
                }
            }
        }
        ///
        var stopspin = false;
        var resL1 = 0;
        var resL2 = 0;
        var resL3 = 0;
        if(arrC1.length > 0){
            stopspin = true;
            var cnt = getCountCopies(arrC1);
            setBG(arrC1,0);
            if(cnt == 3) resL1 = 2*bet;
            if(cnt == 4) resL1 = 5*bet;
            if(cnt == 5) resL1 = 1000*bet;
        }
        if(arrC2.length > 0){
            stopspin = true;
            var cnt = getCountCopies(arrC2);
            setBG(arrC2,1);
            if(cnt == 3) resL2 = 100*bet;
            if(cnt == 4) resL2 = 1000*bet;
            if(cnt == 5) resL2 = 100000*bet;
        }
        if(arrC3.length > 0){
            stopspin = true;
            var cnt = getCountCopies(arrC3);
            setBG(arrC3,2);
            if(cnt == 3) resL3 = 2*bet;
            if(cnt == 4) resL3 = 5*bet;
            if(cnt == 5) resL3 = 1000*bet;
        }
        //
        if(stopspin){
            audioWin.play();
            var win = resL1+resL2+resL3;
            showWin(win);
            money = money + win;
        }else{
            enableBtns();
        }
    }
}