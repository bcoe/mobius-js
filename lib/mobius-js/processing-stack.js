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

exports.ProcessingStack = resig.Class.extend( {
	processingStack: [],
	
	init: function(dbConfiguration) {
		var self = this; // Store reference to 'this' for closures.

		self.dbConfiguration = dbConfiguration;
		
		setTimeout(function() {
			self._processStack(self);
		}, 10);
		
		// Connect to mongodb.
		this.connect();
	},
	
	create: function(params, callback) {
		this.processingStack.push([function(self, params, callback) {
			mongodb.create(self, params, callback);
		}, params, callback]);
	},
	
	createIndex: function(params, callback) {
		this.processingStack.push([function(self, params, callback) {
			mongodb.createIndex(self, params, callback);
		}, params, callback]);
	},
	
	connect: function() {
		this.processingStack.push([function(self, params, callback) {
			mongodb.connect(self.dbConfiguration, function(db) {
				self.db = db;
				callback();
			});
		}, {}, function(){}]);
	},
	
	close: function() {
		this.processingStack.push([function(self, params, callback) {
			mongodb.close(self, params, callback);
		}, {}, function(){}])
	},
	
	find: function(params, callback) {
		this.processingStack.push([function(self, params, callback) {
			mongodb.find(self, params, callback);
		}, params, callback])
	},
	
	render: function(params, callback) {
		this.processingStack.push([function(self, params, callback) {
			callback(params);
		}, params, callback])
	},
	
	_processStack: function(self) {
			
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
});