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
exports = {};
resigConstructor = {}; // Mock out the constructor for a new resig class.

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
		'lib/resig/resig.js',
	], function() {
	
		// Store the resig  simple class constructor.
		resigConstructor.Class = exports.Class;
			
		// Load the main model class.
		LazyLoad.loadOnce([
			'lib/model.js',
		], function() {	
			// Once we have the resig class and the model class 
			// We can safely initialize the client-side mobius object.
			initMobiusClient();
		});	
	});

	// Load validators.
	LazyLoad.loadOnce([
		'validators/validators.js',
	], function() {
	});
});

// Called when all bootstrapping steps are complete.
function initMobiusClient() {
	
	/**
 	 *
	 */
	var Client = Class.extend({
		init: function() {
			console.log('Bootstrapping finished.');
		},
		
		loadModel: function(modelFile) {
	
			// load in a dependent model.
			exports = {};
			LazyLoad.loadOnce([
				'models/' + modelFile
			], function() {
				for (var key in exports) {
					modelConstructors[key] = exports[key];
				}
			});

		},
		
		handleForm: function($form, params) {
			var modelName = params['modelName'] || $form.attr('name');
			var submitHook = params['submitHook'] || function () {};
			
			// Override default form submit actions.
			$form.submit(function() {
				var $this = $(this);

				// Copy the parameters from the form into an associative array.
				var params = {};
				$this.find(':input').each(function(k, v) {
					var $input = $(this);
					var extractParam = /^.*\[(.*)\].*$/; // Extract the field name.
					var name = $input.attr('name');

					if (name) { // Make sure the name attr is set.
						name.match(extractParam);
					 	name = RegExp.$1;
						params[name] = $input.val();
					}
				});		

				// Validate the form parameters.
				if (modelConstructors[modelName]) {
					var model = new modelConstructors[modelName](null, modelConstructors[modelName]);
					var errors = model.validate(params);
				}

				// Return either errors or form parameters to callback.
				if (errors.length > 0) {
					return submitHook(errors, null, modelName);
				}
				return submitHook(null, params, modelName);
			});
		}
	});

	// Create an instance of the client and return it to
	// the client callback.
	var client = new Client();
	MobiusClient.loadedCallback(client);
}
