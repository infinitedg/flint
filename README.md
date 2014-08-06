# Flint Project
Flint is the HTML5 Space Center controls platform. Flint uses [Meteor](http://www.meteor.com) as its core platform, and uses the Meteor package manager [Meteorite](http://oortcloud.github.com/meteorite/).

## Prerequisites
The Flint project requires familiarity with the command line on Windows, Mac, or Linux. You will need administrative privileges to run, as well.

If you aren't familliar with what `cd` or your command line does, then first take the [CLI Crashcourse on Learn Code the Hard Way](http://cli.learncodethehardway.org/book/).

## Getting Started
1. Fire up your Terminal
2. Run `curl https://install.meteor.com | sh` to install Meteor
3. Visit [NodeJS.org](http://nodejs.org/download/) and get the installer for your platform
4. Run the installer. You now have NodeJS (Which we may need at some point) and NPM (which we need in the next step!)
5. From the command line, run `sudo npm install -g meteorite` and enter your password if prompted.
6. If you don't already have `git`, download it from [git-scm.org](http://git-scm.com/) and install it.
  * Find out if you have `git` by running `which git` on your command line. If it shows something like `/usr/bin/git` then you have it!
7. `cd` to the directory you'd like to keep `Flint` and clone it by running `git clone https://github.com/farpoint/flint.git`
8. Run `cd flint` and then `grunt run` to fire it up! If you get any errors, review the above commands and try again.

## A note for windows users
Meteor and Meteorite are not supported on Windows at this time. While windows users can access Flint from the browser, and may be able to run unit tests or generate documentation, Flint will not run as a server on a Windows system at this time.

Instead of attempting to run Flint on Windows, we recommend either setting up a bootable USB Drive running Ubuntu Linux (or any flavor of Linux you prefer), or running Linux in Virtualbox, and then developing in that environment.

Another option is to follow the instructions available at [http://win.meteor.com/](http://win.meteor.com/) under __Virtualized Solutions__. This provides a more flexible way to provision a development environment on your windows machine. Although still using VirtualBox, it may be more flexible. Note, however, that these instructions talk about the creation of a new Meteor project. Be sure to properly clone `Flint` into your project when you get your virtual system up and running.

## Flint command line tools
Flint has some automated processes that use normal Node modules. To run the automated tasks you must install `grunt-cli` using `npm`.
```javascript
  sudo npm install -g grunt-cli
```
From there, you can run `grunt` in the main project folder to fire off various automated tasks. `grunt` will run with the following commands

* `grunt` or `grunt default` will run `jshint` and then compile the project into the `/app` directory
* `grunt test` will run `jshint` only
* `grunt run` will watch the project's files and, whenever something changes, `grunt` will rebuild the project to `/app`. This task also launches the `mrt` server as well. Note that there are open bugs with this task, and it will crash from time to time.

`grunt run` can be an effective way to continuously build the project, including refreshing the browser through meteor. An alternative until the `grunt run` bug is fixed is to run `mrt` in the `/app` directory, and to manually rebuild the project by running `grunt` in the main project directory. Although it requires developer intervention, this technique will not crash.

If you have just cloned the repository (or if there is no node_modules directory), then you will need to install the package modules:

  npm install

This will install the modules necessary to simpy run `grunt` to start testing the project.

## Documentation
Flint's documentation uses [YUIDoc](http://yui.github.io/yuidoc/). `yuidoc` provides a number of convenient tools, including intuitive Javadoc/Doxygen-style comment blocks, speed, and a great HTML UI. `yuidoc` provides a documentation compiler as well as a documentation server. To simply view Flint's documentation without worrying about developing it, visit [http://docs.flint.farpointStation.org](http://docs.flint.farpointStation.org). This may require a password - contact a project administrator or Farpoint staff for access.

Although anyone can write documentation for the project at any time, prior to performing any documentation _compilation intended for publication to docs.flint.farpointStation.org_ (manually or via `grunt`), you must first run `grunt docs_init` to clone the working documentation repository into your project. Otherwise your work will be in vain (See section titled "Automated documentation publishing")!

To compile the latest docs for the project, run `grunt yuidoc` from within the base directory of flint. Default settings are located in `yuidoc.json` in the root of the project. If you have installed `yuidoc` globally (see below) you may alternatively run `yuidoc` from the base directory of flint as well. This provides more granular control, if necessary.

When developing documentation for any extended period of time, the server feature will fire up the documentation as a local web server. Page refreshes will rebuild the documentation, making for a quick and convenient documentation-generation experience. To run the documentation web server, first ensure you have `yuidoc` installed by running `sudo npm install -g yuidocjs`. You may then run `yuidoc . --server [port]` where `[port]` is an optional port number (defaults to 3000). Note that providing the dot is necessary - otherwise `yuidoc` will not use relative paths when listing files in the generated documentation, which is as ugly as it is annoying.

For thorough YUIDoc instructions, visit their [project page](http://yui.github.io/yuidoc/). For instructions on syntax, check out the [YUIDoc syntax reference](http://yui.github.io/yuidoc/syntax/index.html).

### Automated documentation publishing
`grunt` has a few other tricks up its sleeve: It is also equipped for automatically building ___and publishing___ documentation. Before developing documentation The relevant tasks are as follows:

* `grunt docs` will build and publish your current documentation if you have setup your docs repository and if you are on the master branch. This is a safety feature so that the docs are always in a more stable state than on somebody's feature branch.
* `grunt docs_fix` will destroy and re-clone your `docs/` directory. Very useful tool. Since 
* `grunt yuidoc` will only build current documentation, regardless of branches or git repositories (although it is still recommended that you run `grunt exec:docs_init` before doing any doc compilation work)

Visit [the docs page on `grunt`](http://docs.flint.farpointstation.org/classes/Grunt.html) for complete instructions and documentation on available `grunt` documentation commands.

### Documentation techniques
YUIDoc comments begin with `/**` and end with `*/`. Comments can (and should) include [markdown](http://daringfireball.net/projects/markdown/) where appropriate.

Yuidoc provides __classes__ and __modules__ as organizational constructs. As of this writing, Flint is organized into two modules, giving us rough organizational separation between templates and functionality. We should consider a refactor of this logical organization, perhaps making each package its own `@module`. This is not entirely straightforward, since Flint's various components are highly coupled. Refactoring may be required to break up the various packages that make Flint into atomic modules, and then exposing methods from these modules in a single Flint package that has dependencies to these other various packages.

__Available Modules__

* Core Functionality
* Automation
* Templates

__Core functionality__ contains mostly static methods, objects, and other functional components for the Flint platform.

__Automation__ contains information about available grunt tasks for app and documentation compilation.

The __Templates__ module is applied to all template javascript files, and includes the following submodules:

* Cards
* Core
* Layouts

Documentation of HTML is not supported by YUIDoc (although documenting all appropriate code is encouraged).

A __class__ should be a a real Javascript class, however Yuidoc is flexible enough to take literally any string as a "class name". We use this to our advantage for breaking up our documentation into various sections. The following are the list of sections currently available for the `Core Functionality` module, including their intended use:

* Actor - An actual class for system actors
* Flint - An actual class for static, global platform methods
* Utils - An actual class for static, global utility methods
* Flint.collections - A fake class for listing collections available to the platform
* Handlebars.helpers - A fake class for listing helper methods available in handlebars
* Meteor.call - A fake class for listing methods available to meteor.call
* Meteor.startup - A fake class for listing methods triggered on `Meteor.startup`
* Meteor.subscriptions - A fake class for listing subscriptions declared by `Meteor.subscribe`
* Router.Filters - A fake class for listing filters employed by the router
* Router.Routes - A fake class for listing routes employed by the router

Extensions to this list should be discussed with team members before being implemented.

### Using classes
When working on documentation, declare the class/section that a given method belongs to by providing the following comment block before the methods (This example would declare that the `Flint` class applies to any following methods and properties):

    /**
    @class Flint
    */

Note that the `@static` tag or a description are not necessary.

### Commenting methods
Methods should be documented like the following example:

    /**
    * Trigger a database reset from a client
    * @method reset
    * @param {String} [simulatorId] The Simulator's ID
    * @example
    *     // Reset just the `voyager`
    *     Meteor.call("reset", "voyager-id");
    * @example
    *     // Reset all simulators
    *     Meteor.call("reset");
    */

For a thorough reference to how to document methods, visit [YUIDoc's syntax reference](http://yui.github.io/yuidoc/syntax/index.html).

### Commenting templates
Templates unsurprisingly fall under the `Templates` module. Template classes are the template's name. Properties exposed to the view as a handlebars helper are treated as `@property`s. Each event in the event map is treated as a `@method`.

The following is an example of how to document a template

    /**
    @module Templates
    @submodule Cards
    */
    /**
    Station card for viewing and managing the current alert condition
    @class card_alertCondition
    */
    
    /**
    The alert condtion for the simulator
    @property alertCondition
    @type Number
    */
    Template.card_alertCondition.alertCondition = function() {
      var a = Flint.simulator('alertCondition');
      return a;
    };
    
    /**
    The bootstrap styling for a given alert condition level
    @property alertStyle
    @type String
    */
    Template.card_alertCondition.alertStyle = function() {
      var a = Flint.simulator('alertCondition');
      switch (a) {
      case 4:
        return 'success';
      case 3:
        return 'info';
      case 2:
        return 'block';
      case 1:
        return 'error';
      }
    };
    
    Template.card_alertCondition.events = {
      
      /**
      When you click one of the alertCondition buttons, change the alert condition to the `data-alert` attribute of the containing box
      @method click .btn
      */
      'click .btn': function(e) {
        Flint.beep();
        var a = $(e.target).parents('[data-alert]').data('alert');
        Flint.simulators.update(Flint.simulatorId(), {$set: {alertCondition: a}});
        e.preventDefault();
      }
    };

## Contributing
All Javascript code contributions must pass JSHint testing. JSHint automatically tests all code 

Unit testing is in development, and will follow the `mrt test-packages` standard. More documentation on using Tinytest is forthcoming.

## Contributor's Agreement
Unless prior arrangements are made, all contributions to this project are completely volunteer and uncompensated. You'll get a pat on the back and a big "thank you", and we'll put your name in CREDITS.md. By contributing, you assign all rights and ownership to any contributions you make to this project to The Space EdVentures Foundation, Inc. You also certify that you are able to do so without conflicting with other agreements (e.g. with employers, etc.).

## Licenses & 3rd party software
3Rd party software in the project is governed by their respective license. Check out the licenses at the top of the various files for more information on the licenses for various components. See LICENSE.md for specifics.
