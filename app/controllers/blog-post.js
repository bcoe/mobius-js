var sys = require('sys');
exports.BlogPost = MobiusController.extend({
	index: function() {	
		var self = this;
		
		if (this.params['BlogPost']) {
			try {
				MobiusModel.BlogPost.update(ObjectID.createFromHexString(this.params['BlogPost']['_id']), this.params['BlogPost']);
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
	},
	
	create: function() {
		var payload = {success : 'true'}
		
		if (this.params) {
			try {
				MobiusModel.BlogPost.update({_id : this.params._id}, this.params);
			} catch (e) {
				sys.puts(e);
				for (var key in e.errors) {
					sys.puts(e.errors[key].msg);
				}
			}
		}
		
		// Check whether we should return a JSON payload.
		for (var key in this.accepts) {
			if (this.accepts[key] == 'application/json') {
				this.render_text(JSON.encode(payload));
			}
		}
	}
});