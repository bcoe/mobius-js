exports.BenjaminCoe = MobiusController.extend({
	index: function() {	
		var self = this;
		
		
		this.params['date'] = new Date();
		MobiusModel.BlogPost.create(this.params['BlogPost']);
		
		MobiusModel.BlogPost.find(
			{
			},// query
			{'date' : -1, 'title' : 1, 'body' : 1},// order
			function(results) {
				self.post = results[0];
			}// callback.
		);
	}
});