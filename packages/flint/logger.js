/**
@class Flint
*/

var options = {
  "level": "info",
  "subdomain": "flint",
  "inputToken":"38b1d170-38dc-45fb-9e9b-f815211c5359",
  "json": true,
  "handleExceptions": true
},
logLevels = {"error":0,"warn":1,"help":2,"data":3,"info":4,"debug":5,"prompt":6,"verbose":7,"input":8,"silly":9};

function checkLevel(str) {
	return (logLevels[str] <= logLevels[options["level"]]);
};

/**
Centralized logger, modeled after Winston
@property Log
@type Object
*/
if (Meteor.isServer){
	Flint.Log = Winston;
	Winston.cli({colorize: true});
	Winston.add(Winston_Loggly, options);
	Winston.info('Added winston loggly transport');
} else {
Flint.Log = {
	error: function(str) {
			if (checkLevel('error')) {
				console.error(str);
			}
	},
	warn: function(str) {
			if (checkLevel('warn')) {
				console.warn(str);
			}
	},
	help: function(str) {
			if (checkLevel('error')) {
	//	console.log(str);
			}
	},
	data: function(str) {
			if (checkLevel('data')) {
	///	console.log(str);
			}
	},
	info: function(str) {
			if (checkLevel('info')) {
				console.info(str);
			}
	},
	debug: function(str) {
			if (checkLevel('debug')) {
				console.debug(str);
			}
	},
	prompt: function(str) {
			if (checkLevel('prompt')) {
	//	console.log(str);
			}
	},
	verbose: function(str) {
			if (checkLevel('verbose')) {
	//	console.log(str);
			}
	},
	input: function(str) {
			if (checkLevel('input')) {
	//	console.log(str);
			}
	},
	silly: function(str) {
			if (checkLevel('silly')) {
	//	console.log(str);
			}
	},
};
}

/**
1st priority logging - reserved for fatal/critical errors
@method Log.error
@param {String} message The message to log
*/

/**
2nd priority logging - Reserved for warnings, non-bloking errors
@method Log.warn
@param {String} message The message to log
*/

/**
3rd priority logging - Helpful message that are not necessarily problems
@method Log.help
@param {String} message The message to log
*/

/**
4rd priority logging - Logging for data, probably will appear in production
@method Log.data
@param {String} message The message to log
*/

/**
5th priority logging - Informational logging, the default cutoff for production messages
@method Log.info
@param {String} message The message to log
*/

/**
6th priority logging - Debugging logging, must be enabled to appear in client
@method Log.debug
@param {String} message The message to log
*/

/**
7th priority logging - Prompt logging, must be enabled to appear in client
@method Log.prompt
@param {String} message The message to log
*/

/**
8th priority logging - Very descriptive logs, must be enabled to appear in client
@method Log.verbose
@param {String} message The message to log
*/

/**
9th priority logging - Extremely descriptive logging, must be enabled to appear in client
@method Log.input
@param {String} message The message to log
*/

/**
10th priority logging - If you use this level of logging, you're just silly. Must be enabled to appear in client
@method Log.silly
@param {String} message The message to log
*/
