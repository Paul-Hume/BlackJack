
var deckDetails;

// Setup player variables
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
    $.ajax({
        url: 'http://deckofcardsapi.com/api/deck/' + deckDetails.deck_id + '/draw/?count=' + num,
        async: false,

        success: function(data) {
            for (var i = 0; i < data.cards.length; i++) {

                // Check for ace
                if (data.cards[i].value == 'ACE') {
                    person.hasAce = true;
                }

                // Check for Picture cards
                if (isNaN(data.cards[i].value)) {
                    if (data.cards[i].value == 'ACE') {
                        data.cards[i].value = 11;
                    } else {
                        data.cards[i].value = 10;
                    }
                }

                // Calculate score
                person.matchScore += parseInt(data.cards[i].value);
                if (person.hasAce && person.matchScore > 21) {
                    person.hasAce = false;
                    person.matchScore -= 10;
                }

                // Give the card to player
                person.hand.push(data.cards[i]);

                if (person == player) {
                    $(person.cardspace).append('<li><img src="' + data.cards[i].image + '"></li>');
                }

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
    });
}

function alertObj() {

    this.show = function(options) {
        // Set the type and text for the alert
        this.type = options.type || 'success';
        this.text = options.text || 'Notification text here';

        // Remove previous classes
        $('#userAlert').removeClass('alert-success').removeClass('alert-danger').removeClass('alert-info');

        // Set the alert type and text
        $('#userAlert').addClass('alert-' + this.type).html(this.text);

        // Display the allert
        $('#userAlert').removeClass('hidden');
    }

    this.hide = function() {
        $('#userAlert').addClass('hidden');
    }
}

var alert = new alertObj();

function deal() {

    alert.hide();

    $('#deal').attr('disabled', true);

    deckDetails = '';

    $.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(data, status){
        deckDetails = data;
        $('#deal').attr('disabled', false);

        // Reset the Ace flags
        player.hasAce = false;
        dealer.hasAce = false;

        // // Remove score highlights
        $('#dealerScore').removeClass('bg-primary');
        $('#playerScore').removeClass('bg-primary');

        // Show stick and twist buttons
        $('#twist').removeClass('hidden');
        $('#stick').removeClass('hidden');

        // Deal 2 cards to the player
        giveCards(player, 2);

        // Put blank cards down for dealer
        $(dealer.cardspace).append('<li><img src="img/cards/back.png"></li><li><img src="img/cards/back.png"></li>');

        // Reset dealer isBust back to false
        dealer.isBust = false;
    });
}

function dealerTurn() {

    for (var i = dealer.matchScore; i < 17 && !dealer.isBust;) {
        giveCards(dealer, 1);
        i = dealer.matchScore;
    }

    dealer.hand.reverse();

    // Remove card placeholders
    $(dealer.cardspace).html('');

    (function loop(i) {
        setTimeout(function () {

            if (i == dealer.hand.length) {
                $(dealer.cardspace).html('');
            }
            $(dealer.cardspace).append('<li><img src="' + dealer.hand[i - 1].image + '"></li>');

            if (--i) {
                loop(i);
            } else {
                endMatch(); // iteration counter
            }
        }, 1000) // delay
    })(dealer.hand.length); // iterations count

}

function endMatch() {

    // Compare scores to see who wins
    $('#dealerMatchScore').removeClass('hidden');

    if (dealer.matchScore > player.matchScore) {
        dealer.totalScore += 1;
        $('#dealerScore').html(dealer.totalScore).addClass('bg-primary');
        alert.show({type: 'info', text: 'Dealer wins'});
    } else if (player.matchScore > dealer.matchScore) {
        player.totalScore += 1;
        $('#playerScore').html(player.totalScore).addClass('bg-primary');
        alert.show({type: 'success', text: 'Congratulations, you win!!!'});
    } else {
        alert.show({type: 'info', text: 'DRAW - No body won that round'});
    }
}

$(document).ready(function() {

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
