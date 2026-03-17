function addWord() {

let eng = engInput.value.trim();
let vie = vieInput.value.trim();
let pos = posInput.value;

if (!eng || !vie) return;

if (vocab.some(w => w.eng === eng)) {

alert("Word already exists!");
return;

}

vocab.push({ eng, vie, pos });

save();
renderTable();

engInput.value = "";
vieInput.value = "";

}

function renderTable() {

let table = document.getElementById("tableBody");
table.innerHTML = "";

vocab.forEach((w, i) => {

table.innerHTML += `

<tr>
<td onclick="speak('${w.eng}')" class="engWord">${w.eng}</td>
<td>${w.pos}</td>
<td>${w.vie}</td>

<td class="actionCell">

<button class="actionBtn" onclick="speak('${w.eng}')">🔊</button>

<button class="actionBtn deleteBtn" onclick="deleteWord(${i})">✖</button>

</td>
</tr>
`;

});

totalWords.innerText = vocab.length;

updateDifficulty();

}

function deleteWord(i) {

vocab.splice(i, 1);

save();
renderTable();

}

/* ===== SHUFFLE ===== */

function shuffle(array) {

for (let i = array.length - 1; i > 0; i--) {

let j = Math.floor(Math.random() * (i + 1));

[array[i], array[j]] = [array[j], array[i]];

}

return array;

}