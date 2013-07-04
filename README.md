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
7. `cd` to the directory you'd like to keep `Flint` and clone it by running `git clone git@bitbucket.org:spacecenter/flint.git`
8. Run `cd flint` and then `grunt run` to fire it up! If you get any errors, review the above commands and try again.

## A note for windows users
Meteor and Meteorite are not supported on Windows at this time. While windows users can access Flint from the browser, and may be able to run unit tests or generate documentation, Flint will not run as a server on a Windows system at this time.

Instead of attempting to run Flint on Windows, we recommend either setting up a bootable USB Drive running Ubuntu Linux (or any flavor of Linux you prefer), or running Linux in Virtualbox, and then developing in that environment.

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

## Contributing
All Javascript code contributions must pass JSHint testing. JSHint automatically tests all code 

Unit testing is in development, and will follow the `mrt test-packages` standard. More documentation on using Tinytest is forthcoming.

## Contributor's Agreement
Unless prior arrangements are made, all contributions to this project are completely volunteer and uncompensated. You'll get a pat on the back and a big "thank you", and we'll put your name in CREDITS.md. By contributing, you assign all rights and ownership to any contributions you make to this project to The Space EdVentures Foundation, Inc. You also certify that you are able to do so without conflicting with other agreements (e.g. with employers, etc.).

## Licenses & 3rd party software
3Rd party software in the project is governed by their respective license. Check out the licenses at the top of the various files for more information on the licenses for various components. See LICENSE.md for specifics.