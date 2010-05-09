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
 * Description: This script can be used to generate models, controllers, etc.
 */

// Dependencies.
require.paths.unshift('./lib')
var fs = require('fs');
var sys = require('sys');
var helpers = require('mobius-js/helpers/helpers');
var renderer = require('mobius-js/renderer/mejs');

// Allow certain actions to generate multiple files.
var additionalGeneration = {};
additionalGeneration['controller'] = {view : '.html.mejs'};

// This class is created for documentation purposes.
function Generate() {};

/**
 * Generate models, controllers, views, etc.
 *
 * @param {string} templateFile file in templates directory to use for generation.
 * @param {string} generatedFile name of file to generate
 * @param {string} className Class-name for class in file generated.
 * @fileType {string} fileType type of file being generated.
 * @fileName {string} fileName file name without extension.
 * @type void
 * @public
 */
Generate.prototype.generate = function(templateFile, generatedFile, className, fileType, fileName) {
	try {
		sys.puts('Generating ' + fileType + ': ' + generatedFile);
		
		// Load and render the template.
		templateData = fs.readFileSync(templateFile);
		var options = {
			locals : {
				className: className, 
				generatedFile: generatedFile, 
				openToken: '<%='
			}
		}
		var body = renderer.render(templateData, options);
		
		// Output the result of the template.
		if (body) {
			fs.writeFileSync(generatedFile, body);
		}
		
		// Generate additional files.
		if (additionalGeneration[fileType]) {
			for (var key in additionalGeneration[fileType]) {
				var type = key;
				var extension = additionalGeneration[fileType]['view'];
				Generate.prototype.parseArguments(type, fileName, extension);
			}
		}
		
	} catch (e) {
		sys.puts(e);
	}
}

/**
 * Parse command line arguments and use them to perform code generation.
 *
 * @param {string} arg2 argument 2 passed in from the command line.
 * @param {string} arg3 argument 3 passed in from the command line.
 * @param {string} extension extension of the file to be generated.
 */
Generate.prototype.parseArguments = function(arg2, arg3, extension) {
	// Read command line arguments.
	var fileType = arg2;
	var fileName = arg3.replace('_', '-');
	
	// Create class name based on file name provided.
	var className = helpers.stringToClassName(fileName, '-');

	// Paths for code generation.
	var templatePath = 'lib/mobius-js/templates/';
	var classPath = 'app/' + fileType + 's/';
	
	var templateFile = templatePath + fileType + '.mejs'
	var classFile = classPath + fileName + (extension ? extension : '.js');
	
	// Does this type of code generation file exist?
	try {
		fs.lstatSync(templateFile);
		
		// Does a file with this name already exist?
		try {
			fs.lstatSync(classFile);
			sys.puts('A ' + fileType + ' with this name already exists.');
		} catch (e) {
			// Actually generate the file.
			Generate.prototype.generate(templateFile, classFile, className, fileType, fileName);
		}
		
	} catch (e) {
		sys.puts(e);
		sys.puts('Could not find template for generating file of type ' + fileType + '.');
	}
}

// Extract command line arguments.
if (!process.argv[2] || !process.argv[3]) {
	sys.puts("Usage: node scripts/generate.js [file_type] [file_name]");
} else {
	Generate.prototype.parseArguments(process.argv[2], process.argv[3]);
}