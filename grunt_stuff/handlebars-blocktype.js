'use strict';

var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var grunt = require('grunt');


// Register Handlebars helpers here...

handlebars.registerHelper('if_eq', function(value, test, options) {
	if (value == test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('if_not', function(value, test, options) {
	if (value != test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('if_lt', function(value, test, options) {
	if (value < test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('if_lte', function(value, test, options) {
	if (value <= test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('if_gt', function(value, test, options) {
	if (value > test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('if_gte', function(value, test, options) {
	if (value >= test) {
	return options.fn(this);
	} else {
	return options.inverse(this);
	}
});



// Processhtml block code goes here...

module.exports = function (processor) {
	// This will allow to use this <!-- build:customBlock[:target] <value> --> syntax
	processor.registerBlockType('handlebars', function (content, block, blockLine, blockContent, filepath) {
		var base = this.options.includeBase || path.dirname(filepath);
		var assets = block.asset.split('|');
		var assetpath = path.join(base, assets[0]);
		var l = blockLine.length;
		var fileContent, i;

		function merge(obj1, obj2) {
			var obj3 = {};
			for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
			for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }

			return obj3;
		}

		function readFile(url) {
			var sourcePath = path.join(base, url);
			var sourceFile = fs.readFileSync(sourcePath).toString();

			return JSON.parse(sourceFile);
		}

		if (fs.existsSync(assetpath)) {
			// Recursively process included files
			if (this.options.recursive) {
				fileContent = this.process(assetpath);
			} else {
				fileContent = fs.readFileSync(assetpath).toString();
			}

			grunt.log.writeln('Processing Handlebars template for ' + block.asset);

			// Compile and replace Handlebars templates
			var template = handlebars.compile(fileContent);
			var data = {};

			if (assets.length > 1) {
				for (var x = 1; x < assets.length; x++) {
					data = merge(data, readFile(assets[x]));
				}
			}

			if (blockContent.indexOf('{') > -1) {// If JSON is supplied then use that
				data = merge(data, JSON.parse(blockContent));
			} else { // Otherwise assume it's a filepath and load that
				data = merge(data, readFile(blockContent.trim()));
			}

			fileContent = template(data);

			// Ensure consistent line breaks
			blockLine = blockLine.replace(/(\r\n|\n|\r)/gm, '\n');
			content = content.replace(/(\r\n|\n|\r)/gm, '\n');

			// Add indentation and remove any last new line
			fileContent = block.indent + fileContent.replace(/(\r\n|\n)$/, '');

			content = content.replace(blockLine, fileContent);
		} else {
			grunt.log.writeln('Couldn\'t find template file!');
		}

		return content;
	});
};