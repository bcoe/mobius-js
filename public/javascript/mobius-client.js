// These variables deal with the require functionality. 
var exports = {};
var resigConstructor = {};

/**
* Mock out require functionality for client-side.
*/
function require(path) {
	var libs = {
		'resig/resig' : resigConstructor,
		'mobius-js/validators/validators' : Validators
	}
	return libs[path];
}

// List of models to load.
var models = [
	"blog-post.js"
];

// Lookup table for model constructors once they are loaded.
var modelConstructors = {};

/**
 * Run when document finishes loading.
 */
$(document).ready(function() {
	var Mobius = {};
	
	// Lazy load core dependencies.
	exports = {};
	LazyLoad.loadOnce([
		'lib/resig/resig.js',
	], function() {
		
		// Store the resig  simple class constructor.
		resigConstructor.Class = exports.Class;
		
		// Load the main model class.
		LazyLoad.loadOnce([
			'lib/model.js',
		], function() {
			
			// Lazy load dependent models.
			exports = {};
			for (var i in models) {
				LazyLoad.loadOnce([
					'models/' + models[i]
				], function() {
					for (var key in exports) {
						modelConstructors[key] = exports[key];
					}
				});
			}
				
		});	
	});
	
	// Load validators.
	LazyLoad.loadOnce([
		'validators/validators.js',
	], function() {
	});
	
	// Change all date-picker classes into JQueryUI date-pickers.
	$(".datepicker").datepicker();
	
	// Override default form submit actions.
	$('form').submit(function() {
		var $this = $(this);
		var name = $this.attr('name');
		
		// Parameters to save.
		var values = $this.serialize();
		
		var params = {};
		$this.find(':input').removeClass('error');
		$this.find(':input').each(function(k, v) {
			var $input = $(this);
			
			var extractParam = /^.*\[(.*)\].*$/; // Extract the field name.
			
			var name = $input.attr('name');
			
			if (name) { // Make sure the name attr is set.
				name.match(extractParam);
			 	name = RegExp.$1;
				params[name] = $input.val();
			}
		});		
		
		// Validate the form parameters.
		if (modelConstructors[name]) {
			var model = new modelConstructors[name](null, modelConstructors[name]);
			var errors = model.validate(params);
			$('#error').html('');
			$.each(errors, function(k, v) {
				$(':input[name=' + name + '[' + v['field'] + ']]').addClass('error');
				$('#error').append("<p>" + v['msg'] + "</p>");
			});
		}
		return false;
	});
});