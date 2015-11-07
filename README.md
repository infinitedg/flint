# Flint Project
Flint is the HTML5 Space Center controls platform. Flint uses [Meteor](http://www.meteor.com) as its core platform.

## Prerequisites
The Flint project requires familiarity with the command line on Windows, Mac, or Linux. You will need administrative privileges to run, as well.

If you aren't familliar with what `cd` or your command line does, then first take the [CLI Crashcourse on Learn Code the Hard Way](http://cli.learncodethehardway.org/book/).

## Getting Started
1. Fire up your Terminal
2. Run `curl https://install.meteor.com | sh` to install Meteor
3. Visit [NodeJS.org](http://nodejs.org/download/) and get the installer for your platform
4. Run the installer. You now have NodeJS (Which we may need at some point) and NPM (which we need in the next step!)
5. If you don't already have `git`, download it from [git-scm.org](http://git-scm.com/) and install it.
  * Find out if you have `git` by running `which git` on your command line. If it shows something like `/usr/bin/git` then you have it!
6. `cd` to the directory you'd like to keep `Flint` and clone it by running `git clone https://bitbucket.org/infinitedev/flint.git`
7. To run the project, simply fire up `meteor --settings settings.json`
  * You may need to create the settings.json file with new keys, based on settings.json.sample

## Contributing
All Javascript code contributions must pass JSHint testing. JSHint automatically tests all code

Unit testing is in development, and will follow the `meteor test-packages` standard. More documentation on using Tinytest is forthcoming.

## Contributor's Agreement
See docs/legal for the official contributors agreement. This document must be signed and returned to Infinite Development Group prior to making contributions to this repository.

### Legal TLDR
Unless prior arrangements are made, all contributions to this project are completely volunteer and uncompensated. You'll get a pat on the back and a big "thank you", and we'll put your name in CREDITS.md. By contributing, you assign all rights and ownership to any contributions you make to this project to Infinite Development Group. You also certify that you are able to do so without conflicting with other agreements (e.g. with employers, etc.).

## Licenses & 3rd party software
3Rd party software in the project is governed by their respective license. Check out the licenses at the top of the various files for more information on the licenses for various components. See LICENSE.md for specifics.

Flint is Copyright 2013-2015 by Infinite Development Group, LLC. All Rights Reserved Worldwide.
