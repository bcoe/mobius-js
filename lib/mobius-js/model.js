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
 * Update an existing model.
 *
 * @param {object} restrictTemp Key value pairs representing the models to select.
 * @param {object} paramsTemp Key value pairs representing model to create.
 * @throws ValidationException if model cannot be validated.
 * @type void
 * @public
 */
MobiusModel.prototype.update = function(restrictTemp, paramsTemp) {	
	// If restrictTemp is not indicated assume we are updating
	// this specific instance of the model.
	if (!paramsTemp) { // restrictTemp and paramsTemp should switch ordering.
		var temp = restrictTemp;
		restrictTemp = {};
		paramsTemp = temp;
		
		// Map instance variables onto restrictTemp.
		for (var key in this.constructor) {
			if (key != 'constructor' && key != 'extend' && key != 'include') {
				restrictTemp[key] = this[key];
			}
		}
	}
	
	var errors = this.validate(paramsTemp, true);
	if (errors.length > 0) {
		throw {
			type : "ValidationException",
			errors : errors
		}
	}
	
	params = {};
	params['values'] = paramsTemp;
	params['restrict'] = restrictTemp;
	params['collectionName'] = this.className;
	
	this.processingStack.update(params);
},

/**
 * Remove an existing model.
 *
 * @param {object} restrictTemp Key value pairs representing the models to select.
 * @throws ValidationException if model cannot be validated.
 * @type void
 * @public
 */
MobiusModel.prototype.remove = function(restrictTemp) {	
	// If restrictTemp is not indicated assume we are updating
	// this specific instance of the model.
	if (!restrictTemp) { // restrictTemp and paramsTemp should switch ordering.
		restrictTemp = {};
				
		// Map instance variables onto restrictTemp.
		for (var key in this.constructor) {
			if (key != 'constructor' && key != 'extend' && key != 'include') {
				restrictTemp[key] = this[key];
			}
		}
	}
	
	params = {};
	params['restrict'] = restrictTemp;
	params['collectionName'] = this.className;
	
	this.processingStack.remove(params);
},

/**
 * Validate parameters.
 *
 * @param {object} params a set of key value pairs to validate from the POST.
 * @param {bool} ignoreUndefined should we throw an exception if a key is not set? (Update vs. Create)
 * @type array
 * @return an array populated with any validation errors that occurred.
 */
MobiusModel.prototype.validate = function(params, ignoreUndefined) {
	var errors = [];
	for (var key in this.constructor) {
		if (key != 'constructor' && key != 'extend' && key != 'include') {
			if (this.constructor[key]['validators']) {
				for (var validatorKey in this.constructor[key]['validators']) {
					if (params[key] != undefined || !ignoreUndefined) {
						errors = validators[validatorKey](params[key], key, this.constructor[key]['validators'][validatorKey], errors);
					}
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
	// This function behaves differently depending on the
	// parameters.
	if (typeof query == 'function') {
		callback = query;
		query = {};
		sort = {};
	} else
	
	if (typeof sort == 'function') {
		callback = sort;
		sort = {};
	}

	params = {};
	params['query'] = query;
	
	// Map the sort hash onto an array. This is done because the
	// mongodb connector accepts sorting parameters, in I feel
	// a wacky fasion.
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