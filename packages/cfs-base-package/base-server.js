/**
 * @method FS.Utility.binaryToBuffer
 * @public
 * @param {Uint8Array} data
 * @returns {Buffer}
 *
 * Converts a Uint8Array instance to a Node Buffer instance
 */
FS.Utility.binaryToBuffer = function(data) {
  var len = data.length;
  var buffer = new Buffer(len);
  for (var i = 0; i < len; i++) {
    buffer[i] = data[i];
  }
  return buffer;
};

/**
 * @method FS.Utility.bufferToBinary
 * @public
 * @param {Buffer} data
 * @returns {Uint8Array}
 *
 * Converts a Node Buffer instance to a Uint8Array instance
 */
FS.Utility.bufferToBinary = function(data) {
  var len = data.length;
  var binary = EJSON.newBinary(len);
  for (var i = 0; i < len; i++) {
    binary[i] = data[i];
  }
  return binary;
};

FS.Utility.safeCallback = function (callback) {
    // Make callback safe for Meteor code
    return Meteor.bindEnvironment(callback, function(err) { throw err; });
};

FS.Utility.safeStream = function(nodestream, name) {
  if (!nodestream || typeof nodestream.on !== 'function')
    throw new Error('Storage Adapter "' + name + '" did not return write stream');

  // Create Meteor safe events
  nodestream.safeOn = function(name, callback) {
    return nodestream.on(name, FS.Utility.safeCallback(callback));
  };

  // Create Meteor safe events
  nodestream.safeOnce = function(name, callback) {
    return nodestream.once(name, FS.Utility.safeCallback(callback));
  };

  // Return the modified stream - modified anyway
  return nodestream;
};
