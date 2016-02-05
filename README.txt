{Project name}
{Developer}
{Date}



This project is built with Grunt. It allows for LESS/SASS compilation and HTML includes (and some other stuff).

=======================
|| QUICK START GUIDE ||
=======================

First time installation
-----------------------
Download and install Node from here: https://nodejs.org/

Run the following from the command line at the root of the project to install the necessary software and additional packages:
	npm install -g grunt-cli
	npm install

(If you already have Grunt installed, then you only need to the "npm install" bit.)

If you find that "grunt" or "npm" aren't recognised as commands then run the following to ensure your PATH variable is setup correctly:
	set PATH=%PATH%;%APPDATA%\Roaming\npm


Development
-----------
All development work should be carried out in the /src folder.

To get live-reloading, SASS/LESS compiling and JSHinting - run the following from the command line at the root of the project:
	grunt develop

Or to use ES6 use:
	grunt develop-es6

Distribution
------------
To package minified, optimised version of the app for distribution, run the following from the command line at the root of the project:
	grunt build

Or to use ES6 use:
	grunt build-es6

This will now update the /dist folder with a distribution/production version of the app.


Important!
----------
Do not commit the /node_modules or /dist folders to source control.





============================
|| DETAILED DOCUMENTATION ||
============================

Introduction
------------

This is a template for starting Grunt-powered projects.
It tries to offer a core toolset without over-burdening the developer.

README.txt is intended to be kept with the project to help future developers hit the ground running.
Note that this Template was intended for use on a Windows environment, hence the .bat files and some of the instructions in README.txt are Windows-specific.


Tasks
-----

The "develop" task will:
 * Reset the /dist folder
 * Copy everything from /src except SASS and LESS files
 * Compile LESS and SASS to CSS
 * Compile any HTML includes/templates
 * Start a local webserver
 * Tell you the IP address of the local webserver
 * Start file-watching and live-reloading:
   + JS Hinting
   + SASS and LESS compiling
   + HTML and image updates (note that the creation of new images won't be detected - restart "grunt develop" to pick them up)
   + Include/template updates

The "build" task will:
 * Reset the /dist folder
 * Copy everything from /src except SASS and LESS files, JavaScript files, images, include/template files
 * Compile LESS and SASS to CSS
 * Uglify any JS in the /js folder (but not in /js/vendors)
 * Concatenate any JS in the /js/vendors folder
 * Compile LESS and SASS to CSS
 * Minify the resulting CSS
 * Optimise everything in the /images folder
 * Compile any HTML includes/templates

The "newer" plugin is used to ensure only necessary files are updated (during development).


Beeps and sounds
----------------

If an error (or warning) occurs then you will hear the error sound (default is a single beep).
If a full task (e.g. build) completes without any errors (or warnings) then you will hear success sound (default is three beeps).

The error/success sounds can be turned off, or changed to play .wav files (Windows only) by changing the value of audioAlert in Gruntfile.js


Includes
--------

The "processhtml" plugin is used to allow the inclusion of re-usable bits of flat HTML in your files.
To use, insert a comment in the following format (the contents of comment are for reference only).
This line will be replaced with the contents of includes/header.html (for example).
Note this file path is relative to the file where the inclusion is happening.

<!-- build:include includes/header.html -->Header will go here<!-- /build -->


Templates
---------

The "processhtml" plugin has also been extended (in handlebars-blocktype.js) to allow for the passing of JSON data into a Handlebars template, and the resulting HTML inserted onto the page.
To use, insert a comment block in the following format. The contained JSON data will be combined with the specified file (again, relative path) and resulting HTML will replace this comment block in the page.
Note that if there are any errors in the JSON, then the process will fail. Keys must be wrapped in quotes.
The actual JSON object must sit on seperate lines from the comment tags.

<!-- build:handlebars includes/test.html  -->
	{
		"name": "Hello world",
		"intro": {
			"alpha": 123,
			"beta":  456
		},
		"people": [
			{ "first": "Bob"   , "last": "Smith" },
			{ "first": "Sue"   , "last": "Brown" },
			{ "first": "Joe"   , "last": "White" },
			{ "first": "Alice" , "last": "Clark" }
		]
	}
<!-- /build -->


Files overview
--------------

\.git                                 - Version control files from GitHub, if you're not using Git you can delete/ignore these
\.gitattributes                       - Ditto
\.gitignore                           - Ditto
\README.txt                           - This file
\build.bat                            - Helper batch file for runnning "grunt build"
\develop.bat                          - Helper batch file for runnning "grunt develop"
\install.bat                          - Helper batch file for runnning "npm install"
\package.json                         - Specifies which Grunt packages are required
\Gruntfile.js                         - Specifies the actual Grunt functionality

\grunt_stuff\custom-tasks.js          - Custom Grunt tasks (could in theory be made in plugins)
\grunt_stuff\handlebars-blocktype.js  - Additional code for handling of Handlebars templates
\grunt_stuff\sounder.exe              - Command line application for playing wav files
\grunt_stuff\success.wav              - Sound file for success audio alert
\grunt_stuff\error.wav                - Sound file for error audio alert

\src\fonts                            - Placeholder for putting webfonts
\src\images                           - Any images files you want to build optimised during build should go here
\src\includes                         - Any includes/templates should go here, this folder should never appear in build
\src\scripts                          - Custom files which you want to have minified during build should go here
\src\scripts\vendor                   - Third party files which are only to be concatenated during build should go here
\src\styles                           - Any CSS, LESS or SASS files should go here
\src\apple-touch-icon-precomposed.png - Template image file for Apple devices
\src\favicon.ico                      - Template favicon file
\src\index.html                       - Base HTML file for your project, contains some examples of how to use processhtml markup