# Flint command line tools readme
Flint has some automated processes that use normal Node modules. To run the automated tasks you must install `grunt-cli` using `npm`.

	sudo npm install -g grunt-cli

From there, you can run `grunt` from within the .submodules folder to start using the automated processes for testing and jshint.

If you have just cloned the repository (or if there is no node_modules directory), then you will need to install the package modules:

	npm install

This will install the modules necessary to simpy run `grunt` to start testing the project.