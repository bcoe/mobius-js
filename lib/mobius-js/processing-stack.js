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
 * Description: This class uses a stack to abstract heavily 
 * nested asynchronous programming away from a user of the framework.
 */

// Dependencies.
var resig = require('resig/resig');
var sys = require('sys');
var helpers = require('mobius-js/helpers/helpers');
var mongodb = require('mobius-js/db/mongodb')

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
ProcessingStack.prototype.init = function(dbConfiguration, callback) {
	var self = this; // Store reference to 'this' for closures.

	self.dbConfiguration = dbConfiguration;
	
	setTimeout(function() {
		self._processStack(self);
	}, 10);
	
	this.connect(callback);
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
		mongodb.create(self, params, callback);
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
		mongodb.createIndex(self, params, callback);
	}, params, callback]);
},

/**
 * Called by a model to place a connect operation on the stack.
 *
 * @param {function} callback function to execute once connection is complete.
 * @type void
 * @public
 */
ProcessingStack.prototype.connect = function(callback) {
	callback = callback || function(){}
	this.processingStack.push([function(self, params, callback) {
		mongodb.connect(self, function(db) {
			self.db = db;
			callback();
		});
	}, {}, callback]);
},

/**
 * Performs a hard reset of the Database connection.
 *
 * @param {function} callback function to execute once connection is complete.
 * @type void
 * @public
 */
ProcessingStack.prototype.reset = function(callback) {
	callback = callback || function(){}
	this.processingStack.push([function(self, params, callback) {
		
		mongodb.close(self, params, function() {
			mongodb.connect(self, function(db) {
				self.db = db;
				callback();
			});
		});
		
	}, {}, callback]);
},


/**
 * Called by a model to place a close operation on the stack.
 *
 * @type void
 * @public
 */
ProcessingStack.prototype.close = function() {
	this.processingStack.push([function(self, params, callback) {
		mongodb.close(self, params, callback);
	}, {}, function(){}])
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
		mongodb.find(self, params, callback);
	}, params, callback])
},

/**
 * Called by a MobiusController to queue up the rendering of a view,
 * so that it is performed after all other database operations.
 *
 * @param {object} parameters needed by Express' render function.
 * @param {function} callback the function that actually performs rendering.
 * @type void
 * @public
 */
ProcessingStack.prototype.render = function(params, callback) {
	this.processingStack.push([function(self, params, callback) {
		callback(params);
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