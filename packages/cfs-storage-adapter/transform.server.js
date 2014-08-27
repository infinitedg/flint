var PassThrough = Npm.require('stream').PassThrough;

FS.Transform = function(options) {
  var self = this;

  options = options || {};

  if (!(self instanceof FS.Transform))
    throw new Error('FS.Transform must be called with the "new" keyword');

  if (!options.adapter)
    throw new Error('Transform expects option.adapter to be a storage adapter');

  self.storage = options.adapter;

  // Fetch the transformation functions if any
  self.transformWrite = options.transformWrite;
  self.transformRead = options.transformRead;
};

// Allow packages to add scope
FS.Transform.scope = {
// Deprecate gm scope:
  gm: function(source, height, color) {
    console.warn('Deprecation notice: `this.gm` is deprecating in favour of the general global `gm` scope');
    if (typeof gm !== 'function')
      throw new Error('No graphicsmagick package installed, `gm` not found in scope, eg. `cfs-graphicsmagick`');
    return gm(source, height, color);
  }
// EO Deprecate gm scope
};

// The transformation stream triggers an "stored" event when data is stored into
// the storage adapter
FS.Transform.prototype.createWriteStream = function(fileObj, options) {
  var self = this;

  // Get the file key
  var fileKey = self.storage.fileKey(fileObj);

  // Rig write stream
  var destinationStream = self.storage.createWriteStreamForFileKey(fileKey, {
    // Not all SA's can set these options and cfs dont depend on setting these
    // but its nice if other systems are accessing the SA that some of the data
    // is also available to those
    aliases: [fileObj.name()],
    contentType: fileObj.type(),
    metadata: fileObj.metadata
  });

  if (typeof self.transformWrite === 'function') {

    // Rig read stream for gm
    var sourceStream = new PassThrough();

    // We pass on the special "stored" event for those listening
    destinationStream.on('stored', function(result) {
      sourceStream.emit('stored', result);
    });

    // Rig transform
    try {
      self.transformWrite.call(FS.Transform.scope, fileObj, sourceStream, destinationStream);
      // XXX: If the transform function returns a buffer should we stream that?
    } catch(err) {
      // We emit an error - should we throw an error?
      console.warn('FS.Transform.createWriteStream transform function failed, Error: ');
      throw err;
    }

    // Return write stream
    return sourceStream;
  } else {

    // We dont transform just normal SA interface
    return destinationStream;
  }

};

FS.Transform.prototype.createReadStream = function(fileObj, options) {
  var self = this;

  // XXX: We can check the copy info, but the readstream wil fail no matter what
  // var fileInfo = fileObj.getCopyInfo(name);
  // if (!fileInfo) {
  //   return new Error('File not found on this store "' + name + '"');
  // }
  // var fileKey = folder + fileInfo.key;

  // Get the file key
  var fileKey = self.storage.fileKey(fileObj);

  // Rig read stream
  var sourceStream = self.storage.createReadStreamForFileKey(fileKey, options);

  if (typeof self.transformRead === 'function') {
    // Rig write stream
    var destinationStream = new PassThrough();

    // Rig transform
    try {
      self.transformRead.call(FS.Transform.scope, fileObj, sourceStream, destinationStream);
    } catch(err) {
      //throw new Error(err);
      // We emit an error - should we throw an error?
      sourceStream.emit('error', 'FS.Transform.createReadStream transform function failed');
    }

    // Return write stream
    return destinationStream;

  }

  // We dont transform just normal SA interface
  return sourceStream;
};
