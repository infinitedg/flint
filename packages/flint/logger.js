/**
@class Flint
*/

/**
Logging object from [`winston-client`](https://atmosphere.meteor.com/package/winston-client) for the client,
[`winston`](https://atmosphere.meteor.com/package/winston) for the server.
@property Log
@type Object
*/
Flint.Log = Winston;
// Flint.Log = {
// 	error: function(str) {
// 		console.log(str);
// 	},
// 	warn: function(str) {
// 		console.log(str);
// 	},
// 	help: function(str) {
// 		console.log(str);
// 	},
// 	data: function(str) {
// 		console.log(str);
// 	},
// 	info: function(str) {
// 		console.log(str);
// 	},
// 	debug: function(str) {
// 		console.log(str);
// 	},
// 	prompt: function(str) {
// 		console.log(str);
// 	},
// 	verbose: function(str) {
// 		console.log(str);
// 	},
// 	input: function(str) {
// 		console.log(str);
// 	},
// 	silly: function(str) {
// 		console.log(str);
// 	},
// };

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


var options = {
  "level": "info",
  "subdomain": "flint",
  "inputToken":"38b1d170-38dc-45fb-9e9b-f815211c5359",
  "json": true,
  "handleExceptions": true
};

// Configure the server's logging behavior and transports
if (Meteor.isServer) {
  Winston.cli({colorize: true});
  Winston.add(Winston_Loggly, options);
  Winston.info('Added winston loggly transport');
}