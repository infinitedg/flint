Flint = this.Flint || {};

/**
 * Flint.log exposes the following basic logging functions, each of which takes an error and an optional module name
 *   * `Flint.fatal(_message_, [_module_])` - Highest level of reporting
 *   * `Flint.error(_message_, [_module_])` - Error level of reporting
 *   * `Flint.warn(_message_, [_module_])` - Non-blocking level of reporting
 *   * `Flint.info(_message_, [_module_])` - Helpful level of reporting
 *   * `Flint.verbose(_message_, [_module_])` - Verbose level of reporting
 *   * `Flint.debug(_message_, [_module_])` - Most verbose level of reporting, will be ignored in production
 * Also available are the following methods:
 *   * `Flint.trace(_error_, _message_, [_module_])` - Properly log an error object when caught
 *   * `Flint.dir(_object_, _message_, [_module_])` - Log an object directly for inspection
 */
Flint.Log = TLog.getLogger(TLog.LOGLEVEL_MAX, true);