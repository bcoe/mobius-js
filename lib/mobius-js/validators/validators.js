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
 * Validates the size of a text input field
 *
 * @param {string} value the value entered into a field.
 * @param {string} field the name of the field.
 * @param {array} params the options for this validator.
 * @param {array} errors the errors array.
 * @param {string} msg a message for overriding the default.
 * @type void
 * @public
 */
Validators.size = function(value, field, params, errors, msg) {
	value = value || "";
	
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


/**
 * Validates a date in the format MM/DD/YYYY.
 *
 * @param {string} value the value entered into a field.
 * @param {string} field the name of the field.
 * @param {array} params the options for this validator.
 * @param {array} errors the errors array.
 * @param {string} msg a message for overriding the default.
 * @type void
 * @public
 */
Validators.date = function(value, field, params, errors, msg) {
	value = value || "";
	
	var msg = params['msg'] || ":field must be a date in the form mm/dd/yyyy";
	msg = msg.replace(":field", field);
	msg = msg.replace(":value", value);
	
	var dateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if (!value.match(dateFormat)) {
		error = {
			field : field,
			value : value,
			msg : msg
		}
		errors.push(error);	
	}
		
	return errors;
}
exports.date = Validators.date;