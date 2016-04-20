
// Card Data
var cards = []
cards.push (
    { ace: true, value: 11, img: 'ace_of_spades.svg'},
    { ace: false, value: 2, img: '2_of_spades.svg'},
    { ace: false, value: 3, img: '3_of_spades.svg'},
    { ace: false, value: 4, img: '4_of_spades.svg'},
    { ace: false, value: 5, img: '5_of_spades.svg'},
    { ace: false, value: 6, img: '6_of_spades.svg'},
    { ace: false, value: 7, img: '7_of_spades.svg'},
    { ace: false, value: 8, img: '8_of_spades.svg'},
    { ace: false, value: 9, img: '9_of_spades.svg'},
    { ace: false, value: 10, img: '10_of_spades.svg'},
    { ace: false, value: 10, img: 'jack_of_spades.svg'},
    { ace: false, value: 10, img: 'queen_of_spades.svg'},
    { ace: false, value: 10, img: 'king_of_spades.svg'},
    { ace: true, value: 11, img: 'ace_of_clubs.svg'},
    { ace: false, value: 2, img: '2_of_clubs.svg'},
    { ace: false, value: 3, img: '3_of_clubs.svg'},
    { ace: false, value: 4, img: '4_of_clubs.svg'},
    { ace: false, value: 5, img: '5_of_clubs.svg'},
    { ace: false, value: 6, img: '6_of_clubs.svg'},
    { ace: false, value: 7, img: '7_of_clubs.svg'},
    { ace: false, value: 8, img: '8_of_clubs.svg'},
    { ace: false, value: 9, img: '9_of_clubs.svg'},
    { ace: false, value: 10, img: '10_of_clubs.svg'},
    { ace: false, value: 10, img: 'jack_of_clubs.svg'},
    { ace: false, value: 10, img: 'queen_of_clubs.svg'},
    { ace: false, value: 10, img: 'king_of_clubs.svg'},
    { ace: true, value: 11, img: 'ace_of_hearts.svg'},
    { ace: false, value: 2, img: '2_of_hearts.svg'},
    { ace: false, value: 3, img: '3_of_hearts.svg'},
    { ace: false, value: 4, img: '4_of_hearts.svg'},
    { ace: false, value: 5, img: '5_of_hearts.svg'},
    { ace: false, value: 6, img: '6_of_hearts.svg'},
    { ace: false, value: 7, img: '7_of_hearts.svg'},
    { ace: false, value: 8, img: '8_of_hearts.svg'},
    { ace: false, value: 9, img: '9_of_hearts.svg'},
    { ace: false, value: 10, img: '10_of_hearts.svg'},
    { ace: false, value: 10, img: 'jack_of_hearts.svg'},
    { ace: false, value: 10, img: 'queen_of_hearts.svg'},
    { ace: false, value: 10, img: 'king_of_hearts.svg'},
    { ace: true, value: 11, img: 'ace_of_diamonds.svg'},
    { ace: false, value: 2, img: '2_of_diamonds.svg'},
    { ace: false, value: 3, img: '3_of_diamonds.svg'},
    { ace: false, value: 4, img: '4_of_diamonds.svg'},
    { ace: false, value: 5, img: '5_of_diamonds.svg'},
    { ace: false, value: 6, img: '6_of_diamonds.svg'},
    { ace: false, value: 7, img: '7_of_diamonds.svg'},
    { ace: false, value: 8, img: '8_of_diamonds.svg'},
    { ace: false, value: 9, img: '9_of_diamonds.svg'},
    { ace: false, value: 10, img: '10_of_diamonds.svg'},
    { ace: false, value: 10, img: 'jack_of_diamonds.svg'},
    { ace: false, value: 10, img: 'queen_of_diamonds.svg'},
    { ace: false, value: 10, img: 'king_of_diamonds.svg'}

)

