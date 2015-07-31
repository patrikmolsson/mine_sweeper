app.controller('BoardController', ['$scope', 'board', 'mineService', function($scope, board, ms){
	var solving = true;

	$scope.board = board;

	$scope.isSolving = function(){
		return solving;
	}

	$scope.solving = function(bool){
		solving = bool;
	}

	$scope.mineClicked = function(row, col){
		var action = solving ? 1 : 0;

		ms.clickMine(row, col, action).then(function(res){
			$scope.board = res.data;
		})
	}
}])