var sys = require('sys');
exports.BlogPost = MobiusController.extend({
	index: function() {	
		var self = this;
		
		if (this.params['BlogPost']) {
			try {
				MobiusModel.BlogPost.create(this.params['BlogPost']);
			} catch (e) {
				for (var key in e.errors) {
					sys.puts(e.errors[key]['msg']);
				}
			}
		}
		
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