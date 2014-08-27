// #ReactiveProperty
// A simple class that provides an reactive property interface

/**
  * @constructor
  * @param {any} defaultValue Set the default value for the reactive property
  *
  * This api should only be in the internal.api.md
  */
ReactiveProperty = function(defaultValue) {
  var self = this;
  var _deps = new Deps.Dependency();

  /** @property ReactiveProperty.value
    * @private
    * This contains the non reactive value, should only be used as a getter for
    * internal use
    */
  self.value = defaultValue;

  /**
    * @method ReactiveProperty.get
    * Usage:
    * ```js
    *   var foo = new ReactiveProperty('bar');
    *   foo.get(); // equals "bar"
    * ```
    */
  self.get = function() {
    _deps.depend();
    return self.value;
  };

  /**
    * @method ReactiveProperty.set Set property to value
    * @param {any} value
    * Usage:
    * ```js
    *   var foo = new ReactiveProperty('bar');
    *   foo.set('bar');
    * ```
    */
  self.set = function(value) {
    if (self.value !== value) {
      self.value = value;
      _deps.changed();
    }
  };

  /**
    * @method ReactiveProperty.dec Decrease numeric property
    * @param {number} [by=1] Value to decrease by
    * Usage:
    * ```js
    *   var foo = new ReactiveProperty('bar');
    *   foo.set(0);
    *   foo.dec(5); // -5
    * ```
    */
  self.dec = function(by) {
    self.value -= by || 1;
    _deps.changed();
  };

  /**
    * @method ReactiveProperty.inc increase numeric property
    * @param {number} [by=1] Value to increase by
    * Usage:
    * ```js
    *   var foo = new ReactiveProperty('bar');
    *   foo.set(0);
    *   foo.inc(5); // 5
    * ```
    */
  self.inc = function(by) {
    self.value += by || 1;
    _deps.changed();
  };

  /**
    * @method ReactiveProperty.getset increase numeric property
    * @param {any} [value] Value to set property - if undefined the act like `get`
    * @returns {any} Returns value if no arguments are passed to the function
    * Usage:
    * ```js
    *   var foo = new ReactiveProperty('bar');
    *   foo.getset(5);
    *   foo.getset(); // returns 5
    * ```
    */
  self.getset = function(value) {
    if (typeof value !== 'undefined') {
      self.set(value);
    } else {
      return self.get();
    }
  };

};
