// BASE SETUP
var express 	= require('express');
var app     	= express();
var bodyParser 	= require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// TEMP DATA SOURCE
var boards = [];

// ROUTES FOR API
//============================================================
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'Hello world!'});
})


// '/boards' --------------------------------------------------
router.route('/boards')

	.get(function(req, res) {
		res.json(boards);
	})

	.post(function(req, res) {

		var board = createBoard(boards.length);
		boards.push(board);

		res.json(board);
	});

// '/boards/:board_id' ---------------------------------------
router.route('/boards/:board_id')

	.get(function(req, res) {
		res.json(boards[req.params.board_id]);
	});

// REGISTER ROUTES
app.use('/api', router);

// START SERVER
// ===========================================================
app.listen(port);
console.log('Server listning on port ' + port);


// LOGIC & HELP FUNCTIONS
// ===========================================================

var POS_MINE   = -2,
	POS_FLAGED = -1,
	POS_BLANK  = 0;
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
			board.data[row][col] = POS_BLANK;
		};
	};

	// Randomize mine placement
	var mines_placed = 0;
	while(mines_placed < board.num_mines) {
		var row = Math.floor((Math.random() * board.num_rows));
		var col = Math.floor((Math.random() * board.num_cols));

		// Place mine if square unoccupied
		if(board.data[row][col] != POS_MINE) {
			board.data[row][col] = POS_MINE;
			mines_placed++;

			// Recalculate surrounding squares,
			// start in the upper left corner 
			for (var diff_row = -1; diff_row <= 1; diff_row++) {
				if((row + diff_row) >= 0 && (row + diff_row) < board.num_rows) {
					for (var diff_col = -1; diff_col <= 1; diff_col++) {
						if((col + diff_col) >= 0 && (col + diff_col) < board.num_cols) {
							if(board.data[row + diff_row][col + diff_col] != POS_MINE) {
								board.data[row + diff_row][col + diff_col]++;
							}
						}
					};
				}
			};

		}
	}

	return board;
}