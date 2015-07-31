app.config(function($routeProvider){
	$routeProvider
		.when('/boards/:board', {
			templateUrl: '/templates/board.html',
			controller: 'BoardController',
			resolve: {
				"board": function(mineService, $route){
					return mineService.getBoard($route.current.params.board);
				}
			}
		})

		.when('/', {
			templateUrl: '/templates/front.html',
			controller: 'MainController',
			resolve: {
				"boards": function(apiService){
					return apiService.getBoards();
				}
			}
		})

		.otherwise('/');
})