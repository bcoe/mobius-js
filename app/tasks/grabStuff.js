var sys = require('sys');
exports.GrabStuff = MobiusTask.extend({
	frequency: 15000, // milliseconds
	execute: function() {
		// Your task logic here.
		sys.puts('running task.');
	}
});