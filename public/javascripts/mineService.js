app.service('mineService', ['$q', 'apiService', function($q, apiService){
	return new MineService($q, apiService);
}]);

function MineService($q, apiService){
	var self = this;

	var board = {
		id: null,
		num_mines: null,
		rows: []
	};

	this.getBoard = function(id){
		var defer = $q.defer();

		apiService.getBoard(id).then(function(scc){
			board = scc.data;
			defer.resolve(board);
		})

		return defer.promise;
	}

	this.clickMine = function(row, col, action){
		return apiService.clickMine(board.id, row, col, action);
	}

	this.addBoard = function(){
		var defer = $q.defer();

		apiService.addBoard().then(function(){
			apiService.getBoards().then(function(scc){
				defer.resolve(scc.data);
			})
		})

		return defer.promise;
	}

	this.removeBoard = function(id){
		var defer = $q.defer();

		apiService.removeBoard(id).then(function(){
			apiService.getBoards().then(function(scc){
				defer.resolve(scc.data);
			})
		})

		return defer.promise;
	}
}