// Setup player and deck variables
var deck = [];
var dealer = {
    dealer: true,
    hand: [],
    hasAce: false,
    isBust: false,
    matchScore: 0,
    totalScore: 0,
    cardspace: '#dealersCards',
    matchScoreBoard: '#dealerMatchScore'
};
var player = {
    dealer: false,
    hand: [],
    hasAce: false,
    isBust: false,
    matchScore: 0,
    totalScore: 0,
    cardspace: '#playersCards',
    matchScoreBoard: '#playerMatchScore'
}

function giveCards(person, num) {
    for (var i = 0; i < num; i++) {

        // Select random card from the deck
        var x = Math.floor(Math.random() * deck.length);
        var cardPicked = deck.splice(x, 1)[0];

        // Is this card an ace?
        if (cardPicked.ace) {
            person.hasAce = true;
        }

        // Calculate score
        person.matchScore += cardPicked.value;
        if (person.hasAce && person.matchScore > 21) {
            person.hasAce = false;
            person.matchScore -= 10;
        }

        // Give the card to player
        person.hand.push(cardPicked);
        $(person.cardspace).append('<li><img src="img/cards/' + cardPicked.img + '"></li>');

        // Update score
        $(person.matchScoreBoard).html(person.matchScore);

        // Check if player is Bust
        if (person.matchScore > 21) {
            if (!person.dealer) {
                $('#twist').addClass('hidden');
                $('#stick').addClass('hidden');
                $(person.matchScoreBoard).html('BUST (' + person.matchScore + ')');
                person.matchScore = 0;
                dealerTurn();
            } else {
                console.log('Dealer is BUST');
                dealer.isBust = true;
                $(person.matchScoreBoard).html('BUST (' + person.matchScore + ')');
                person.matchScore = 0;
            }
        }
    }
}

function deal() {

    // Reset the deck
    deck = [];
    deck = cards.slice();

    // Remove score highlights
    $('#dealerScore').removeClass('bg-primary');
    $('#playerScore').removeClass('bg-primary');

    // Deal 2 cards to the player
    giveCards(player, 2);

    // Put blank cards down for dealer
    $(dealer.cardspace).append('<li><img src="img/cards/back.png"></li><li><img src="img/cards/back.png"></li>')

    // Reset dealer isBust back to false
    dealer.isBust = false;

    // Show stick and twist buttons
    $('#twist').removeClass('hidden');
    $('#stick').removeClass('hidden');
}

function dealerTurn() {

    // Remove card placeholders
    $(dealer.cardspace).html('');

    // While dealer scores less than n twist another card
    for (var i = dealer.matchScore; i < 17 && !dealer.isBust;) {
        giveCards(dealer, 1);
        i = dealer.matchScore;
    }

    // End the match
    endMatch();
}

function endMatch() {

    // Compare scores to see who wins
    if (dealer.matchScore > player.matchScore) {
        dealer.totalScore += 1;
        $('#dealerScore').html(dealer.totalScore).addClass('bg-primary');
    } else if (player.matchScore > dealer.matchScore) {
        player.totalScore += 1;
        $('#playerScore').html(player.totalScore).addClass('bg-primary');
    }
}

$(document).ready(function() {
    $('#start').click(function() {
        // reset deck
        deck = [];
        deck = cards.slice();

        // deal first cards
        deal();

        // Switch start button for reset
        $('#start').addClass('hidden');
        $('#deal').removeClass('hidden');
        $('#stick').removeClass('hidden');
    });

    $('#deal').click(function() {

        // Reset Player
        player.hand = [];
        player.matchScore = 0;
        $(player.cardspace).html('');
        $(player.matchScoreBoard).html('0');

        // Reset Dealer
        dealer.hand = [];
        dealer.matchScore = 0;
        $(dealer.cardspace).html('');
        $(dealer.matchScoreBoard).html('');

        deal();
    })

    $('#twist').click(function() {
        giveCards(player, 1);
    })

    $('#stick').click(function() {
        $('#twist').addClass('hidden');
        $(this).addClass('hidden');
        dealerTurn();
    })
});
