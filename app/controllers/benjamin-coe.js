exports.BenjaminCoe = MobiusController.extend({
	index: function() {	
		var self = this;
		MobiusModel.BlogPost.create({
			title : 'Testing out the framework I have been building.',
			body : 'Test blog post body.',
			date : new Date()
		});
		
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