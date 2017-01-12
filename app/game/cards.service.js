(function() {

	'use-strict';

	angular
		.module('BlackJack')
		.service('CardsService', CardsService);

	function CardsService($http) {

		var service = this;

		service.getNewDeck = getNewDeck;
		service.dealCards = dealCards;

		/////////////////////

		function getNewDeck() {
			return $http({
				method: 'GET',
				url: 'http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
			}).then(
				function(response) {
					return response;
				}
			)
		}

		function dealCards(deckId, num) {
			return $http({
				method: 'GET',
				url: 'http://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=' + num,
			}).then(
				function(response) {
					return response;
				}
			)
		}

	}

})();