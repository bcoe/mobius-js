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
 * Description: Bootstrap the Mobius.js framework. Loading routes, models, 
 * controllers, etc.
 */

// Dependencies
require.paths.unshift('./app/controllers');
require.paths.unshift('./app/models')
var fs = require('fs');
var sys = require('sys');
var helpers = require('mobius-js/helpers/helpers');

// This class is created for documentation purposes.
var Bootstrap = function() {}

/**
 * Loads all controller files from app/controllers.
 *
 * @param {function} callback function to call when all controllers are loaded
 * @type array
 * @return constructors for all of the controllers in app/controllers.
 * @public
 */
Bootstrap.prototype.loadControllers = function(callback) {
	var controllers = {};
	fs.readdir("app/controllers/", function (err, files) {
		if (err) {
			throw err;
		}
		
		for (var key in files) {
			var controllerFile = files[key].split('.')[0];
			if (files[key].split('.')[1] == 'js') {
				controllers[controllerFile.toLowerCase()] = (require(controllerFile))[helpers.stringToClassName(controllerFile, '-')];
			}
		}
		
		callback();
	});
	return controllers;
};
exports.loadControllers = Bootstrap.prototype.loadControllers;

/**
 * Loads all model files from app/models.
 *
 * @param {function} callback function to call when all model files are loaded
 * @type array
 * @return constructors for all the models in app/models.
 * @public
 */
Bootstrap.prototype.loadModels = function(callback) {

	var models = {}
	fs.readdir("app/models/", function (err, files) {
		if (err) throw err;
		for (var key in files) {

			var modelFile = files[key].split('.')[0];
			if (files[key].split('.')[1] == 'js') {
				models[modelFile.toLowerCase()] = (require(modelFile))[helpers.stringToClassName(modelFile, '-')];
			}
		}
		
		callback();
	});
	
	return models;
}
exports.loadModels = Bootstrap.prototype.loadModels;

/**
 * Initializes all the routes described in the routes.json file.
 *
 * @param {array} routes routes described in routes.json
 * @param {array} controllers all controller classes.
 * @param {object} mobiusProcessingStack synchronous processing stack.
 * @type void
 * @public
 */
Bootstrap.prototype.initializeRoutes = function(routes, controllers, mobiusProcessingStack) {
	for (var key in routes) {	
		var callback = function(controller, action, id) {
												
			// Determine the action and controller values.
			if (!controller) {
				controller = arguments.callee.prototype.controller;
			}
			if (!action) {
				action = arguments.callee.prototype.action;
			}

			controllerInstance = new controllers[controller.toLowerCase()](mobiusProcessingStack);
			controllerInstance.execute(controller, action, this);
		}
		callback.prototype.controller = routes[key]['controller'];
		callback.prototype.action = routes[key]['action'];

		if (routes[key]['method'] == 'post') {
			post(routes[key]['route'], callback);
		} else { // GET'er Done.
			get(routes[key]['route'], callback);
		}
	}
}
exports.initializeRoutes = Bootstrap.prototype.initializeRoutes;

/**
 * Create indexes based on the descriptions of instance variables in the model files.
 *
 * @param {array} models all model classes.
 * @param {class} mobiusProcessingStack synchronous processing stack.
 * @type void
 * @public
 */
Bootstrap.prototype.createIndexes = function(models, mobiusProcessingStack) {
	for (var modelKey in models) {
		
		var modelClassName = helpers.stringToClassName(modelKey, '-');
		models[modelKey].prototype['className'] = modelClassName;
		var modelInstance = new models[modelKey](mobiusProcessingStack);
		
		var indexes = ['meta', ['_id', 1]];
		
		// Read in the index information from the model's schema definition.
		for (var variableKey in models[modelKey]) {
			
			// Is this the definition of a model instance variable?
			if (variableKey != 'constructor' && variableKey != 'extend' && variableKey != 'include') {
				if (models[modelKey][variableKey]['index']) {
					var newIndex = [variableKey, 1];
					indexes.push(newIndex);
				}
			}
		}
		
		modelInstance.createIndex({'indexes' : indexes}); // Now create the index.
	}
}
exports.createIndexes = Bootstrap.prototype.createIndexes;

/**
 * Initializes all controllers with the set of models. The models
 * are injected onto the controller object, so that from the controller
 * object operations can be performed on them.
 *
 * @param {array} controllers all controller classes.
 * @param {array} models all model classes.
 * @param {class} mobiusProcessingStack synchronous processing stack.
 * @type void
 * @public
 */
Bootstrap.prototype.initializeControllers = function(controllers, models, mobiusProcessingStack) {
	for (var modelKey in models) {
		var modelInstance = new models[modelKey](mobiusProcessingStack);
		var modelClassName = helpers.stringToClassName(modelKey, '-');
		for (var controllerKey in controllers) {
			MobiusModel[modelClassName] = modelInstance;
		}
	}
}
exports.initializeControllers = Bootstrap.prototype.initializeControllers;