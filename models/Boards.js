var mongoose = require('mongoose');

var MineSchema = new mongoose.Schema({
	internal: Number,
	external: Number
})

var RowSchema = new mongoose.Schema({
	mines: [MineSchema]
})

var BoardsSchema = new mongoose.Schema({
	start_time: {type: Date, default: Date.now},
	end_time: Date,
	num_mines: Number,
	status: {type: Number, default: 0}, // 0 = ongoing, 1 = solved, 2 = failed
	rows: [RowSchema]
});

mongoose.model('Board', BoardsSchema);


/**
 Old structure
{
	id: Number,
	num_mines: Number,
	data: [  
		[
			{
				internal: Number, // The mines internal status (mine or 0,1,2,...) 
				external: Number  // The status of the mine to show the user. 
			} // Mine
		] // Row
	] // Data

}

**/