(function() {

	'use-strict';

	angular
		.module('BlackJack')
		.controller('GameController', GameController);

	function GameController(CardsService, $q) {

		var vm = this;

		vm.deck = {};
		vm.dealer = {
			dealer: true,
			cardsHidden: true,
			hand: [],
			hasAce: false,
			isBust: false,
			matchScore: 0,
			totalScore: 0,
			cardspace: '#dealersCards',
			matchScoreBoard: '#dealerMatchScore'
		};
		vm.player = {
			dealer: false,
			hand: [],
			hasAce: false,
			isBust: false,
			matchScore: 0,
			totalScore: 0,
			cardspace: '#playersCards',
			matchScoreBoard: '#playerMatchScore'
		}

		vm.deal = deal;
		vm.giveCards = giveCards;
		vm.dealerTurn = dealerTurn;
		vm.endMatch = endMatch;

		/////////////////

		function deal() {

			// Dissable the deal button
			$('#deal').attr('disabled', true);

			CardsService.getNewDeck().then(
				function successCallback(response) {
					vm.deck = response.data;

					// Reset the Ace flags
					vm.player.hasAce = false;
					vm.dealer.hasAce = false;

					// Reset player hands
					vm.player.hand = [];
					vm.dealer.hand = [];
					vm.player.matchScore = 0;
					vm.dealer.matchScore = 0;
					vm.dealer.cardsHidden = true;

					// Reset score highlight 
					$('.score').removeClass('bg-primary');

					// Show play buttons
					$('button.play').removeClass('hidden');

					// Give two cards to the player
					vm.giveCards(vm.player, 2);

					// Deal two cards to the dealer 
					vm.giveCards(vm.dealer, 2);

					// Enable deal button 
					$('#deal').attr('disabled', false);
				}, 
				function errorCallback(response) {
					console.log('Error');
					console.log(response);
				}
			)
		}

		function giveCards(player, num) {
			CardsService.dealCards(vm.deck.deck_id, num).then(
				function successCallback(response) {

					processCards(player, response.data.cards)

				},
				function errorCallback(response) {
					console.log('Error');
					console.log(response);
				}
			)
		}

		function processCards(player, cards) {
			$.each(cards, function(index, item) {

				// Check for ace
				if (item.value == 'ACE') {
					player.hasAce = true;
				}

				// Check for Picture cards
				if (isNaN(item.value)) {
					if (item.value == 'ACE') {
						item.value = 11;
					} else {
						item.value = 10;
					}
				}

				// Calculate score
				player.matchScore += parseInt(item.value);
				if (player.hasAce && player.matchScore > 21) {
					player.hasAce = false;
					player.matchScore -= 10;
				}

				// Add card to players hand 
				player.hand.push(item);

				// Check if player is Bust
				if (player.matchScore > 21) {
					if (!player.dealer) {
						$('button.play').addClass('hidden');
						dealerTurn();
					} else {
						vm.dealer.isBust = true;
					}
				}
			})
		}

		function dealerTurn() {

			$('button.play').addClass('hidden');

			// Turn the dealer cards over
			vm.dealer.cardsHidden = false;

			if (vm.dealer.matchScore < 17) {
				dealCard();
			} else {
				vm.endMatch();
			}

			function dealCard() {
				CardsService.dealCards(vm.deck.deck_id, 1).then(
					function successCallback(response) {

						processCards(vm.dealer, response.data.cards);

						if (vm.dealer.matchScore < 17) {
							dealCard();
						} else {
							vm.endMatch();
						}

					},
					function errorCallback(response) {
						console.log('Error');
						console.log(response);
					}
				)
			}

			
		}

		function endMatch() {
			if ( (vm.dealer.matchScore > vm.player.matchScore && vm.dealer.matchScore < 22) || (vm.dealer.matchScore < 22 && vm.player.matchScore > 21) ) {
				vm.dealer.totalScore += 1;
				$('#dealerScore').addClass('bg-primary');
			} else if (  (vm.player.matchScore > vm.dealer.matchScore && vm.player.matchScore < 22) || (vm.player.matchScore < 22 && vm.dealer.matchScore > 21)   ) {
				vm.player.totalScore += 1;
				$('#playerScore').addClass('bg-primary');
			} else {
			}
		}
			
	}

})();