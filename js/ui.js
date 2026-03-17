function speak(word) {

speechSynthesis.cancel();

let u = new SpeechSynthesisUtterance(word);

u.lang = "en-US";

speechSynthesis.speak(u);

}

function goHome() {

location.reload();

}

/* NEW */

function updateDifficulty() {

let total = vocab.length;

let diff = quizDifficulty;
let easy = diff.querySelector('option[value="10"]');
let medium = diff.querySelector('option[value="20"]');
let hard = diff.querySelector('option[value="30"]');

easy.disabled = total < 10;
medium.disabled = total < 20;
hard.disabled = total < 30;

}

/* THINK HINT SYSTEM */

function showThinkHint(text) {

let helper = document.getElementById("think-helper");
let bubble = document.getElementById("think-bubble");

bubble.innerHTML = text;

helper.style.display = "block";

setTimeout(() => {

helper.style.display = "none";

}, 5000);

}

function hideHint() {

document.getElementById("think-helper").style.display = "none";

}

function openChallengeMenu(){

// ẩn toàn bộ trang home
document.getElementById("home").classList.add("hidden");

// ẩn title
document.querySelector("h1").classList.add("hidden");

// hiện menu challenge
document.getElementById("challengeMenu").classList.add("show");

}

function renderMistakeTable() {

let table = document.getElementById("mistakeTableBody");
let total = document.getElementById("totalWrongWords");

table.innerHTML = "";
total.innerText = wrongWords.length;

wrongWords.forEach((w, index) => {

let row = `
<tr>
<td class="eng">${w.eng}</td>
<td>${w.pos}</td>
<td>${w.vie}</td>
<td>
<button class="speakBtn" onclick="speak('${w.eng}')">🔊</button>
<button class="deleteBtn" onclick="deleteMistake('${w.eng}')">❌</button>
</td>
</tr>
`;

table.innerHTML += row;

});

}

function deleteMistake(eng) {
    removeWrongWord(eng);
    renderMistakeTable();
}