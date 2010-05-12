exports.Book = MobiusModel.extend({});

exports.Book.publicationDate = {
	index: true,
	type: 'date',
	validators: {
		date : {}
	},
	label: "Publication Date"
};

exports.Book.title = {
	index: true,
	type: 'text',
	validators: {
		size : {min: 5, max: 200}
	},
	label: "Book Title"
};

exports.Book.summary = {
	type: 'textarea',
	validators: {
		size : {min: 10, max: 500}
	}
};

exports.Book.isbn = {
	type: 'text',
	validators: {
		size : {min: 13, max: 13}
	},
	label: "ISBN #"
};