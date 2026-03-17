function startChallenge(time){
clearInterval(questionTimer); 
combo = 0;
maxCombo = 0;

document.getElementById("comboDisplay").innerText = "🔥 Combo x1";

document.getElementById("challengeMenu").classList.remove("show");

document.getElementById("timer").style.display = "block";

isChallengeMode = true;
questionTime = time;

if(vocab.length < 4){
alert("You need at least 4 words!");
return;
}

let num = vocab.length;
let mode = modeSelect.value;

quiz = shuffle([...vocab]).slice(0, num);

quizData = [];

quiz.forEach(q => {

let questionMode = mode;

if (mode === "mixed") {
questionMode = Math.random() < 0.5 ? "eng" : "vie";
}

let opts = [];

if (questionMode === "eng") {

let correct = q.vie;
opts = [correct];

while (opts.length < 4) {
let r = vocab[Math.floor(Math.random()*vocab.length)].vie;
if(!opts.includes(r)) opts.push(r);
}

}else{

let correct = q.eng;
opts=[correct];

while(opts.length<4){
let r=vocab[Math.floor(Math.random()*vocab.length)].eng;
if(!opts.includes(r)) opts.push(r);
}

}

opts = shuffle(opts);

quizData.push({
word:q,
mode:questionMode,
options:opts
});

});

index = 0;
answers = [];
answered = [];
correctCount = 0;

hideAllScreens();
quizScreen.classList.remove("hidden");

loadQuestion();

}