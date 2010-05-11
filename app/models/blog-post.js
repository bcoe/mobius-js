exports.BlogPost = MobiusModel.extend({});

exports.BlogPost.date = {
	index: true,
	type: 'date',
	validators: {
		date : {}
	},
	label: "Publication Date"
};

exports.BlogPost.title = {
	index: true,
	type: 'text',
	validators: {
		size : {min: 3, max: 100}
	},
	label: "Title"
};

exports.BlogPost.body = {
	type: 'textarea',
	validators: {
		size : {min: 3, max: 100, msg : "hot damn! :field"}
	}
};

exports.BlogPost.future = {
	type: 'date',
	validators: {
		date : {}
	},
	label: "Date in Future"
};