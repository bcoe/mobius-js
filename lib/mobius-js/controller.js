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
 * Description: This is the base controller inherited by all other 
 * controllers in the Mobius framework.
 */

// Dependencies.
var resig = require('resig/resig');
var sys = require('sys');
var helpers = require('mobius-js/helpers/helpers');
var webHelpers = require('mobius-js/helpers/web-helpers')

/**
 * A Mobius controller inherits from a Resig class.
 */
MobiusController = resig.Class.extend( {
	cookies: {}
});

/**
 * The base class for all controllers.Do not access this method
 * directly, instead use MobiusController.extend({});
 *
 * @param {object} mobiusProcessingStack provides a synchronous stack.
 * @type void
 * @public
 */
MobiusController.prototype.init = function(mobiusProcessingStack) {
	this.mobiusProcessingStack = mobiusProcessingStack;
},
	
/**
 * Called when a route is hit that matches this controller.
 *
 * @param {string} action the action within the controller to call.
 * @param {object} express the Express DSL object.
 * @type void
 * @private
 */
MobiusController.prototype.execute = function(controller, action, express) {		
	this.action = action || 'index';

	// Index is a special case.		
	this.renderAction = this.action;
	if (this.renderAction == 'index') {
		this.renderAction = controller;
	}
	
	this.express = express;
	this._loadParams();
	this._loadCookies();
	this._invokeAction(this.action);
	this.mobiusProcessingStack.render({
			self : this,
			view : this.renderAction + '.html.mejs', 
			options : {},
		}, this._render);
},

/**
 * Thin wrapper for the express object. Allows classes that extend
 * the MobiusController to call this.render.
 *
 * @param {string} view the view file to render.
 * @param {object} options options for the express object's render function.
 * @type void
 * @public
 */
MobiusController.prototype.render = function(view, options) {
	this.mobiusProcessingStack.render({
		self : this,
		view : view,
		options : options,
	}, this._render);		
},

/**
 * We must ensure that rendering is the last action that takes place
 * when calling the mobius controller. For this reason, the render step
 * is dispatched to the mobius processing stack and actually performed
 * with this callback.
 *
 * @param {object} params
 * @type void
 * @private
 */
MobiusController.prototype._render = function(params) {
	params['self']._setCookies();
	
	params['options']['locals'] = params['self']._getLocals();
	
	// Add some helper functions to locals.
	params['options']['locals']['partial'] = function(partial) {
		return params['self'].express.partial(partial);
	}
	
	params['self'].express.render(params['view'], params['options']);
},

/**
 * Run an action within this controller.
 * a sanity check is performed to make sure the action actually exists.
 *
 * @param {string} action
 * @type void
 * @private
 */
MobiusController.prototype._invokeAction = function(action) {
	// If an action has hyphens in its name they should be 
	// removed and converted to camel case.
	action = helpers.stringToActionName(action, '-');
	
	if (typeof this[action] == 'function') {
		this[action].call(this) // Call the action of this controller.	
	} else {
		this.express.redirect('/public/errors/action-not-found.html');
	}
},

/**
 * Map instance variables for this class so that they can be accessed from within the template.
 *
 * @type {object}
 * @return All this classes instance variables mapped onto an object.
 * @private
 */
MobiusController.prototype._getLocals = function() {
	var locals = {};
	for (var key in this) {
		if (typeof this[key] != 'function') {
			locals[key] = this[key];
		}
	}
	return locals;
},

/**
 * Push the current cookies into the local cookie array.
 *
 * @type void
 * @private
 */
MobiusController.prototype._loadCookies = function() {
	for (var key in this.express.cookies) {
		this.cookies[key] = this.express.cookies[key];
	}
}

/**
 * Update all cookies that have been set during this
 * session.
 *
 * @type void
 * @private
 */
MobiusController.prototype._setCookies = function() {
	for (var key in this.cookies) {
		this.express.cookie(key, this.cookies[key]);
	}
}

/**
 * Merge get and post parameters into the same struct.
 * call helper functions to create arrays from magic 
 * post syntax.
 *
 * @type void
 * @private
 */
MobiusController.prototype._loadParams = function() {
	this.params = {};
			
	// Merge get and post parameters into a single struct.
	if (this.express.params.get && this.express.params.post) {
		// Merge the get and post parameters.
		for (var key in this.express.params.post) {
			this.express.params.get[key] = this.express.params.post[key];
		}
		this.params = this.express.params.get;
	} else 
	
	if (this.express.post) {
		this.params = this.express.params.post;
	} else
	
	if (this.express.get) {
		this.params = this.express.params.get;
	}
}