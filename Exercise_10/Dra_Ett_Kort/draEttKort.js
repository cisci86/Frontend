const startHand = document.getElementById('button'); //knappen för att dra en start hand
const dealerPart = document.querySelector('#dealer > div'); //dealers del av bordet
const playerPart = document.querySelector('#player > div'); //spelarens del av bordet
const oneCard = document.getElementById('drawOne'); //knappen för att dra ett kort
const stay = document.getElementById('stay'); //knappen för att stanna

const deck = await getaDeck();

const dealerHand = `https://deckofcardsapi.com/api/deck/${deck}/pile/dealer/`;

const playerHand = `https://deckofcardsapi.com/api/deck/${deck}/pile/player/`;

async function getaDeck() {
    const uri = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    const deck = await fetch(uri).then(res => res.json());
    const deckid = deck.deck_id
    return deckid
}

async function drawstartCards() {
    const uri = `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`
    const drawStart = await fetch(uri).then(res => res.json());
    return drawStart
}

async function drawOneCard() {
    const uri = `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`
    const drawCard = await fetch(uri).then(res => res.json());
    return drawCard.cards

}

async function addCardToHand(hand, card) {
    if (card.length > 1) { //Om jag visste att det hade kunnat komma fler än 2 kort hade jag självklart gjort en forEach här
        await fetch(`${hand}add/?cards=${card[0].code},${card[1].code}`)
    }
    else
        await fetch(`${hand}add/?cards=${card[0].code}`)
}

async function getStartHand() {
    const cards = await drawstartCards()
    await addCardToHand(dealerHand, [cards.cards[0], cards.cards[2]])
    await addCardToHand(playerHand, [cards.cards[1], cards.cards[3]])
}

//lägger till ett kort vissuellt i uit
function addACard(card, place) {
    const addElement = document.createElement('img');
    addElement.setAttribute('src', card.image);
    addElement.classList.add('col-2')
    place.appendChild(addElement)
}

//Kanpp för att dra extra kort om man vill
oneCard.addEventListener('click', async () => {
    const card = await drawOneCard();
    await addCardToHand(playerHand, card)
    addACard(await card[0], playerPart);
    await checkIfDealerShouldDrawCard();
    const tablePoints = await points()
    checkGameStatus(tablePoints);
})

//Delar och visar en starthand av 4a kort (2 var)
startHand.addEventListener('click', async () => {
    await getStartHand();
    const dealers = await fetch(`${dealerHand}list/`).then(res => res.json());
    const player = await fetch(`${playerHand}list/`).then(res => res.json());
    const dealer2 = await dealers.piles.dealer.cards;
    const player2 = await player.piles.player.cards;
    dealer2.forEach(element => {
        addACard(element, dealerPart)
    });
    player2.forEach(element => {
        addACard(element, playerPart)
    });
    const tablePoints = await points();
    await checkPlayerPoints(tablePoints.player);
    startHand.classList.add('d-none')
    oneCard.classList.remove('d-none')
    stay.classList.remove('d-none')
})

//knapp för om man vill stanna
stay.addEventListener('click', async () => {
    await checkIfDealerShouldDrawCard()
    const tabelPoints = await points()
    checkGameStatus(tabelPoints)
})

//presenterar spelarnas poäng i UIt
async function points() {
    const pointDealer = await calculatePoints('dealer')
    document.getElementById('dealerPoints').innerText = `Dealer Points: ${pointDealer}`
    const pointsPlayer = await calculatePoints('player')
    document.getElementById('playerPoints').innerText = `Player Points: ${pointsPlayer}`
    return {
        player: pointsPlayer,
        dealer: pointDealer
    }
}

//Räknar ut poängen för en hand
async function calculatePoints(player) {
    let hand;
    if (player == 'dealer')
        hand = dealerHand;
    else
        hand = playerHand;
    const deck = await fetch(`${hand}list/`).then(res => res.json());
    const cards = await deck.piles[player].cards;
    //för at sorteringen ska fungera tar jag ut värdet från varje kort och lägger in i en ny array
    const cardsValue = [];
    cards.forEach(card => {
        cardsValue.push(card.value)
    })
    const cardsSorted = sortDeck(cardsValue); //korten sorteras för att Äss ska komma sist och räknas rätt
    let points = 0;
    cardsSorted.forEach(card => {
        if (card == 'ACE') {
            points < 11 ? points += 10 : points += 1
        }
        else if (!Number.isNaN(+card)) {
            points += parseInt(card)
        }
        else {
            points += 10
        }
    })
    return points
}
//funkation för att kolla om dealer ska dra nytt kort
async function checkIfDealerShouldDrawCard() {
    const pointsDealer = await calculatePoints('dealer');
    if (pointsDealer < 17) {
        const card = await drawOneCard();
        await addCardToHand(dealerHand, card)
        addACard(card[0], dealerPart)
    }
}

//kollar hur spelarens poängen ligger
function checkPlayerPoints(points) {
    if (points > 21) {
        alert('You lose!');
        return true
    }
    else if (points == 21) {
        alert('Black Jack!!!!!!! You win!');
        return true
    }
    return false
}

//kollar vem som vunnit
function checkGameStatus(points) {
    if (!checkPlayerPoints(points.player)) {
        if (points.dealer > 21) {
            alert('The player wins')
            return
        }
        if (points.player > points.dealer) {
            alert('The Player wins');
        }
        else
            alert('The House wins')
    }
}

//Ser till att Äss hamnar sist i handen för att räkningen ska bli rätt
function sortDeck(deck) {
    deck.sort(function (a, b) {
        if (a == 'ACE') {
            return 1
        }
        if (b == 'ACE') {
            return -1
        }
    })

    return deck
}