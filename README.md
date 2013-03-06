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
8. Run `cd flint` and then `mrt` to fire it up! If you get any errors, review the above commands and try again.

## A note for windows users
_Note: I do not have a windows system running Meteor, meteorite, or NPM. I don't know how they work on Windows, so the following are my assumptions about how it should work. Feel free to submit a pull request with edits to this document if you want to make corrections._

Meteor does not install from the command line on windows like step 2 above indicates. Instead, visit [win.meteor.com](http://win.meteor.com) and download the latest installer. The windows fork of Meteor tends to be up to date, however it is not fully supported.

If you are doing work on client software (e.g. Arduino kits or your own [kiosk](https://bitbucket.org/spacecenter/flint-kiosk) software), then contact Brent and we can get an instance running online.

## Contributing
* All Javascript code contributions must pass JSHint testing. To run JSHint testing:
	1. `cd tests`
	2. `npm install` (Only do this the first time. From time to time, you may also want to run `npm update` to keep your modules up to date)
	3. `grunt`

* We will also add unit tests in the future which will also run via `grunt` from the `/tests` directory using the same instructions as above.

## Contributor's Agreement
Unless prior arrangements are made, all contributions to this project are completely volunteer and uncompensated. You'll get a pat on the back and a big "thank you", and we'll put your name in the credits below. By contributing, you assign all rights to any contributions you make to this project to The Space EdVentures Foundation, Inc.

## Credits
1. Brent Anderson