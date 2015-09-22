app.filter('difference', function($filter){
	return function(start, end){
		var start_time = new Date(start).getTime(),
			end_time,
			difference;

		if( end != null ){
			end_time = new Date(end).getTime();

			difference = end_time - start_time;
		} else {
			difference = Date.now() - start_time;
		}

		difference /= 1000;

		return (difference > 999 ? '999...' : Math.round(difference));
	}
})