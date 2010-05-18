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
 * Description: This script bootstraps mobius: loading routes, models,
 * 				controllers, etc.
 */

// Dependencies .
require.paths.unshift('./lib');
require.paths.unshift('./lib/mobius-js/renderer');

var sys = require('sys');
var resig = require('resig/resig');
var helpers = require('mobius-js/helpers/helpers');
var stack = require('mobius-js/processing-stack');
var bootstrap = require('mobius-js/bootstrap');
var dom = require('mobius-js/parsers/xml-dom')

require('express');
require('mobius-js/controller');
require('mobius-js/model');
require('mobius-js/task');

// Configure the Express DSL server.
var serverConfiguration = helpers.loadConfiguration('server');
configure(function(){
	// Set root directory.
	set('root', __dirname);
	
	// Load static routing.
	use(require('express/plugins/static').Static, {path: './public/'});
	use(require('express/plugins/cookie').Cookie);
	
	// Set the views directory.
	set('views', function(){ return set('root') + '/../app/views' });
});
run(serverConfiguration.port); // Start the express server.

// The server-side processing stack provides synchronous access to
// asynchronous actions.
var dbConfiguration = helpers.loadConfiguration('db');
var mobiusProcessingStack = new stack.ProcessingStack(dbConfiguration);

// Load models and controllers.
var controllers = bootstrap.loadControllers(function() {});
var models = bootstrap.loadModels(function() {
	bootstrap.createIndexes(models, mobiusProcessingStack);
	bootstrap.initializeControllers(controllers, models, mobiusProcessingStack);	
});

// Load in tasks and setup a timer to execute them.
var tasks = bootstrap.loadTasks(function() {
	
	setInterval(function () {
		var date = new Date();
		var ticks = date.getTime();

		for (var key in tasks) {
			tasks[key]._execute(ticks);
		}
	}, 1000);
	
});

// Load in all of the routes described in routes.json.
var routes = helpers.loadConfiguration('routes');
bootstrap.initializeRoutes(routes, controllers, mobiusProcessingStack);