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
 * Description: The client side mobius object provides access
 * to shared validators, models, and helpers on the browser-side.
 */

// Some data is injected in the global scope to make object
// sharing between client and server easier. Doing this should
// be kept to a minimum.

// Mock out the 'exports' object used server-side.
var exports = {};
var resigConstructor = {}; // Mock out the constructor for a new resig class.
var processingStack = {}; // Client-side processing stack. 

// Lookup table for model constructors once they are loaded.
var modelConstructors = {};

/**
 * Mocks out the require() function used on the server-side.
 *
 * @param {string} path path to dependent library.
 */
function require(path) {
	var libs = {
		'resig/resig' : resigConstructor,
		'mobius-js/validators/validators' : Validators
	}
	return libs[path];
}

// The entry-point for the browser-side mobius library.
MobiusClient = {};
MobiusClient.ready = function(callback) {
	MobiusClient.loadedCallback = callback;
}

/**
 * On document ready, we lazy load dependencies and callback
 * to the listener registered with mobius.
 */
$(document).ready(function() {

	// Lazy load core dependencies.
	exports = {};
	LazyLoad.loadOnce([
		'/lib/resig/resig.js',
	], function() {
	
		// Store the resig  simple class constructor.
		resigConstructor.Class = exports.Class;
			
		// Load the main model class.
		LazyLoad.loadOnce([
			'/lib/model.js',
		], function() {	
			LazyLoad.loadOnce([
				'/lib/client-processing-stack.js'
			], function() {
				processingStack = new exports.ProcessingStack();
				
				// Once we have the dependent classes loaded 
				// We can safely initialize the client-side mobius object.
				initMobiusClient();
			});
		});	
	});

	// Load validators.
	LazyLoad.loadOnce([
		'/validators/validators.js',
	], function() {
	});
});

// Called when all bootstrapping steps are complete.
function initMobiusClient() {
	
	/**
 	 *
	 */
	var Client = Class.extend({
		forms: {
			'create' : {},
			'update' : {},
			'delete' : {},
			'find' : {}
		},// A  hash of forms handled by this client.
		
		init: function() {
		},
		
		loadModel: function(modelFile) {
	
			// load in a dependent model.
			exports = {};
			LazyLoad.loadOnce([
				'/models/' + modelFile
			], function() {
				for (var key in exports) {
					modelConstructors[key] = exports[key];
				}
			});

		},
		
		extractParameters: function($form, postFormat) {
			// Copy the parameters from the form into an associative array.
			var params = {};
			$form.find(':input').each(function(k, v) {
				var $input = $(this);
				var extractParam = /^.*\[(.*)\].*$/; // Extract the field name.
				var name = $input.attr('name');

				if (name) { // Make sure the name attr is set.
					name.match(extractParam);
				 	name = RegExp.$1;
					params[name] = $input.val();
				}
			});
			
			return params;		
		},
		
		handleForm: function($form, params) {
			var self = this;
			var modelName = params.modelName || $form.attr('name');
			var onSubmit = params.onSubmit || function () {};
			this.forms[params.action || 'create'][modelName] = {
				'form' : $form,
				'route' : params.route || ''
			};
			
			// Override default form submit actions.
			$form.submit(function() {
				var $this = $(this);

				// Copy the parameters from the form into an associative array.
				var params = self.extractParameters($this);

				// Validate the form parameters.
				if (modelConstructors[modelName]) {
					var model = new modelConstructors[modelName](processingStack, modelConstructors[modelName]);
					var errors = model.validate(params);
				}

				// Return either errors or form parameters to callback.
				if (errors.length > 0) {
					return onSubmit(errors, null, modelName);
				}
				return onSubmit(null, params, modelName);
			});
		},
		
		create: function(modelName, callback) {
			// We create an instance of the appropriate model.
			var callback = callback || function() {};
			var model;
			var params = this.extractParameters(this.forms.create[modelName].form, true);
			
			if (modelConstructors[modelName]) {
				model = new modelConstructors[modelName](processingStack, modelConstructors[modelName]);
			} else {
				return;
			}
			
			model.create(params, this.forms.create[modelName].route, callback);
		}
	});

	// Create an instance of the client and return it to
	// the client callback.
	var client = new Client();
	MobiusClient.loadedCallback(client);
}
