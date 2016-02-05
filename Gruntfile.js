var port = 4000; // Port to run local server on
var audioAlert = 'wav'; // Options - beep, wav, silent

module.exports = function(grunt) {
	require('load-grunt-config')(grunt); // Save us having to do grunt.loadNpmTasks() for every plugin we use
	require('time-grunt')(grunt); // Get timings of how long each task took (more useful for 'build' than 'develop')
	require('./grunt_stuff/custom-tasks.js')(grunt, port, audioAlert); // Import our custom Grunt tasks

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Empty out the contents of dist for a fresh build
		clean: {
			all: ['dist/'],
			styles: { // Don't think this actually needed here?
				src: [ 'dist/styles/**/*.css', '!dist/styles/main.min.css' ]
			}
		},

		// Copy over files from src to dist
		copy: {
			options: {},
			scripts: {
				expand: true,
				cwd: 'src/',
				// Copy all JS
				src: ['scripts/**/*.js'],
				dest: 'dist/',
				filter: 'isFile'
			},
			html: {
				expand: true,
				cwd: 'src/',
				// Copy all HTML except the /includes folder
				src: ['**/*.html', '!includes/**/*.html'],
				dest: 'dist/',
				filter: 'isFile'
			},
			images: {
				expand: true,
				cwd: 'src/',
				// Copy all images
				src: ['images/**/*.{png,jpg,gif,svg}'],
				dest: 'dist/',
				filter: 'isFile'
			},
			develop: {
				expand: true,
				cwd: 'src/',
				// Copy everything except LESS and SASS files
				src: ['**', '!styles/**/*.{less,scss,sass}'],
				dest: 'dist/',
				filter: 'isFile'
			},
			build: {
				expand: true,
				cwd: 'src/',
				// Copy anything which isn't LESS, SASS, JS, images and HTML (as they will be handled by other tasks)
				src: ['**', '!styles/**/*.{less,scss,sass}', '!styles/**/*.css.map', '!scripts/**/*', '!images/*', '!includes/**/*.html'],
				dest: 'dist/',
				filter: 'isFile'
			}
		},

		// Run JShint on all of JS files (but not on vendor files)
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
			},
			es5: {
				files: {
					src: ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js']
				}
			},
			es6: {
				options: {
					esversion: 6
				},
				files: {
					src: ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js']
				}
			}
		},

		// Use Babel to compile ES6/2015 into ES5
		babel: {
			options: {
				sourceMap: true,
				presets: ['babel-preset-es2015']
			},
			all: {
				files: {
					'dist/scripts/main.js': 'src/scripts/main.js'
				}
			}
		},

		// Uglify all of our JavaScript into one file (but not on vendor files)
		uglify: {
			options: {},
			build: {
				files: {
				  'dist/scripts/main.min.js': ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js']
				}
			}
		},

		// Combine all of the vendor JS files into a single file
		concat: {
			options: {},
			build: {
				src: ['src/scripts/vendor/jquery-1.11.1.min.js', 'src/scripts/vendor/**/*.js'],
				dest: 'dist/scripts/vendor.min.js'
			}
		},

		// Automatically compile LESS into CSS
		less: {
			options: {},
			develop: {
				options: {
					sourceMap: true
				},
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.less'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.less'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			}
		},

		// Automatically compile SASS into CSS
		sass: {
			options: {},
			develop: {
				options: {
					sourceMap: true
				},
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.{scss,sass}'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.{scss,sass}'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			}
		},

		// Minify all CSS files into a single file
		cssmin: {
			options: {},
			build: {
				files: {
					'dist/styles/main.min.css': 'dist/styles/**/*.css'
				}
			}
		},

		// Optimise all image files
		imagemin: {
			options: {},
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'dist/'
				}]
			}
		},

		// Process our HTML includes
		// Replace JS and CSS imports for minified build versions
		processhtml: {
			options: {
        		recursive: true,
        		customBlockTypes: ['./grunt_stuff/handlebars-blocktype.js', './grunt_stuff/css-js-blocktypes.js']
			},
			develop: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'dist/'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'dist/'
				}]
			}
		},

		// Launch a local development server with LiveReloading
		connect: {
			options: {
				port: port,
				base: 'dist/',
				hostname: '*',
				livereload: true
			},
			livereload: {
				options: {
					open: {
						target: 'http://localhost:' + port
					},
					base: [
						'dist/'
					]
				}
			}
		},

		// Watch for file changes
		watch: {
			less: {
				files: ['src/styles/**/*.less'],
				tasks: ['less:develop', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			sass: {
				files: ['src/styles/**/*.{scss,sass}'],
				tasks: ['sass:develop', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			scriptses5: {
				files: 'src/scripts/**/*.js',
				tasks: ['newer:jshint:es5', 'beepOnError', 'newer:copy:scripts'], // Only copy files that have changed
				options: {
					livereload: true,
					nospawn: true
				}
			},

			scriptses6: {
				files: 'src/scripts/**/*.js',
				tasks: ['newer:jshint:es6', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			html: {
				files: ['src/**/*.html', '!src/includes/**/*.html'],
				tasks: ['newer:processhtml:develop', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			includes: {
				files: 'src/includes/**/*.html',
				tasks: ['processhtml:develop', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			images: {
				files: 'src/images/**/*',
				tasks: ['newer:copy:images', 'beepOnError'],
				options: {
					livereload: true,
					nospawn: true
				}
			}
		}
	});

	grunt.registerTask('default',     ['defaultInstructions']);

	// 'develop' task for active site development
	grunt.registerTask('develop',     ['jshint:es5', 'clean:all', 'copy:develop',          'less:develop', 'sass:develop', 'processhtml:develop', 'connect', 'getip', 'beepOnError', 'beepOnSuccess', 'turnForceOn', 'switchwatch::less:sass:scriptses5:html:includes:images']);
	grunt.registerTask('develop-es6', ['jshint:es6', 'clean:all', 'copy:develop', 'babel', 'less:develop', 'sass:develop', 'processhtml:develop', 'connect', 'getip', 'beepOnError', 'beepOnSuccess', 'turnForceOn', 'switchwatch::less:sass:scriptses6:html:includes:images']);

	// 'build' task for creating a clean, optimised set of files for distribution
	grunt.registerTask('build',       ['jshint:es5', 'clean:all', 'copy:build', 'uglify', 'concat', 'less:build', 'sass:build', 'cssmin', 'clean:styles', 'imagemin', 'processhtml:develop', 'processhtml:build', 'beepOnError', 'beepOnSuccess']);
	grunt.registerTask('build-es6',   ['jshint:es6', 'clean:all', 'copy:build', 'babel',            'less:build', 'sass:build', 'cssmin', 'clean:styles', 'imagemin', 'processhtml:develop', 'processhtml:build', 'beepOnError', 'beepOnSuccess']);
};