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
var resig = require('resig');
var sys = require('sys');
var helpers = require('helpers');
var mongodb = require('mobius-js/db/mongodb')

exports.ProcessingStack = resig.Class.extend( {
	processingStack: [],
	processCount: 0,
	maxProcessCount: 3000,
	init: function(databaseName) {
		var self = this; // Store reference to 'this' for closures.

		self.databaseName = databaseName;
		
		setTimeout(function() {
			self._processStack(self);
		}, 10);
		
		// Connect to mongodb.
		this.connect(); 		
		
/*		var self = this;
		
		this.databaseName = databaseName;
		setTimeout(function() {
			self._processStack(self);
		}, 5);
		
		this.connect(); 
		this.connect();      
		this.connect();      
		this.connect();      
		this.connect();      
		this.connect();      
		this.connect();      
		this.connect();      
		this.connect();      
		     
		this.create(
			{
				keys: ["meta", ['_id', 1], ['name', 1], ['age', 1]],
				data: [{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
		          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}],
				collectionName: 'blog'
			}, 
			function() {
				sys.puts('created thingy.')
			}
		);
		
		
		this.create(
			{
				keys: ["meta", ['_id', 1], ['name', 1], ['age', 1]],
				data: [{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
		          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}],
				collectionName: 'blog'
			}, 
			function() {
				sys.puts('created thingy.')
			}
		);
		
		
		this.create(
			{
				keys: ["meta", ['_id', 1], ['name', 1], ['age', 1]],
				data: [{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
		          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}],
				collectionName: 'blog'
			}, 
			function() {
				sys.puts('created thingy.')
			}
		);
		
		this.create(
			{
				keys: ["meta", ['_id', 1], ['name', 1], ['age', 1]],
				data: [{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
		          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}],
				collectionName: 'blog'
			}, 
			function() {
				sys.puts('created thingy.')
			}
		);
		
		this.render();*/
	},
	
	create: function(params, callback) {
		this.processingStack.push(['_create', params, callback]);
	},
	
	connect: function() {
		this.processingStack.push(['_connect', {}, function(){}]);
	},
	
	render: function() {
		this.processingStack.push(['_render', {}, function(){}])	
	},
	
	_create: function(params, callback) {
		mongodb.create(this.db, params, function() {
			callback();
		});
	},
	
	_connect: function(params, callback) {
		var self = this;
		mongodb.connect(this.databaseName, function(db) {
			self.db = db;
			callback();
		});
	},
	
	_render: function(params, callback) {
		sys.puts("rendering");
	},
	
	_processStack: function(self) {
		
		// Terminate processing after a set number of operations.
		if (this.processCount > this.maxProcessCount) {
			return;
		}
			
		var callMe = this.processingStack.shift();
		if (callMe) {
			this[callMe[0]].call(this, callMe[1], function(data) {
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
		
		this.processCount++; // Increment our process counter (used to terminate zombie processes).
	}
});