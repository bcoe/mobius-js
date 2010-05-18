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
 * Description: This class is used to schedule maintenance tasks, e.g., 
 * going out on the inter-tubes and loading an Atom feed.
 */

// Dependencies.
var resig = require('resig/resig');
var sys = require('sys');

/**
 * A Mobius task inherits from a Resig class.
 */
MobiusTask = resig.Class.extend( {
	frequency: -1,
	lastExecuted: 0
});

/**
 * Execute a task.
 *
 * @param {object} mobiusProcessingStack provides a synchronous stack.
 * @type void
 * @public
 */
MobiusTask.prototype._execute = function(ticks) {
	if (this.frequency < 0) {
		return;
	}
	
	if (ticks - this.lastExecuted > this.frequency) {
		this.lastExecuted = ticks;
		this.execute();
	}	
}