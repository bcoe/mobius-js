exports.BlogPost = MobiusModel.extend({
});
exports.BlogPost.date = {index: true, type: 'date'};
exports.BlogPost.title = {index: true, type: 'text'};
exports.BlogPost.body = {type: 'textarea'};