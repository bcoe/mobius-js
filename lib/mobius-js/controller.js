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
 * Description: This is the main controller used by the 
 * mobius FrameWork.
 */

// Dependencies.
var resig = require('resig');
var sys = require('sys');
var helpers = require('helpers');

MobiusController = resig.Class.extend( {	
	/**
	 * Called when a URL is hit that matches this controller.
	 *
	 * @param {string} action
	 * @param {object} express.
	 * @return {void}
	 * @api public
	 */
	execute: function(controller, action, express) {
		this.action = action || 'index';

		// Index is a special case.		
		this.renderAction = this.action;
		if (this.renderAction == 'index') {
			this.renderAction = controller;
		}
		
		this.express = express;
		this._loadParams();
		this._invokeAction(this.action);		
		this.render(this.renderAction + '.html.ejs', {locals: this._getLocals()});
	},
	
	/**
	 * Thin wrapper for the express renderer. Allows classes that extend
	 * the MobiusController to call this.render.
	 *
	 * @param {string} view
	 * @param {object} options
	 * @param {function} callback
	 * @return void
	 */
	render: function(view, options, callback) {
		this.express.render(view, options, callback);
	},
	
	/**
	 * Run an action within this controller.
	 * a sanity check is performed to make sure the action actually exists.
	 *
	 * @param {string} action
	 * @return {void}
	 * @api private
	 */
	_invokeAction: function(action) {
		// If an action has hyphens in its name they should be 
		// removed and converted to camel case.
		action = helpers.stringToActionName(action, '-');
		
		if (typeof this[action] == 'function') {
			eval('this.' + action + "()"); // Call the action of this controller.	
		} else {
			this.express.redirect('/public/errors/action-not-found.html');
		}
	},
	
	/**
	 * Map instance variables for this class so that they can be accessed
	 * from within the template.
	 *
	 * @param {void}
	 * @return {object}
	 * @api private
	 */
	_getLocals: function() {
		var locals = {};
		for (var key in this) {
			if (typeof this[key] != 'function') {
				locals[key] = this[key];
			}
		}
		return locals;
	},
	
	/**
	 * Merge get and post parameters into the same struct.
	 * call helper functions to create arrays from magic 
	 * post syntax.
	 *
	 * @param {void}
	 * @return {void}
	 * @api private
	 */
	_loadParams: function() {		
		// Merge get and post parameters into a single struct.
		if (this.express.params.get && this.express.params.post) {
			// Merge the get and post parameters.
			for (var key in this.express.params.post) {
				this.express.params.get[key] = express.params.post[key];
			}
			this.params = this.express.params.get;
		} else 
		
		if (this.express.post) {
			this.params = this.express.params.post;
		} else
		
		if (this.express.get) {
			this.params = this.express.params.get;
		} else {
			this.params = {};
		}
	}
});