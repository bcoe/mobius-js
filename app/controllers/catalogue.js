exports.Catalogue = MobiusController.extend({
	index: function() {
		var self = this;
		
		if (this.params['Book']) {
			try {
				MobiusModel.Book.create(this.params['Book']);
			} catch (e) {
				for (var key in e.errors) {
				}
			}
		}
				
		MobiusModel.Book.find(
			{
			},// query
			{'publicationDate' : -1, 'title' : 1, 'summary' : 1},// order
			function(results) {
				self.book = results[0];
			}// callback.
		);
	}
});