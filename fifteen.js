
let tiles = [];
let emptyTile = { x: 3, y: 3 };
let moveCount = 0;
let timer;
let elapsedTime = 0;

function initializeGame() {
  clearInterval(timer); // Stop any ongoing timer
  elapsedTime = 0; // Reset time
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  tiles = [];


  document.body.style.fontFamily = "'Roboto', sans-serif"; 
  
  for (let i = 0; i < 15; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = i + 1;

    tile.style.gridColumnStart = (i % 4) + 1;
    tile.style.gridRowStart = Math.floor(i / 4) + 1;

    tile.addEventListener('click', () => moveTile(tile, i));
    tiles.push(tile);
    gameBoard.appendChild(tile);
  }

  // Apply transparency if checkbox is checked
  const isTransparent = document.getElementById('tile-transparency').checked;
  if (isTransparent) {
    tiles.forEach(tile => {
      tile.style.opacity = 0.5;
    });
  }

  // Add empty tile space
  emptyTile = { x: 4, y: 4 };
  moveCount = 0;
  updateStats();
}

function moveTile(tile) {
  const tilePosition = {
    x: parseInt(tile.style.gridColumnStart),
    y: parseInt(tile.style.gridRowStart),
  };

  if (
    (Math.abs(tilePosition.x - emptyTile.x) === 1 && tilePosition.y === emptyTile.y) ||
    (Math.abs(tilePosition.y - emptyTile.y) === 1 && tilePosition.x === emptyTile.x)
  ) {
    // Swap positions
    tile.style.gridColumnStart = emptyTile.x;
    tile.style.gridRowStart = emptyTile.y;
    emptyTile = tilePosition;

    moveCount++;
    updateStats();

    if (checkWinCondition()) {
      endGame();
    }
  }
}

function isMovable(tile) {
  const tilePosition = {
    x: parseInt(tile.style.gridColumnStart),
    y: parseInt(tile.style.gridRowStart),
  };

  return (
    (Math.abs(tilePosition.x - emptyTile.x) === 1 && tilePosition.y === emptyTile.y) ||
    (Math.abs(tilePosition.y - emptyTile.y) === 1 && tilePosition.x === emptyTile.x)
  );
}

function shuffleTiles() {
  for (let i = 0; i < 100; i++) {
    const movableTiles = tiles.filter(isMovable);
    const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
    moveTile(randomTile);
  }
  moveCount = 0; 
  updateStats();
}

function updateStats() {
  document.getElementById('move-count').textContent = moveCount;
  document.getElementById('elapsed-time').textContent = `${Math.floor(elapsedTime / 60)}:${elapsedTime % 60}`;
}

function startTimer() {
  clearInterval(timer); 
  timer = setInterval(() => {
    elapsedTime++;
    updateStats();
  }, 1000);
}

function checkWinCondition() {
  return tiles.every((tile, index) => {
    const correctColumn = (index % 4) + 1;
    const correctRow = Math.floor(index / 4) + 1;
    return (
      parseInt(tile.style.gridColumnStart) === correctColumn &&
      parseInt(tile.style.gridRowStart) === correctRow
    );
  });
}

function endGame() {
  clearInterval(timer);
  document.getElementById('final-moves').textContent = moveCount;
  document.getElementById('final-time').textContent = `${Math.floor(elapsedTime / 60)}:${elapsedTime % 60}`;
  document.getElementById('end-game-modal').classList.remove('hidden');
}

// Event listeners
document.getElementById('shuffle-btn').addEventListener('click', () => {
  shuffleTiles();
  startTimer(); 
});

document.getElementById('restart-btn').addEventListener('click', () => {
  initializeGame();
  startTimer();
});

document.getElementById('options-btn').addEventListener('click', () => {
  document.getElementById('options-modal').classList.remove('hidden');
});

document.getElementById('background-select').addEventListener('change', (event) => {
  const selectedBackground = event.target.value; 
  const gameBoard = document.getElementById('game-board');
  gameBoard.style.backgroundImage = `url('${selectedBackground}')`; 
  gameBoard.style.backgroundSize = 'cover'; 
  gameBoard.style.backgroundPosition = 'center'; 
});

// Handle tile transparency toggle
document.getElementById('tile-transparency').addEventListener('change', (event) => {
  const tiles = document.querySelectorAll('.tile'); 
  if (event.target.checked) {
    tiles.forEach(tile => {
      tile.style.opacity = 0.5; 
    });
  } else {
    tiles.forEach(tile => {
      tile.style.opacity = 1; 
    });
  }
});

document.getElementById('close-options').addEventListener('click', () => {
  document.getElementById('options-modal').classList.add('hidden');
});

document.getElementById('restart-btn-modal').addEventListener('click', () => {
  document.getElementById('end-game-modal').classList.add('hidden'); 
  initializeGame();
  startTimer();
});

// Initialize the game on page load
initializeGame();
startTimer();
