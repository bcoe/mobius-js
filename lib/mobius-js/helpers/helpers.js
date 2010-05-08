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

/**
 * Converts a string with hyphens to a camel-case action name.
 *
 * @param {string} string
 * @param {string} character
 * @return {string}
 * @api public
 */
exports.stringToActionName = function(string, character) {
	var splitString = string.split(character);
	var returnMe = splitString[0];
	
	for (var i = 1;i < splitString.length;i++) {
		tempString = splitString[i];
		tempString = tempString.substring(0,1).toUpperCase() + tempString.substring(1,tempString.length);
		returnMe += tempString;
	}
	
	return returnMe;
};

/**
 * Converts a string with hyphens to a string having capitalized
 * first letters.
 *
 * @param {string} string
 * @param {string} character
 * @return {string}
 * @api public
 */
exports.stringToClassName = function(string, character) {
	var splitString = string.split(character);
	var returnMe = "";
	
	for (var i = 0;i < splitString.length;i++) {
		tempString = splitString[i];
		tempString = tempString.substring(0,1).toUpperCase() + tempString.substring(1,tempString.length);
		returnMe += tempString;
	}
	
	return returnMe;	
};

/**
 * Loads in a .json configuration file.
 *
 * @param {string} configuration name.
 * @return {object} the decoded .json configuration file.
 */
exports.loadConfiguration = function(name) {
	jsonData = fs.readFileSync('config/' + name + '.json');
	return JSON.decode(jsonData);
}