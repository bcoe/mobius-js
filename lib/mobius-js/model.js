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
 * Description: The mobius model class. Some parameters are set on
 * this class' prototype in bootstrap.js which you should also read.
 */

// Dependencies.
var resig = require('resig/resig');
var helpers = require('mobius-js/helpers/helpers');
var validators = require('mobius-js/validators/validators');

/**
 * A Mobius model inherits from a Resig class.
 */
MobiusModel = resig.Class.extend( {
});

/**
 * Base class for all models. Provides CRUD functionality. As of right now, 
 * MongoDB provides the persistent storage. Note: Do not access this method
 * directly, instead use MobiusModel.extend({});
 *
 * @param {object} processingStack synchronous processing stack.
 * @param {class} constructor constructor which can be used to create new instance of this class.
 * @type void
 * @public
 */
MobiusModel.prototype.init = function(processingStack, constructor) {
	this.processingStack = processingStack;
	this.constructor = constructor;
},

/**
 * Map parameters onto a new instance of this class.
 *
 * @param {object} params key value pairs of instance variables.
 * @type void
 * @public
 */
MobiusModel.prototype.loadParameters = function(params) {
	for (var key in params) {
		this[key] = params[key];
	}
}

/**
 * Close the database connection.
 * 
 * @type void
 * @public
 */
MobiusModel.prototype.close = function() {
	this.processingStack.close();
}

/**
 * Create a new model.
 *
 * @param {object} paramsTemp Key value pairs representing model to create.
 * @throws ValidationException if model cannot be validated.
 * @type void
 * @public
 */
MobiusModel.prototype.create = function(paramsTemp) {
	var errors = this.validate(paramsTemp);
	if (errors.length > 0) {
		throw {
			type : "ValidationException",
			errors : errors
		}
	}
	
	params = {};
	params['values'] = paramsTemp;
	params['collectionName'] = this.className;
	this.processingStack.create(params);
},

/**
 * Validate parameters.
 */
MobiusModel.prototype.validate = function(params) {
	var errors = [];
	for (var key in this.constructor) {
		if (key != 'constructor' && key != 'extend' && key != 'include') {
			if (this.constructor[key]['validators']) {
				for (var validatorKey in this.constructor[key]['validators']) {
					errors = validators[validatorKey](params[key], key, this.constructor[key]['validators'][validatorKey], errors);
				}
			}
		}
	}
	return errors;
},

/**
 * Called automatically in the bootstrapping process, creates indexes for this model.
 *
 * @param {object} params A structure representing MongoDB indexes.
 * @type void
 * @public
 */
MobiusModel.prototype.createIndex = function(params) {
	params['collectionName'] = this.className;
	this.processingStack.createIndex(params, function() {});
},

/**
 * Perorm a query on the database and call the closure provided with the results of the query.
 *
 * @param {object} query A database query in MongoDB format.
 * @param {object} order An order for results in MongoDB format.
 * @param {function} callback This is called with an array containing the results of find.
 * @type void
 * @public
 */
MobiusModel.prototype.find = function(query, sort, callback) {
	params = {};
	params['query'] = query;
	
	// Map the sort hash onto an array.
	params['sort'] = {};
	params['sort']['sort'] = [];
	for (var key in sort) {
		var temp = [key, sort[key]];
		params['sort']['sort'].push(temp);
	}
	
	// Add the class name into the parameters.
	params['collectionName'] = this.className;
	
	// We need to intercept the results and map them onto
	// an instance of this class.
	var self = this;
	this.processingStack.find(params, function(results) {
		temp = [];
		for (var key in results) {
			var c = new self.constructor(self.processingStack, self.constructor);
			c.loadParameters(results[key]);
			temp.push(c);
		}
		callback(temp);
	});
}