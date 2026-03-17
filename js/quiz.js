function startQuiz() {
clearInterval(questionTimer);

progress.style.width = "0%";
combo = 0;
maxCombo = 0;

document.getElementById("comboDisplay").innerText = "🔥 Combo x0";

document.getElementById("timer").style.display = "none";
challengeDifficulty.classList.add("hidden");
quizDifficulty.classList.remove("hidden");

isPracticeMode = false;
isChallengeMode = false;

if(vocab.length < 4){
alert("You need at least 4 words to start a quiz!");
return;
}

if(vocab.length === 0){
alert("Please add some words first!");
return;
}

progress.style.transition = "none";
progress.style.width = "0%";
setTimeout(()=>{
progress.style.transition = "width .4s ease";
},50);

let num = quizDifficulty.value;
let mode = modeSelect.value;

if (num === "all") {

num = vocab.length;

} else {

num = Number(num);

}

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

let r = vocab[Math.floor(Math.random() * vocab.length)].vie;

if (!opts.includes(r)) opts.push(r);

}

} else {

let correct = q.eng;

opts = [correct];

while (opts.length < 4) {

let r = vocab[Math.floor(Math.random() * vocab.length)].eng;

if (!opts.includes(r)) opts.push(r);

}

}

opts = shuffle(opts);

quizData.push({
word: q,
mode: questionMode,
options: opts
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

function practiceWrong() {

    clearInterval(questionTimer);

    document.getElementById("timer").style.display = "none";

    isPracticeMode = true;
    isChallengeMode = false;

    if (wrongWords.length == 0) {
        alert("No wrong words yet!");
        return;
    }

    quiz = shuffle([...wrongWords]); // ✅ CHỈ GIỮ DÒNG NÀY

    quizData = [];

    quiz.forEach(q => {
        let questionMode = Math.random() < 0.5 ? "eng" : "vie";
        let opts = [];

        if (questionMode === "eng") {
            let correct = q.vie;
            opts = [correct];

            while (opts.length < 4) {
                let r = vocab[Math.floor(Math.random() * vocab.length)].vie;
                if (!opts.includes(r)) opts.push(r);
            }
        } else {
            let correct = q.eng;
            opts = [correct];

            while (opts.length < 4) {
                let r = vocab[Math.floor(Math.random() * vocab.length)].eng;
                if (!opts.includes(r)) opts.push(r);
            }
        }

        opts = shuffle(opts);

        quizData.push({
            word: q,
            mode: questionMode,
            options: opts
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

function loadQuestion() {
document.getElementById("timer").classList.remove("timerDanger");
clearTimeout(hintTimer);

selected = false;

hideHint();

startHintTimer();

let percent = (index / quizData.length) * 100;
progress.style.width = percent + "%";
progressSpark();

let data = quizData[index];
let q = data.word;

currentMode = data.mode;

let question;

if (currentMode === "eng") {

question = `What does "<span class="keyword" onclick="speak('${q.eng}')">${q.eng}</span>" mean?`;

} else {

question = `What is the English word for "<span class="keyword">${q.vie}</span>" ?`;

}

let opts = data.options;

let questionEl = document.getElementById("question");
let answersDiv = document.getElementById("answers");

questionEl.innerHTML =
`<div class="qNumber">Question ${index + 1}/${quizData.length}</div>` + question;

answersDiv.innerHTML = "";

opts.forEach((o, i) => {

let div = document.createElement("div");

div.className = "answer";
div.innerText = (i + 1) + ". " + o;

div.onclick = () => {

document.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));

div.classList.add("selected");

answers[index] = o;

selected = true;

};

if (answers[index] === o) {

div.classList.add("selected");

}

answersDiv.appendChild(div);

});

if (index === quizData.length - 1) {

submitBtn.style.display = "inline-block";
nextBtn.style.display = "none";

} else {

submitBtn.style.display = "none";
nextBtn.style.display = "inline-block";

}

if (index === 0) {

backBtn.style.display = "none";

} else {

backBtn.style.display = "inline-block";

}

if (autoSpeak) {

speak(q.eng);

}

if(isChallengeMode){
clearInterval(questionTimer); 
startQuestionTimer();
}

}

function checkAnswer() {

if (answered[index]) return;

let q = quizData[index].word;
let selectedAnswer = answers[index];

let correct;

if (currentMode === "eng") correct = q.vie;
else correct = q.eng;

if (selectedAnswer === correct) {

    correctCount++;
    updateCombo(true);

    if (isPracticeMode) {
        let word = wrongWords.find(w => w.eng === q.eng);
        if (word) {
            word.mastered = true;
            save();
        }
    }

} else {

    updateCombo(false);

    // giữ lại nhưng reset mastered
    wrongWords = wrongWords.filter(w => w.eng !== q.eng);

    wrongWords.push({
        ...q,
        mastered: false
    });

    save();
}

answered[index] = true;

// 🔥 luôn update UI
renderMistakeTable();

}

function submitAnswer() {

if (!answers[index]) {

showThinkHint("Hmm… choose one before moving on.");
return;

}

checkAnswer();

/* nếu là câu cuối */

if(index === quizData.length - 1){

progress.style.width = "100%";

setTimeout(()=>{

fireworks();
screenShake();

setTimeout(()=>{

finishQuiz();

},1200);

},600);

}

}

function finishQuiz() {

clearInterval(questionTimer);
quizScreen.classList.add("hidden");
resultScreen.classList.remove("hidden");

let wrong = quizData.length - correctCount;

rTotal.innerText = quizData.length;
rCorrect.innerText = correctCount + "/" + quizData.length;
rWrong.innerText = wrong;

let score10 = correctCount / quizData.length * 10;
score10 = Number(score10.toFixed(2));

score.innerText = score10 + " / 10";
score.style.color = "#e67e22";

let gradeText = "";
let commentText = "";
let commentColor = "";

if (score10 >= 9) {
gradeText = "A+";
commentText = "Outstanding work!";
commentColor = "#1f9d55";
}
else if (score10 >= 8.5) {
gradeText = "A";
commentText = "Excellent performance!";
commentColor = "#38c172";
}
else if (score10 >= 8) {
gradeText = "B+";
commentText = "Great job, keep going!";
commentColor = "#3490dc";
}
else if (score10 >= 7) {
gradeText = "B";
commentText = "Solid work!";
commentColor = "#6cb2eb";
}
else if (score10 >= 6.5) {
gradeText = "C+";
commentText = "You're improving!";
commentColor = "#f6c343";
}
else if (score10 >= 5.5) {
gradeText = "C";
commentText = "Good effort!";
commentColor = "#ff922b";
}
else if (score10 >= 5) {
gradeText = "D+";
commentText = "Keep practicing!";
commentColor = "#ff6b4a";
}
else if (score10 >= 4) {
gradeText = "D";
commentText = "Don't give up!";
commentColor = "#cc5c5c";
}
else {
gradeText = "F";
commentText = "Try again, you can do it!";
commentColor = "#e3342f";
}

grade.innerText = "Grade: " + gradeText;

comment.innerText = commentText;
comment.style.color = commentColor;
comment.classList.add("resultComment");

}

function nextQuestion() {

if (!answers[index]) {

showThinkHint("Hmm… choose one before moving on.");
return;

}

checkAnswer();

index++;

loadQuestion();

}

function prevQuestion() {

index--;

loadQuestion();

}