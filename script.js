// STATO GIOCO
let deck = [];
let players = [];
let currentPlayerIdx = 0;
let kingsDrawn = 0;

// NAVIGAZIONE TRA SCHERMATE
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function goToSetup() {
  showScreen('setupScreen');
  renderPlayerInputs();
}

function goToRules() {
  showScreen('rulesScreen');
}

// SETUP
let playerCount = 4;

function changeCount(delta) {
  playerCount = Math.max(2, Math.min(20, playerCount + delta));
  document.getElementById('countDisplay').textContent = playerCount;
  renderPlayerInputs();
}

function renderPlayerInputs() {
  const container = document.getElementById('playersInputs');
  container.innerHTML = '';
  for (let i = 0; i < playerCount; i++) {
    const row = document.createElement('div');
    row.className = 'player-input-row';
    row.innerHTML = `
      <input type="text" placeholder="Giocatore ${i+1}" id="playerName${i}" />
      <select id="playerGender${i}">
        <option value="M">Maschio</option>
        <option value="F">Femmina</option>
      </select>
    `;
    container.appendChild(row);
  }
}

function startGame() {
  players = [];
  for (let i = 0; i < playerCount; i++) {
    const name = document.getElementById('playerName'+i).value.trim() || 'Giocatore '+(i+1);
    const gender = document.getElementById('playerGender'+i).value;
    players.push({ name, gender });
  }
  deck = buildDeck();
  currentPlayerIdx = 0;
  kingsDrawn = 0;
  updateKingsUI();
  updateCurrentPlayer();
  updateDeckCount();
  updatePlayersOrder();
  document.getElementById('cardReveal').classList.add('hidden');
  document.getElementById('deckTop').style.display = 'block';
  showScreen('gameScreen');
}

// GIOCO
function drawCard() {
  if (deck.length === 0) {
    alert('Il mazzo e finito!');
    return;
  }
  const card = deck.pop();
  displayCard(card);
  updateDeckCount();
  if (card.rank === 'K') {
    kingsDrawn++;
    updateKingsUI();
    if (kingsDrawn === 4) {
            document.getElementById('lastKingPlayer').textContent = players[currentPlayerIdx].name;
      setTimeout(() => showScreen('endScreen'), 2000);
    }
  }
}

function displayCard(card) {
  document.getElementById('deckTop').style.display = 'none';
  const data = CARDS_DATA[card.rank];
  const isRed = (card.suit === '♥' || card.suit === '♦');
  const playingCardEl = document.getElementById('playingCardEl');
  playingCardEl.className = 'playing-card ' + (isRed ? 'red' : 'black');
  document.getElementById('pcRankTL').textContent = card.rank;
  document.getElementById('pcSuitTL').textContent = card.suit;
  document.getElementById('pcRankBR').textContent = card.rank;
  document.getElementById('pcSuitBR').textContent = card.suit;
  document.getElementById('pcCenter').textContent = card.suit;
  document.getElementById('ruleTitle').textContent = data.title;
  document.getElementById('ruleDesc').textContent = data.desc;
  const genderNote = document.getElementById('ruleGender');
  if (data.gender) {
    genderNote.textContent = data.gender;
    genderNote.style.display = 'block';
  } else {
    genderNote.style.display = 'none';
  }
  document.getElementById('cardReveal').classList.remove('hidden');
}

function nextPlayer() {
  document.getElementById('cardReveal').classList.add('hidden');
  document.getElementById('deckTop').style.display = 'block';
  currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
  updateCurrentPlayer();
  updatePlayersOrder();
}

function updateCurrentPlayer() {
  document.getElementById('currentPlayerName').textContent = players[currentPlayerIdx].name;
}

function updateDeckCount() {
  document.getElementById('deckRemaining').textContent = deck.length + ' carte';
}

function updateKingsUI() {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('k'+i);
    if (i <= kingsDrawn) {
      el.classList.add('drawn');
    } else {
      el.classList.remove('drawn');
    }
  }
}

function updatePlayersOrder() {
  const bar = document.getElementById('playersOrderBar');
  let html = '<ul>';
  for (let i = 0; i < players.length; i++) {
    const cls = (i === currentPlayerIdx) ? 'active-player' : '';
    html += `<li class="${cls}">${players[i].name}</li>`;
  }
  html += '</ul>';
  bar.innerHTML = html;
}

function confirmRestart() {
  if (confirm('Vuoi davvero ricominciare?')) {
    showScreen('heroScreen');
  }
}

function restartAll() {
  showScreen('heroScreen');
}

// INIT
renderPlayerInputs();
