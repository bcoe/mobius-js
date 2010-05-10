exports.BlogPost = MobiusModel.extend({});

exports.BlogPost.date = {
	index: true,
	type: 'date'
};

exports.BlogPost.title = {
	index: true,
	type: 'text',
	validators: {
		size : {min: 3, max: 100}
	}
};

exports.BlogPost.body = {
	type: 'textarea',
	validators: {
		size : {min: 3, max: 100, msg : "hot damn! :field"}
	}
};

exports.BlogPost.future = {
	type: 'date',
};