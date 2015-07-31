var app = angular.module('mineSweeper', ['ngRoute']);

app.controller('MainController', ['$scope', 'mineService', 'boards', function($scope, mineService, boards_req){
	$scope.boards = boards_req.data;

	$scope.addBoard = function(){
		mineService.addBoard().then(function(scc){
			$scope.boards = scc;
		})
	}

	$scope.removeBoard = function(id){
		mineService.removeBoard(id).then(function(scc){
			$scope.boards = scc;
		})
	}
}]);