// LOGIC & HELP FUNCTIONS
// ===========================================================

/*
	The mine object has information in two steps. One is external (shown to the end-user) and one is internal (used by the API).
	var mine = {
		external: -3 to -1
		internal:  -1 to 8
	}
*/



var minesweeper = function(){
	var self = this;


	self.constants = {
		"num_cols" : 10,
		"num_mines" : 14,
		"num_rows" : 10,
		'POS_BLANK' : 0,
		'POS_FLAGGED' : -2,
		'POS_MINE' : -1,
		'POS_NOT_CLEARED' : -3,
		'POS_WRONG_FLAG' : -4,
		'STATUS_RUNNING' : 0,
		'STATUS_FINISHED' : 1,
		'STATUS_FAILED' : 2
	};	

	self.createBoard = function() {
		// Init board
		var board = {
			id: null,
			start_time: null,
			end_time: null,
			num_mines: self.constants.num_mines,
			rows: []
		};

		// Blanks everything
		for(var row = 0; row < self.constants.num_rows; row++) {
			board.rows[row] = {"mines": []};
			for (var col = 0; col < self.constants.num_cols; col++) {
				board.rows[row].mines[col] = {
					"external": self.constants.POS_NOT_CLEARED,
					"internal": self.constants.POS_BLANK
				}
			};
		};

		// Randomize mine placement
		var mines_placed = 0;
		while(mines_placed < board.num_mines) {
			var row = Math.floor((Math.random() * self.constants.num_rows));
			var col = Math.floor((Math.random() * self.constants.num_cols));

			// Place mine if square unoccupied
			if( board.rows[row].mines[col].internal != self.constants.POS_MINE ) {
				board.rows[row].mines[col].internal = self.constants.POS_MINE;
				mines_placed++;

				// Recalculate surrounding squares,
				// start in the upper left corner 
				for (var diff_row = -1; diff_row <= 1; diff_row++) {
					if((row + diff_row) >= 0 && (row + diff_row) < self.constants.num_rows) {
						for (var diff_col = -1; diff_col <= 1; diff_col++) {
							if((col + diff_col) >= 0 && (col + diff_col) < self.constants.num_cols) {
								if(board.rows[row + diff_row].mines[col + diff_col].internal != self.constants.POS_MINE) {
									board.rows[row + diff_row].mines[col + diff_col].internal++;
								}
							}
						};
					}
				};
			}
		}

		return board;
	}

	self.stripBoard = function(board){
		var new_board = {
			id: board.id,
			num_mines: board.num_mines,
			rows: []
		};

		for(var row = 0; row < board.rows.length; row++) {
			new_board.rows[row] = {"mines": []};
			for (var col = 0; col < board.rows[row].mines.length; col++) {
				new_board.rows[row].mines[col] = {
						"id": board.rows[row].mines[col].id,
						"value": board.rows[row].mines[col].external
					}
			};
		};

		return new_board;
	}

	self.stripBoards = function(boards){
		var temp_boards = [];

		for( var i = 0; i < boards.length; i++ ){
			temp_boards.push( self.stripBoard( boards[i] ));
		}

		return temp_boards;
	}

	self.solveMine = function(board, row, col){ //Recursive function to solve mine.
		if( row < 0 || row > self.constants.num_rows - 1 || 
			col < 0 || col > self.constants.num_cols - 1 ) // The base case. Out of bounds.
			return;

		if( board.status != 0 ) // Not on-going. Either solved or failed.
			return;

		if( board.rows[row].mines[col].external != self.constants.POS_NOT_CLEARED) // Second base case. Already solved or flagged.
			return;

		if( board.rows[row].mines[col].internal > 0 ){ // Sweep the tile
			board.rows[row].mines[col].external = board.rows[row].mines[col].internal; 
			
			return;
		} else if ( board.rows[row].mines[col].internal == self.constants.POS_MINE ) { // Tried to clear a spot with a mine. Set status to failed and show mines.
			self.clearBoard(board);			 
			
			return;
		} else if ( board.rows[row].mines[col].internal == 0 ) { // If is has no mine or no nearby mines, expand. We can do this recursively. 
			for (var diff_row = -1; diff_row <= 1; diff_row++) {	
				for (var diff_col = -1; diff_col <= 1; diff_col++) {
					if( diff_col != 0 || diff_row != 0){
						board.rows[row].mines[col].external = 0; // To stop this mine from being added several times and infinite loop.

						self.solveMine(board, row + diff_row, col + diff_col);
					}
				};
			};
		}
	}

	self.flagMine = function(board, row, col){
		if( row < 0 || row > self.constants.num_rows - 1 || 
			col < 0 || col > self.constants.num_cols - 1 || // Out of bounds 
			board.rows[row].mines[col].external >= self.constants.POS_MINE ) // Already sweeped or has mine.
			return;

		if( board.rows[row].mines[col].external == self.constants.POS_FLAGGED ) //Unflag it
			board.rows[row].mines[col].external = self.constants.POS_NOT_CLEARED;
		else //Flag it
			board.rows[row].mines[col].external = self.constants.POS_FLAGGED;
	}

	self.boardSweeped = function(board_id){

	}

	self.clearBoard = function(board){
		rowloop:
		for(var row = 0; row < board.rows.length; row++){

			colloop:
			for(var col = 0; col < board.rows[row].mines.length; col++){

				if( board.rows[row].mines[col].external == self.constants.POS_FLAGGED && 
					board.rows[row].mines[col].internal != self.constants.POS_MINE ) { // If it was wrongly flagged.
					
					board.rows[row].mines[col].external = self.constants.POS_WRONG_FLAG;
				
				} else if( ! ( board.rows[row].mines[col].external == self.constants.POS_FLAGGED && 
					board.rows[row].mines[col].internal == self.constants.POS_MINE ) ) { // If it wasn't flagged.
					board.rows[row].mines[col].external = board.rows[row].mines[col].internal;
				} // If it was rightly flagged, don't do anything. 

			}
		}

		board.end_time = Date.now();
		board.status = self.constants.STATUS_FAILED;
	}
}

module.exports = minesweeper;
