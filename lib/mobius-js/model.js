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
var sys = require('sys');
var resig = require('resig/resig');
var helpers = require('mobius-js/helpers/helpers');

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
 * @type void
 * @public
 */
MobiusModel.prototype.init = function(processingStack) {
	this.processingStack = processingStack;
},

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
	params = {};
	params['values'] = paramsTemp;
	params['collectionName'] = this.className;
	this.processingStack.create(params);
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
	
	params['collectionName'] = this.className;
	this.processingStack.find(params, callback);
}