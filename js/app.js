// Helper functions
// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

const openCard = (card) => {
  card.classList.add('open', 'show');
};

const closeCard = (card) => {
  card.classList.remove('open', 'show');
};

const addCardToList = (list, card) => {
  list.push(card);
};

const lockCard = (card) => {
  card.classList.add('match');
};

const updateMovesCounter = (moves, movesDisplay) => {
  movesDisplay.textContent = moves;
};

const updateStarDisplay = (moves, starDisplay) => {
  // After 10 moves remove a star
  if (moves > 10 && moves <= 20) {
    starDisplay[0].classList.add('hide');
    return 2;
  }
  // After 20 moves remove another star
  else if (moves > 20) {
    starDisplay[1].classList.add('hide');
    return 1;
  }
  else {
    return 3;
  }
};

const resetStarDisplay = (starDisplay) => {
  // remove hide class from hidden stars
  starDisplay.forEach((star) => {
    if (star.classList.contains('hide')) {
      star.classList.remove('hide');
    }
  });
};

const startTimer = (seconds, timerDisplay) => {
  timer = setInterval(() => {
    seconds += 1;
    timerDisplay.innerHTML = seconds;
  }, 1000);
};

const endTimer = (timer) => {
  clearInterval(timer);
};

const updateTimerDisplay = (timerDisplay, seconds) => {
  seconds += 1;
  timerDisplay.innerHTML = seconds;
};

const resetWinPopUp = (winPopUp) => {
  if (!winPopUp.classList.contains('hide')) {
    winPopUp.classList.add('hide');
  }
};

const showWinPopUp = (winPopUp) => {
  winPopUp.classList.remove('hide');
}

// Game logic
const initGame = () => {
  // Create a list that holds all of your cards
  let startingDeck = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
                      'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
                      'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
                      'fa-bicycle', 'fa-bomb'];

  // Store move counter and reset
  let moves = 0;
  let movesDisplay = document.querySelector('.moves');
  updateMovesCounter(moves, movesDisplay);

  // Store star display and reset
  let starDisplay = document.querySelectorAll('.fa-star');
  resetStarDisplay(starDisplay);

  // Store timer and reset
  let timerDisplay = document.querySelector('.fa-timer');
  let seconds = 0;
  timerDisplay.innerHTML = seconds;
  let firstClick = true;

  // Display cards on page
  startingDeck = shuffle(startingDeck);
  startingDeck = startingDeck.map((card) => {
    return `<li data-type='${card}' class='card'><i class='fa ${card}'></i></li>`;
  });
  let deckContainer = document.querySelector('.deck');
  deckContainer.innerHTML = startingDeck.join('');

  const cards = document.querySelectorAll('.card');
  let openCards = [];
  let matchCards = 0;

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Start timer
      if (firstClick === true) {
        startTimer(seconds, timerDisplay);
        firstClick = false;
      }
      // Only allow user to click on face down cards
      if (!card.classList.contains('match') && !card.classList.contains('open')
      && !card.classList.contains('show')) {
        openCard(card);
        addCardToList(openCards, card);
        if (openCards.length === 2) {
          // Check to see if cards match
          if (openCards[0].dataset.type === openCards[1].dataset.type) {
            // Lock cards
            lockCard(openCards[0]);
            lockCard(openCards[1]);
            openCards = [];
            matchCards += 2;
            // Hide cards
          } else {
            setTimeout(() => {
              openCards.forEach((card) => {
                closeCard(card);
              });
              openCards = [];
            }, 500);
          }
          // Update moves counter, star display, seconds
          moves += 1;
          updateMovesCounter(moves, movesDisplay);
          stars = updateStarDisplay(moves, starDisplay);
          seconds = timerDisplay.innerHTML;
        }
        // If all cards are matched, end timer and display message
        if (matchCards === 16) {
          endTimer(timer);
          let message = document.querySelector('.win-message');
          message.innerHTML = `You win! It took you ${seconds} seconds and ${moves} moves to win. Your star rating is ${stars}!`;
          let playAgain = document.querySelector('.play-again');
          playAgain.addEventListener('click', (e) => {
            resetWinPopUp(winPopUp);
            initGame();
          });
          showWinPopUp(winPopUp);
        }
      }
    });
  });
};

let timer;
let winPopUp = document.querySelector('.win-pop-up');
initGame();

// Reinit game if reset button is clicked
let restartButton = document.querySelector('.restart-container');
restartButton.addEventListener('click', (e) => {
  endTimer(timer);
  resetWinPopUp(winPopUp);
  initGame();
});
