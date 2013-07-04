/**
@class Flint
*/
Flint = this.Flint || {};
  
//Flint.Log = Winston;

// @TODO: Port logging to winston, enable client & server-side logging streaming

/**
Logging object from [`observatory-apollo`](https://atmosphere.meteor.com/package/observatory)
@property Log
@type Object
*/
Flint.Log = TLog.getLogger(TLog.LOGLEVEL_MAX, true);


/**
1st priority logging - reserved for fatal/critical errors
@method Log.fatal
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
2nd priority logging - Reserved for significant errors
@method Log.error
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
3rd priority logging - Reserved for warnings, non-bloking errors
@method Log.warn
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
4rd priority logging - Reserved for information, helpful data
@method Log.info
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
5th priority logging - Reserved for descriptive messages, may be ignored
@method Log.verbose
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
6th priority logging - Most granular level of reporting - __Will be ignored in production__
@method Log.debug
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
Logging for caught error objects
@method Log.trace
@param {Error} error The error object to log
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/

/**
Logging of objects for inspection in the console
@method Log.dir
@param {Object} object The object to inspect/log
@param {String} message The message to log
@param {String} [module] The module associated with the message
*/
