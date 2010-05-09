exports.Blog = MobiusController.extend({
	index: function() {
		this.title = "Blog";
		this.generatedFile = "app/controllers/blog.js";
	}
});