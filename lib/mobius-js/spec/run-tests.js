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
 * Description: Run this file from the root directory of the Mobius-JS
 * framework with the flag 'all' to run all tests.
 *
 * > node lib/mobius-js/spec/run-tests.js all
 */

// Dependencies.
require.paths.unshift('lib/mobius-js/spec/lib/', 'lib/mobius-js/', './lib');

require("jspec");
require("express");
require("model");
require("controller");
require('db/mongodb');

print = require('sys').puts;
quit = process.exit;
readFile = require('fs').readFileSync;
mongo = require('mongodb');

sys = require("sys");

// Add all tests here.
specs = {
  independant: [
    'model',
	'controller',
	'processing-stack'
    ]
};

/**
 * Drop the testing database.
 */
function initDB(callback) {

	var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
	var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : mongo.Connection.DEFAULT_PORT;

	sys.puts("Connecting to " + host + ":" + port);
 	db = new mongo.Db('test', new mongo.Server(host, port, {}), {});
	db.open(function(err, db) {
		db.dropDatabase(function(err, result) {
			sys.puts("Dropped testing database.");
			callback();
		});
	});
}

// Set express environment to test.
Express.environment = 'test';

/**
 * Initialize and run tests.
 */
function runTests() {
	
	// Capture command-line input.
	switch (process.ARGV[2]) {
	  case 'all':
	    run(specs.independant);
	    break;
	  default: 
	    run([process.ARGV[2]]);
	}

	function run(specs) {
		var tests = [];
		specs.forEach(function(spec){
			JSpec.exec('lib/mobius-js/spec/spec.' + spec + '.js');
		})
		
		// We should wait for all asynchronous calls to finish before running the report.
		setTimeout(function() {
				JSpec.report();
		}, 2000);
	}

	JSpec.run({ reporter: JSpec.reporters.Terminal, failuresOnly: true });
}

// Run tests after resetting testing database.
initDB(runTests);
mainThread = this;