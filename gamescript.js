const player=document.getElementById("player-hand");
const opponents=document.getElementById("opponent-hand");
const buttons=document.getElementById("buttons");
const table=document.getElementById("table");
let opponentlife,playerlife;
let playersum,opponentsum;
let playerpass=false,opponentpass=false;
let playerid=0,opponentid=0;
let arr=[];
function shuffle(){
    for(let i=arr.length-1;i>0;i--){
        const ind=Math.floor(Math.random()*(i+1));
        let temp=arr[ind];
        arr[ind]=arr[i];
        arr[i]=temp;
    }
}
function drawCard(){
    if(arr.length==0){
        let cardoverflow=document.getElementById("cardoverflow");
        if(cardoverflow==null)
            table.innerHTML+=`<div id="cardoverflow">
        YOU CAN'T DRAW MORE CARDS</div>`;
        return;
    }
    const playerscore=document.getElementById("player-board");
    const val=arr.pop();
    let card=`<div id="play${playerid}" class="anim" data-value="${val}">${val} </div>`;
    let temp=player.innerHTML.replace("anim","card");
    temp+=card;
    player.innerHTML=temp;
    playersum+=val;
    playerscore.innerHTML=playersum+"/21";
    playerid++;
}
function drawOpponentCard(){
    const opponentres=document.getElementById("opponentres");
    const TL=document.getElementById("TL");
    const CT=document.getElementById("CT");
    if(TL!=null){
        TL.remove();
    }
    if(CT!=null){
        CT.remove();
    }
    if(opponentid>1){
        opponentres.innerHTML+=`<div class="triangle-left" id="TL"></div>
        <div class="chat" id="CT">
            I DRAW!
        </div>`;
    }
    const opponentscore=document.getElementById("opponent-board");
    const val=arr.pop();
    let card=`<div id="opp${opponentid}" class="anim" data-value="${val}">${val} </div>`;
    let temp=opponents.innerHTML.replace("anim","card");
    temp+=card;
    opponents.innerHTML=temp;
    opponentsum+=val;
    if(opponentid==0)
        opponentscore.innerHTML="?/21";
    else{
        const opponentcardone=document.getElementById("opp0");
        opponentscore.innerHTML="?+"+(opponentsum-parseInt(opponentcardone.textContent.trim()))+"/21";
    }
    opponentid++;
}
function startgame(){
    arr=[1,2,3,4,5,6,7,8,9,10,11];
    shuffle();
    playerpass=false,opponentpass=false;
    playerid=0;opponentid=0;
    opponentlife=5;opponentsum=0;
    playerlife=5;playersum=0;
    table.innerHTML=`<div id="opplyf"></div>
    <div id="playlyf"></div>`;
    let boards=`<div id="player-board">${playersum}/21</div>`;
    boards+=`<div id="opponent-board">${opponentsum}/21</div>`;
    table.innerHTML+=boards;
    let temp=`<button id="get" onclick="getfunc()">GET</button>
    <button id="pass" onclick="passfunc()">PASS</button>`;
    buttons.innerHTML=temp;
    opponentheart();
    playerheart();
    drawOpponentCard();
    drawOpponentCard();
    drawCard();
    drawCard();
}
function opponentheart(){
    const tempopplyf=document.getElementById("opplyf");
    let temp="";
    for(let i=0;i<opponentlife;i++)
        temp+="💖";
    tempopplyf.innerHTML=temp;
}
function playerheart(){
    const tempplaylyf=document.getElementById("playlyf");
    let temp="";
    for(let i=0;i<playerlife;i++)
        temp+="💖";
    tempplaylyf.innerHTML=temp;
}
function getfunc(){
    drawCard();
    playerpass=false;
    opponentgetpass();
}
function passfunc(){
    playerpass=true;
    if(opponentpass){
        endround();
        return;
    }
    opponentgetpass();
}
function opponentgetpass(){
    let decision=opponentDecision();
    if(decision){
        setTimeout(drawOpponentCard,1000);
        opponentpass=false;
    }
    else{
        opponentpass=true;
        if(playerpass)
            endround();
    }
}
function endround(){
    let cardoverflow=document.getElementById("cardoverflow");
    if(cardoverflow!=null)
        cardoverflow.remove();
    let tempopp0=document.getElementById("opp0");
    tempopp0.style.color="black";
    const opponentscore=document.getElementById("opponent-board");
    let val=parseInt(tempopp0.textContent.trim());
    opponentscore.innerHTML=val+"+"+(opponentsum-val)+"/21";
    let temp="";
    let playerwin=false;
    if(playersum==opponentsum)
        temp=`<div id="messagetie">It is a tie</div>`;
    else if((playersum>opponentsum)&&(playersum<=21)){
        opponentlife--;
        playerwin=true;
        temp=`<div id="messagewon">You have won this round</div>`;
    }
    else if((playersum<opponentsum)&&(playersum>21||opponentsum>21)){
        opponentlife--;
        playerwin=true;
        temp=`<div id="messagewon">You have won this round</div>`;
    }
    else{
        playerlife--;
        temp=`<div id="messagelost">You have lost this round</div>`;
    }
    if(playerlife==0){
        temp=`<div id="messagelost">Game Over</div>`;
        temp+=`<button id="playagain" onclick="playagain()">PLAY AGAIN</button>`;
    }
    else if(opponentlife==0){
        temp=`<div id="messagewon">YOU WIN THE GAME</div>`;
        temp+=`<button id="playagain" onclick="playagain()">PLAY AGAIN</button>`;
    }
    else
        temp+=`<button id="newround" onclick="startround()">START NEW ROUND</button>`
    playerheart();
    opponentheart();
    table.innerHTML+=temp;
    buttons.innerHTML="";
}
function playagain(){
    table.innerHTML=`<button id="start" onclick="startgame()">
    START GAME</button>`;
    player.innerHTML="";
    opponents.innerHTML="";
}
function opponentDecision(){
    if(opponentsum>=21)
        return false;
    let score=21-opponentsum;
    boolarr=[];
    for(let i=0;i<11;i++)
        boolarr.push(false);
    for(let i=0;i<opponentid;i++){
        let tempplaycard=document.getElementById("opp"+i);
        let temp=tempplaycard.textContent.trim();
        let temp1=parseInt(temp);
        boolarr[temp1-1]=true;
    }
    for(let i=1;i<playerid;i++){
        let tempplaycard=document.getElementById("play"+i);
        let temp=tempplaycard.textContent.trim();
        let temp1=parseInt(temp);
        boolarr[temp1-1]=true;
    }
    let countfalse=0,countless=0;
    for(let i=0;i<11;i++){
        if(boolarr[i])
            continue;
        else
            countfalse++;
        if(i+1<=score)
            countless++;
    }
    let prob=0;
    if(countfalse!=0)
        prob=countless/parseFloat(countfalse);
    if(prob<0.5)
        return false;
    else
        return true;
}
function startround(){
    let tempopponentlife=opponentlife;
    let tempplayerlife=playerlife;
    table.innerHTML="";
    player.innerHTML="";
    opponents.innerHTML="";
    startgame();
    opponentlife=tempopponentlife;
    playerlife=tempplayerlife;
    playerheart();
    opponentheart();
}