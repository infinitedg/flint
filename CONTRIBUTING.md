Flint Contribution Instructions
====================

Infinte Development Group welcomes all contributions to the main Flint repository. Any contributions which fit within these guidelines will be merged and included with the rest of the codebase.

## What needs to be done

* Check the issues tab for features and bug which need to be addressed.
* Ask for access to the Farpoint Google Drive to see notes on controls designs. Contact one of the primary contributors for more information.
* Think of an awesome feature yourself and implement it. Share it with the community.

## Requesting features or reporting bugs

* Submit an issue for your bug or feature, assuming one does not already exist.
	* Clearly describe the issue or feature, including steps to reproduce when it is a bug.
	* Make sure you fill in the earliest version that you know has the issue.

## Getting Started

Fork, then clone the repo:

    git clone git@github.com:your-username/flint.git

Run `curl https://install.meteor.com | sh` to install Meteor

Set up your `settings.json` file.

Run flint with `meteor --settings settings.json`

## Making Changes

* Create a topic branch from where you want to do your work.
  * This is usually based on the master branch.
  * Never target release branches (eg. master or development). If you are certain your fix must be on that
    branch, label your topic branch 'master/bugfix'.
  * To quickly create a topic branch based on master; `git checkout -b
    fix/my_contribution master`. or `git checkout -b features/feature_name master`. Please avoid working directly on the
    `master` branch.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the [proper format][commit].

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/infinitedg/flint/compare/

We'll review your pull request promptly, within three business days usually. If it meets our standards and the goals of the project, we'll merge it. 

Some things that will increase the chance that your pull request is accepted:

* Write tests.
* Follow our [style guide][style].
* Write a [good commit message][commit].

[style]: https://github.com/infinitedg/guides/tree/master/style
[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html