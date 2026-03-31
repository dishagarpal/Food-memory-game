const game = document.getElementById("game");

// 🍔 Food Emojis
let symbols = ["🍕","🍔","🍩","🍓","🍉","🍇","🍟","🍪"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;

let moves = 0;
let time = 0;
let timer;
let currentSize = 4;

// 🔊 Sounds
const flipSound = new Audio("freesound_community-flipcard-91468 (1).mp3");
const matchSound = new Audio("bithuh-pop-win-casino-winning-398059.mp3");

// 🎚️ Start Game
function startGame(size = 4) {
  currentSize = size;

  game.style.gridTemplateColumns = `repeat(${size}, 80px)`;

  let neededPairs = (size * size) / 2;
  let selected = symbols.slice(0, neededPairs);

  cards = [...selected, ...selected];
  shuffle(cards);

  game.innerHTML = "";
  moves = 0;
  time = 0;

  document.getElementById("moves").innerText = 0;
  document.getElementById("time").innerText = 0;

  updateBest();

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerText = time;
  }, 1000);

  cards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="inner">
        <div class="front">?</div>
        <div class="back">${symbol}</div>
      </div>
    `;

    card.onclick = () => flip(card, index);
    game.appendChild(card);
  });

  document.getElementById("winPopup").classList.add("hidden");
}

// 🔀 Shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 🔄 Flip
function flip(card, index) {
  if (lock || card.classList.contains("flipped")) return;

  flipSound.play();
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = { card, index };
    return;
  }

  secondCard = { card, index };
  moves++;
  document.getElementById("moves").innerText = moves;

  checkMatch();
}

// ✅ Match
function checkMatch() {
  if (cards[firstCard.index] === cards[secondCard.index]) {
    matchSound.play();

    firstCard = null;
    secondCard = null;

    if (document.querySelectorAll(".flipped").length === cards.length) {
      clearInterval(timer);
      setTimeout(showWin, 300);
    }
  } else {
    lock = true;

    setTimeout(() => {
      firstCard.card.classList.remove("flipped");
      secondCard.card.classList.remove("flipped");

      firstCard = null;
      secondCard = null;
      lock = false;
    }, 800);
  }
}

// 🎉 Win Popup
function showWin() {
  let best = localStorage.getItem("bestScore") || Infinity;

  if (moves < best) {
    localStorage.setItem("bestScore", moves);
    best = moves;
  }

  document.getElementById("finalStats").innerText =
    `Moves: ${moves} | Time: ${time}s | Best: ${best}`;

  document.getElementById("winPopup").classList.remove("hidden");
}

// 💾 Best Score
function updateBest() {
  let best = localStorage.getItem("bestScore");
  document.getElementById("best").innerText = best ? best : "-";
}

// 🔁 Restart
function restartGame() {
  startGame(currentSize);
}

// 🚀 Start
startGame(4);