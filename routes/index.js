var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	api_version = 1;
	api_string = '/api/v' + api_version + '/';

var Board = mongoose.model('Board');

var minesweeper_api = require('../minesweeper'),
	minesweeper = new minesweeper_api();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*********** REST API PATHS *******/

// '/boards' ---------------------------------
// Creating new boards, and fetching all boards.
router.route( api_string + 'boards' )
	.get(function(req, res) {
		Board.find(function(err, boards, next){
			if(err)
				return next(err);

			res.json(minesweeper.stripBoards(boards));
		})
	})

	.post(function(req, res, next) {
		var board = new Board(minesweeper.createBoard());

		board.save(function(err, board){
			if( err )
				return next(err);

			res.json(minesweeper.stripBoard(board));
		});
	});

// '/boards/:board_id' ---------------------------------------
// Fetching specific board, and deleting.
router.route( api_string + 'boards/:board' )
	.get(function(req, res) {
		res.json(minesweeper.stripBoard(req.board));
	})

	.delete(function(req, res, next) {
		req.board.remove();

		res.json("Success");
	});


// '/boards/:board_id/:row/:col/:action' ---------------
// Actions:	0 = flag,
//			1 = solve
router.route( api_string + 'boards/:board/:row/:col/:action' )
	.put(function(req, res, next){
		var row = parseInt(req.params.row),
			col = parseInt(req.params.col);

		switch(req.params.action){
			case "0": //Flag
				minesweeper.flagMine(req.board, row, col);
				break;
			case "1": //Solve
				minesweeper.solveMine(req.board, row, col);
				break;
		};

		req.board.save(function(err){
			if(err) 
				return next(err);
			else
				res.json(minesweeper.stripBoard(req.board));
		});
	});

router.param('board', function(req, res, next, id) {
	var query = Board.findById(id);

	query.exec(function (err, board){
		if (err) { return next(err); }
		if (!board) { return next(new Error('can\'t find board')); }

		req.board = board;
		return next();
	});
});

module.exports = router;
