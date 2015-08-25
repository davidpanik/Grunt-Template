'use strict';

// Processhtml block code goes here...

module.exports = function (processor) {
	processor.registerBlockType('css', function (content, block, blockLine, blockContent, filepath) {
		var replacement,
			styles = [];

		// Ensure consistent line breaks
		blockLine = blockLine.replace(/(\r\n|\n|\r)/gm, '\n');
		content = content.replace(/(\r\n|\n|\r)/gm, '\n');

		if (block.inline) {
			styles = obtainStyles(block, blockContent, this.options.includeBase || path.dirname(filepath));
			replacement = block.indent + '<style>' + this.linefeed +
			styles.join(this.linefeed) +
			block.indent + '</style>';

			return content.split(blockLine).join(replacement);
		}

		return content.replace(blockLine, block.indent + '<link rel="stylesheet" href="' + block.asset + '">');
	});

	processor.registerBlockType('js', function (content, block, blockLine, blockContent, filepath) {
		var replacement,
			scripts = [];

		// Ensure consistent line breaks
		blockLine = blockLine.replace(/(\r\n|\n|\r)/gm, '\n');
		content = content.replace(/(\r\n|\n|\r)/gm, '\n');

		if (block.inline) {
			scripts = obtainScripts(block, blockContent, this.options.includeBase || path.dirname(filepath));
			replacement = block.indent + '<script>' + this.linefeed +
			scripts.join(this.linefeed) +
			block.indent + '</script>';

			return content.split(blockLine).join(replacement);
		}

		return content.replace(blockLine, block.indent + '<script src="' + block.asset + '"><\/script>');
	});
};