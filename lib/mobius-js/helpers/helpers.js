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
 * Description: Various helper functions used by the mobius
 * framework.
 */

// Dependencies.
var fs = require('fs');
var sys = require('sys');

// This class is created for documentation purposes.
function Helpers() {};

/**
 * Converts a string with hyphens to a camel-case action name.
 *
 * @param {string} string the string that should be converted into an action.
 * @param {string} character the character to join on, usually '-'.
 * @type {string}
 * @return a string with a lower-case first letter in camel case.
 * @public
 */
Helpers.prototype.stringToActionName = function(string, character) {
	var splitString = string.split(character);
	var returnMe = splitString[0];
	
	for (var i = 1;i < splitString.length;i++) {
		tempString = splitString[i];
		tempString = tempString.substring(0,1).toUpperCase() + tempString.substring(1,tempString.length);
		returnMe += tempString;
	}
	
	return returnMe;
}
exports.stringToActionName = Helpers.prototype.stringToActionName;

/**
 * Converts a string with hyphens to a string with capitalized
 * first letters.
 *
 * @param {string} string the string that should be converted into an action.
 * @param {string} character the character to join on, usually '-'.
 * @type {string}
 * @return a string with an upper-case first letter in camel case.
 * @public
 */
Helpers.prototype.stringToClassName = function(string, character) {
	var splitString = string.split(character);
	var returnMe = "";
	
	for (var i = 0;i < splitString.length;i++) {
		tempString = splitString[i];
		tempString = tempString.substring(0,1).toUpperCase() + tempString.substring(1,tempString.length);
		returnMe += tempString;
	}
	
	return returnMe;	
}
exports.stringToClassName = Helpers.prototype.stringToClassName;

/**
 * Loads in a .json configuration file.
 *
 * @param {string} name the name of the configuration file to load from config/.
 * @type object the decoded .json configuration file.
 * @public
 */
Helpers.prototype.loadConfiguration = function(name) {
	jsonData = fs.readFileSync('config/' + name + '.json');
	return JSON.decode(jsonData);
}
exports.loadConfiguration = Helpers.prototype.loadConfiguration;