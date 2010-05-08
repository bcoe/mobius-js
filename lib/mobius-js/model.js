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
 * Description: The mobius model class.
 *
 */

// Dependencies.
var resig = require('resig');
var sys = require('sys');
var helpers = require('helpers');

MobiusModel = resig.Class.extend( {
	init: function(processingStack) {
		this.processingStack = processingStack;
		
		this.create(
		{
			keys: ["meta", ['_id', 1], ['name', 1], ['age', 1]],
			data: [{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
	          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}],
			collectionName: 'blog'
		});
	},
	
	create: function(params) {
		this.processingStack.create(params, function() {});
	}
});