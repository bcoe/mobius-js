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
 * Description: A simple server for the mobius-js framework.
 */

// Dependencies .
require.paths.unshift('./lib');
require.paths.unshift('./lib');
require.paths.unshift('./app/controllers');
require.paths.unshift('./lib/mobius-js/renderer');
require.paths.unshift('./lib/mobius-js/helpers');
require.paths.unshift('./lib/resig');

var sys = require('sys');
var resig = require('resig');
require('express');
require('mobius-js/controller');
var helpers = require('helpers');
//

// Load controllers.
fs = require('fs');

controllers = {};
fs.readdir("app/controllers/", function (err, files) {
	if (err) throw err;
	for (var key in files) {
		
		controllerFile = files[key].split('.')[0];
		if (files[key].split('.')[1] == 'js') {
			controllers[controllerFile.toLowerCase()] = (require(controllerFile))[helpers.stringToClassName(controllerFile, '-')];
		}
	}
});


// Configure express.
configure(function(){
	// Set root directory.
	set('root', __dirname);
	
	// Load static routing.
	use(require('express/plugins/static').Static, {path: './public/'}); // Static routes.
	
	// Set the views directory.
	set('views', function(){ return set('root') + '/../app/views' });
});
	
// Default controller/action/id route.	
get('/:controller/:action(/:id)?', function(controller, action) {
	controllerInstance = new controllers[controller.toLowerCase()];
	controllerInstance.execute(controller, action, this);
});

// Default controller/action/id route.	
get('/:controller(/)?', function(controller, action) {
	controllerInstance = new controllers[controller.toLowerCase()];
	controllerInstance.execute(controller, action, this);
});

post('/:controller/:action(/:id)?', function(controller, action) {
	controllerInstance = new controllers[controller.toLowerCase()];
	controllerInstance.execute(controller, action, this);
});

run(8080);