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
 * Description:  Web related helper functions.
 */


// Dependencies.
var sys = require('sys');

// This class is created for documentation purposes.
function Validators() {};

/**
 * Synchronous processing stack abstracts away asynchronous behavior.
 * Note: Do not access this method directly, instead use ProcessingStack.extend({});
 *
 * @type void
 * @public
 */
Validators.size = function(value, field, params, errors, msg) {
	var msg = params['msg'] || "The size of :field must be between :min and :max";
	msg = msg.replace(":field", field);
	msg = msg.replace(":value", value);
	msg = msg.replace(":min", params['min']);
	msg = msg.replace(":max", params['max']);
	
	var size = value.length;
	if (size < params['min'] || size > params['max']) {
		error = {
			field : field,
			value : value,
			msg : msg
		}
		errors.push(error);
	}
	return errors;
}
exports.size = Validators.size;