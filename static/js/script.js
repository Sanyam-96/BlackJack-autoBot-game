//BlackJack JS project 

// Just to make accessof IDs directly from this object(not compulsory)
let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11], },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lostSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        // console.log(card);
        showCard(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
        // console.log(YOU['score']);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.setAttribute('src', `static/images/${card}.png`);
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function updateScore(activePlayer, card) {

    if (card === 'A') {    // In case of ACE :- if adding 11 keeps us below 21, add 11. Otherwise add 1

        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21)
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        else
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
    }
    else
        activePlayer['score'] += blackjackGame['cardsMap'][card];

}

function showScore(activePlayer) {

    if (activePlayer['score'] <= 21)
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {

    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(DEALER, card);
        showScore(DEALER);
        await sleep(1000);
    }

    // if (DEALER['score'] > 15) {
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    // console.log(blackjackGame['turnsOver']);
    // }

}

function blackjackDeal() {

    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;
        document.querySelector('#blackjack-result').textContent = `Let's Play`;
        document.querySelector('#blackjack-result').style.color = `black`;


        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        // console.log(yourImages);

        Array.from(yourImages).forEach(function (element) {
            element.remove();
        })
        Array.from(dealerImages).forEach(function (element) {
            element.remove();
        })

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        blackjackGame['turnsOver'] = true;
    }
}

// compute winner and return who just won 
function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {      //condition when you busts but dealer doesnt
        blackjackGame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {       ///condition when you and dealer both busts
        blackjackGame['draws']++;
    }

    return winner;

}

function showResult(winner) {
    if (blackjackGame['turnsOver'] === true) {
        // console.log(winner.div);

        let message, messageColor;
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lostSound.play();
        }
        else if (winner === 'no-one') {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;

    }
}
