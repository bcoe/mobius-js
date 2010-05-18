var sys = require('sys');
exports.Example = MobiusTask.extend({
	frequency: 15000, // milliseconds
	execute: function() {
		// Your task logic here.
		sys.puts('running task.');
	}
});