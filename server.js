// BASE SETUP
var express 	= require('express');
var app     	= express();
var bodyParser 	= require('body-parser');

const 	api_version = 1,
		port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ROUTES FOR API
//============================================================
var router = express.Router();

router.route('/')
	.get(function(req, res) {
		res.json({ message: 'Hello world!'});
	});


// '/boards' --------------------------------------------------

// TEMP DATA SOURCE
var boards = [];

router.route('/boards')

	.get(function(req, res) {
		var temp_boards = [];

		for(var i = 0; i < boards.length; i++){
			temp_boards.push(stripBoard(boards[i]));
		}

		res.json(temp_boards);
	})

	.post(function(req, res) {

		var board = createBoard(boards.length);
		boards.push(board);

		res.json(board);
	});

// '/boards/:board_id' ---------------------------------------
router.route('/boards/:board_id')

	.get(function(req, res) {
		res.json(stripBoard(boards[req.params.board_id]));
	});

// REGISTER ROUTES
// /api/v[x]
app.use('/api/v' + api_version, router);

// START SERVER
// ===========================================================
app.listen(port);
console.log('Server listening on port ' + port);

// LOGIC & HELP FUNCTIONS
// ===========================================================

/*
	The mine object has information in two steps. One is external (shown to the end-user) and one is internal (used by the API).
	


	var mine = {
		external: -3 to -1
		internal:  -1 to 8
	}
*/

const 	POS_BLANK = 0,
		POS_MINE = -1,
		POS_FLAGGED = -2,
		POS_NOT_CLEARED = -3;
	

function createBoard(board_id) {

	// Init board
	var board = {
		id: board_id,
		num_cols:  10,
		num_rows:  10,
		num_mines: 10,
		data: []
	};

	// Blanks everything
	for(var row = 0; row < board.num_rows; row++) {
		board.data[row] = [];
		for (var col = 0; col < board.num_cols; col++) {
			board.data[row][col] = {
				"external": POS_NOT_CLEARED,
				"internal": POS_BLANK
			}
		};
	};

	// Randomize mine placement
	var mines_placed = 0;
	while(mines_placed < board.num_mines) {
		var row = Math.floor((Math.random() * board.num_rows));
		var col = Math.floor((Math.random() * board.num_cols));

		// Place mine if square unoccupied
		if(board.data[row][col] != POS_MINE) {
			board.data[row][col].internal = POS_MINE;
			mines_placed++;

			// Recalculate surrounding squares,
			// start in the upper left corner 
			for (var diff_row = -1; diff_row <= 1; diff_row++) {
				if((row + diff_row) >= 0 && (row + diff_row) < board.num_rows) {
					for (var diff_col = -1; diff_col <= 1; diff_col++) {
						if((col + diff_col) >= 0 && (col + diff_col) < board.num_cols) {
							if(board.data[row + diff_row][col + diff_col].internal != POS_MINE) {
								board.data[row + diff_row][col + diff_col].internal++;
							}
						}
					};
				}
			};
		}
	}

	return board;
}

function stripBoard(board){
	var new_board = {
		id: board.id,
		num_cols: board.num_cols,
		num_rows: board.num_rows,
		num_mines: board.num_mines,
		data: []
	};

	for(var row = 0; row < new_board.num_rows; row++) {
		new_board.data[row] = [];
		for (var col = 0; col < new_board.num_cols; col++) {
			new_board.data[row][col] = board.data[row][col].external;
		};
	};

	return new_board;
}

function solveMine(board_id, row, col){ //Recursive function to solve mine.
	if( row < 0 || row > boards[board_id].num_rows - 1 || 
		col < 0 || col > boards[board_id].num_cols - 1 ) // The base case. Out of bounds.
		return;

	if( boards[board_id][row][col].internal > 0 || boards[board_id][row][col].internal == -1 ) // Solve the mine, which will return the mine or the number of nearby mines.
		boards[board_id][row][col].external = boards[board_id][row][col].internal;
	else { // If is has no mine or no nearby mines, expand. We can do this recursively. 
		for (var diff_row = -1; diff_row <= 1; diff_row++) {	
			for (var diff_col = -1; diff_col <= 1; diff_col++) {
				if( diff_col != 0 || diff_row != 0)
					solveMine(board_id, row + diff_row, col + diff_col);
			};
		};
	}
}

function boardSweeped(board_id){

}

