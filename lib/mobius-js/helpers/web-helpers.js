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
function WebHelpers() {};

/**
 * Creates a form from a mobius model.
 *
 */
WebHelpers.prototype.form = function(model) {
	var returnMe = '<div class="dialog" id="error"></div><form method="post" name="' + model.className + '">'
	for (var key in model.constructor) {
		if (key != 'constructor' && key != 'extend' && key != 'include') {
			
			var label = model.constructor[key]['label'] || "";
			
			switch (model.constructor[key]['type']) {
				case 'date':
					inputClass = 'datepicker';
					returnMe += '<label>' + label + '</label><input type="text" name="' + model.className + '[' + key + ']" class="datepicker" /><br />';
				break;
				
				case 'textarea':
					returnMe += '<label>' + label + '</label><textarea name="' + model.className + '[' + key + ']"/></textarea><br />';
				break;
				
				default:
					returnMe += '<label>' + label + '</label><input type="text" name="' + model.className + '[' + key + ']"/><br />';
				break;
			}
		}
	}
	
	return returnMe += '<input type="submit" value="Save" /></form>';
}
exports.form = WebHelpers.prototype.form;

exports.parseParameters = WebHelpers.prototype.parseParameters;