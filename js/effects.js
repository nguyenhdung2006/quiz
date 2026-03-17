function updateCombo(isCorrect){

let comboEl = document.getElementById("comboDisplay");

if(isCorrect){

combo++;

if(combo > maxCombo) maxCombo = combo;

comboEl.innerText = "🔥 Combo x" + combo;

/* ===== combo effects ===== */

if(combo === 3){
comboExplosion("Nice Combo!");
playSound("soundSmall");
}

if(combo === 5){
comboExplosion("Hot Streak!");
playSound("soundSmall");
}

if(combo === 10){
comboExplosion("UNSTOPPABLE!");
fireworks();
screenShake();
playSound("soundMedium");
}

if(combo === 20){
comboExplosion("GODLIKE!");
screenShake();
playSound("soundMedium");
}

if(combo === 30){
comboExplosion("LEGENDARY!");
screenShake();
playSound("soundMedium");
}

if(combo === 50){
comboExplosion("IMMORTAL!");
fireworks();
screenShake();
playSound("sound50");
}

if(combo === 100){
comboExplosion("COMBO MASTER!");
fireworks();
screenShake();
playSound("sound100");
}

}else{

combo = 0;

comboEl.innerText = "🔥 Combo x0";

}

}

function comboExplosion(text){

let div = document.createElement("div");

div.className = "comboPopup";

div.innerText = text;

document.body.appendChild(div);

setTimeout(()=>{
div.remove();
},1500);

}

function fireworks(){

for(let i=0;i<40;i++){

let p = document.createElement("div");

p.className = "particle";

p.style.background =
`hsl(${Math.random()*360},100%,60%)`;

p.style.left = window.innerWidth/2 + "px";
p.style.top = window.innerHeight/2 + "px";

let x = (Math.random()-0.5)*400;
let y = (Math.random()-0.5)*400;

p.style.setProperty("--x",x+"px");
p.style.setProperty("--y",y+"px");

document.body.appendChild(p);

setTimeout(()=>p.remove(),1000);

}

}

function screenShake(){

document.body.classList.add("shake");

setTimeout(()=>{
document.body.classList.remove("shake");
},400);

}

function playSound(id){

let s = document.getElementById(id);

s.currentTime = 0;

s.play();

}

function progressSpark(){

let rect = progress.getBoundingClientRect();

for(let i=0;i<4;i++){

let s = document.createElement("div");

s.className = "spark";

s.style.left = rect.right + "px";
s.style.top = rect.top + rect.height/2 + "px";

let x = (Math.random()-0.5)*30;
let y = (Math.random()-0.5)*30;

s.style.setProperty("--x",x+"px");
s.style.setProperty("--y",y+"px");

document.body.appendChild(s);

setTimeout(()=>s.remove(),600);

}

}