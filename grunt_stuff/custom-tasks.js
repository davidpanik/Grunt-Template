module.exports = function(grunt, port, audioAlert) {
	// Detect what IP address the local webserver is running
	grunt.registerTask('getip', 'Tells you the ip address your server is running on.', function() {
		var os = require('os');
		var ifaces = os.networkInterfaces();
		var ip = '';
		var alias = 0;

		function checker(details) {
			if (details.family == 'IPv4' && !details.internal) {
				ip = details.address;

				++alias;
			}
		}

		for (var dev in ifaces) {
			ifaces[dev].forEach(checker);
		}

		var serverMessage = 'Your server is running on: http://' + ip + ':' + port;

		grunt.log.writeln('');
		grunt.log.writeln(serverMessage['green']);
	});

	function beep() {
		grunt.log.write('\x07').write('♪');
	}

	function playWav(file) {
		// http://www.elifulkerson.com/projects/commandline-wav-player.php
		require('child_process').exec('sounder.exe ' + file, { cwd: process.cwd() + '\\grunt_stuff'});
	}

	// Give an error message and beep once
	function error() {
		var errorMessage = 'An error or warning occured.';
		grunt.log.writeln(errorMessage['red']);

		if (audioAlert === 'beep') {
			beep();
		}
		else if (audioAlert === 'wav') {
			playWav('error.wav');
		}
	}

	// Give a success message and beep three times
	function success() {
		var successMessage = 'Task completed without errors or warnings!';
		grunt.log.writeln(successMessage['green']);

		if (audioAlert === 'beep') {
			beep();
			beep();
			beep();
		}
		else if (audioAlert === 'wav') {
			playWav('success.wav');
		}
	}

	grunt.registerTask('beepOnError', 'Gives a beep if either an error or warning has been detected', function() {
		if (grunt.fail.forever_errorcount || grunt.fail.forever_warncount) {
			error();
		}
	});

	grunt.registerTask('beepOnSuccess', 'Gives three beeps if no error or warning has been detected', function() {
		grunt.option('force', true);

		if (!grunt.fail.errorcount && !grunt.fail.warncount && !grunt.fail.forever_errorcount && !grunt.fail.forever_warncount) {
			success();
		} else {
			error();
		}
	});

	grunt.registerTask('turnForceOn', 'Forces processing to continue after an error/warning', function() {
		grunt.option('force', true);
	});

	// Run with: grunt switchwatch:target1:target2 to only watch those targets
	grunt.registerTask('switchwatch', function() {
		var targets = Array.prototype.slice.call(arguments, 0);

		Object.keys(grunt.config('watch')).filter(function(target) {
			return !(grunt.util._.indexOf(targets, target) !== -1);
		}).forEach(function(target) {
			grunt.log.writeln('Ignoring ' + target + '...');
			grunt.config(['watch', target], {files: []});
		});

		grunt.task.run('watch');
	});

	grunt.registerTask('defaultInstructions', function() {
		grunt.log.writeln('');
		grunt.log.writeln('============================================================'['yellow']);
		grunt.log.writeln('');
		grunt.log.writeln(' Please run one of the following commands:');
		grunt.log.writeln('');

		grunt.log.write('  grunt develop    '['green']);
		grunt.log.writeln(' - Develop the app using EcmaScript 5');

		grunt.log.write('  grunt develop-es6'['green']);
		grunt.log.writeln(' - Develop the app using EcmaScript 6');

		grunt.log.write('  grunt build      '['green']);
		grunt.log.writeln(' - Build the app using EcmaScript 5');

		grunt.log.write('  grunt build-es6  '['green']);
		grunt.log.writeln(' - Build the app using EcmaScript 6');

		grunt.log.writeln('');

		grunt.log.writeln('============================================================'['yellow']);
	});
};