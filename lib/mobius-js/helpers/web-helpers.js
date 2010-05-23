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
WebHelpers.prototype.form = function(model, params) {
	var action = params['action'] || 'create';
	var object = params['object'] || {};
		
	var returnMe = '<div class="dialog" id="error"></div><form method="post" name="' + model.className + '">'
	for (var key in model.constructor) {
		if (key != 'constructor' && key != 'extend' && key != 'include') {
			
			var label = model.constructor[key]['label'] || "";
			var value = '';
			if (action == 'update' && object) {
				value = object[key];
			}
			
			switch (model.constructor[key]['type']) {
				case 'date':
					inputClass = 'datepicker';
					returnMe += '<label>' + label + '</label><input type="text" name="' + model.className + '[' + key + ']" class="datepicker" value="' + value + '" /><br />';
				break;
				
				case 'textarea':
					returnMe += '<label>' + label + '</label><textarea name="' + model.className + '[' + key + ']" />' + value + '</textarea><br />';
				break;
				
				default:
					returnMe += '<label>' + label + '</label><input type="text" name="' + model.className + '[' + key + ']" value="' + value + '" /><br />';
				break;
			}
		}
	}
	
	// Output the unique ID for modifying this model.
	if (action == 'update' && object) {
		returnMe += '<input type="hidden" name="' + model.className + '[' + '_id]" value="' + object._id + '"/>';
	}
	
	return returnMe += '<input type="submit" value="Save" /></form>';
}
exports.form = WebHelpers.prototype.form;

exports.parseParameters = WebHelpers.prototype.parseParameters;