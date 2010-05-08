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
 * Description: The mobius model class. See bootstrap.js for
 *				some of the magic already injected into this class.
 */

// Dependencies.
var sys = require('sys');
var resig = require('resig/resig');
var helpers = require('mobius-js/helpers/helpers');

MobiusModel = resig.Class.extend( {
	init: function(processingStack) {
		this.processingStack = processingStack;
	},
	
	create: function(paramsTemp) {
		params = {};
		params['values'] = paramsTemp;
		params['collectionName'] = this.className;
		this.processingStack.create(params, function() {});
	},
	
	createIndex: function(params) {
		params['collectionName'] = this.className;
		this.processingStack.createIndex(params, function() {});
	},
	
	find: function(paramsTemp, callback) {
		params = {};
		params['query'] = paramsTemp;
		params['collectionName'] = this.className;
		this.processingStack.find(params, callback);
	},
	
	close: function() {
		this.processingStack.close();
	}
});