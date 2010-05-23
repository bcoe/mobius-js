/**
 * Mobius-JS
 *                   /\   \ 
 *                  /  \   \          
 *                 /    \   \
 *                /      \   \
 *               /   /\   \   \
 *              /   /  \   \   \
 *             /   /    \   \   \
 *            /   /    / \   \   \
 *           /   /    /   \   \   \
 *          /   /    /---------'   \
 *         /   /    /_______________\
 *         \  /                     /
 *          \/_____________________/                   
 *
 * Benjamin Coe (BenjaminCoe.com) - MIT Licensed.
 *
 * Description: This class is used by models on the client-side of mobius
 * to exose AJAX model operations.
 */

/**
 * A Mobius processing-stack inherits from a Resig class.
 */
var ProcessingStack = resig.Class.extend( {
	processingStack: []
});

/**
 * Synchronous processing stack abstracts away asynchronous behavior.
 * Note: Do not access this method directly, instead use ProcessingStack.extend({});
 *
 * @type void
 * @public
 */
ProcessingStack.prototype.init = function() {
	var self = this; // Store reference to 'this' for closures.
	
	setTimeout(function() {
		self._processStack(self);
	}, 10);	
},

/**
 * Called by a model to place a create operation on the stack.
 *
 * @param {object} params key value pairs for creating a new model.
 * @param {function} callback function to execute upon this operations completion.
 * @type void
 * @public
 */
ProcessingStack.prototype.create = function(params, callback) {
	callback = callback || function() {};
	this.processingStack.push([function(self, params, callback) {

		$.ajax({
			url: params.route,
			dataType: 'json',
			data: params.values,
			success: callback,
			type: 'POST'
		});

	}, params, callback]);
},

/**
 * Called by a model to place an update operation on the stack.
 *
 * @param {object} params key value pairs for creating a new model.
 * @param {function} callback function to execute upon this operations completion.
 * @type void
 * @public
 */
ProcessingStack.prototype.update = function(params, callback) {
	callback = callback || function() {};
	this.processingStack.push([function(self, params, callback) {

	}, params, callback]);
},


/**
 * Called by a model to place a remove operation on the stack.
 *
 * @param {object} params key value pairs for creating a new model.
 * @param {function} callback function to execute upon this operations completion.
 * @type void
 * @public
 */
ProcessingStack.prototype.remove = function(params, callback) {
	callback = callback || function() {};
	this.processingStack.push([function(self, params, callback) {

	}, params, callback]);
},

/**
 * Called by a model to place an operation on the stack which initializes model indexes.
 *
 * @param {object} params key value pairs for model index creation operation.
 * @param {function} callback function to execute upon this operations completion.
 * @type void
 * @public
 */
ProcessingStack.prototype.createIndex = function(params, callback) {
	callback = callback || function() {};
	this.processingStack.push([function(self, params, callback) {

	}, params, callback]);
},

/**
 * A stack operation that returns models from the database as a parameter
 * to the callback provided.
 *
 * @param {object} Parameters for restricting and sorting the models returned from the DB.
 * @param {function} callback function to return all models retrieved to. 
 * @type void
 * @public
 */
ProcessingStack.prototype.find = function(params, callback) {
	this.processingStack.push([function(self, params, callback) {

	}, params, callback])
},

/**
 * Consumes from the processingStack and performs asynchronous operations
 * in a synchronous fashion.
 *
 * @param {object} self a reference to the processing stack.
 * @type void
 * @private
 */
ProcessingStack.prototype._processStack = function(self) {	
	var callMe = self.processingStack.shift();
	if (callMe) {
		callMe[0](self, callMe[1], function(data) {
			callMe[2](data);
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}); // Call the action of this controller.
	} else {
		setTimeout(function() {
			self._processStack(self);
		}, 10);
	}
}
exports.ProcessingStack = ProcessingStack;