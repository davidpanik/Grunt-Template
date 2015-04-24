{Project name}
{Developer}
{Date}



This project is built with Grunt. It allows LESS/SASS and HTML includes.



FIRST TIME INSTALLATION

Download and install Node from here: https://nodejs.org/

Run the following from the command line at the root of the project to install the necessary software and additional packages:
	npm install -g grunt-cli
	npm install

If you already have Grunt installed, then you only need to the "npm install" bit.

If you find that "grunt" or "npm" aren't recognised as commands then run the following to ensure your PATH variable is setup correctly:

	set PATH=%PATH%;%APPDATA%\Roaming\npm



DEVELOPMENT

All development work should be carried out in the /src folder.

To get live-reloading, SASS/LESS compiling and JSHinting - run the following from the command line at the root of the project:

	grunt develop



DISTRIBUTION

To package minified, optimised version of the app for distribution, run the following from the command line at the root of the project:

	grunt build

This will now update the /dist folder with a distribution/production version of the app.



IMPORTANT

Do not commit the /node_modules or /dist folders to source control.