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
 * 				controllers, etc.
 */

// Dependencies
require.paths.unshift('./app/controllers');
require.paths.unshift('./app/models')
var fs = require('fs');
var sys = require('sys');
var helpers = require('mobius-js/helpers/helpers');

/**
 * Loads all controller files from app/controllers.
 *
 * @return {array} controller classes.
 */
exports.loadControllers = function(callback) {
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
}

/**
 * Loads all model files from app/controllers.
 *
 * @return {array} model classes.
 */
exports.loadModels = function(callback) {

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

/**
 * Initializes all the routes described in the routes.json file.
 *
 * @param {array} routes
 * @return {void} All routes are setup.
 */
exports.initializeRoutes = function(routes, controllers, mobiusProcessingStack) {
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

/**
 * Create indexes based on the descriptions of instance variables in
 * the model files.
 *
 * @param {array} models
 * @param {class} mobiusProcessingStack
 */
exports.createIndexes = function(models, mobiusProcessingStack) {
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

/**
 * Initializes all controllers with the set of models. The models
 * are injected onto the controller object, so that from the controller
 * object operations can be performed upon them.
 *
 * @param {array} controllers
 * @param {array} models
 * @param {class} mobiusProcessingStack
 */
exports.initializeControllers = function(controllers, models, mobiusProcessingStack) {
	for (var modelKey in models) {
		var modelInstance = new models[modelKey](mobiusProcessingStack);
		var modelClassName = helpers.stringToClassName(modelKey, '-');
		for (var controllerKey in controllers) {
			MobiusModel[modelClassName] = modelInstance;
		}
	}
}