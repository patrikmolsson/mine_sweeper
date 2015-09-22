app.filter('minesLeft', function(){
	return function(board){
		var maxMines = board.num_mines,
			flaggedMines = 0;

		for( var row = 0; row < board.rows.length; row++){
			for( var col = 0; col < board.rows[row].mines.length; col++){
				if( board.rows[row].mines[col].value == '-2')
					flaggedMines++;
			}
		}
			
		return maxMines - flaggedMines;
	}
})