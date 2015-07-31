app.service('apiService', ['$q', '$http', function($q, $http){
	return new ApiService($q, $http);
}]);

function ApiService($q, $http){
	this.api_url = "http://localhost:3000/api/v1/";

	this.getBoards = function(){
		return $http.get(this.api_url + "boards");
	}

	this.getBoard = function(id){
		return $http.get(this.api_url + "boards/" + id);
	}

	this.clickMine = function(board, row, col, action){
		return $http.put(this.api_url + "boards/" + board + "/" + row + "/" + col + "/" + action);
	}

	this.addBoard = function(){
		return $http.post(this.api_url + "boards");
	}

	this.removeBoard = function(id){
		return $http.delete(this.api_url + "boards/" + id);
	}
}