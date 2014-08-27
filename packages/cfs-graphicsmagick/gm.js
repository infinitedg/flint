//wrap gm() object with an object that exposes the same methods, with the addition of a
//.save() method that overwrites the FS.File's .buffer with the result

var nodegm = Npm.require('gm');
var path = Npm.require('path');
var fs = Npm.require('fs');

gm = function() {
  throw new Error('cfs:Graphicsmagic could not find "graphicsMagick" or "imageMagick"');
};

var graphicsmagick = false;
var imagemagick = false;

// Split the path by : or ;
// XXX: windows is not tested
var binaryPaths = process.env['PATH'].split(/:|;/);

// XXX: we should properly check if we can access the os temp folder - since
// gm binaries are using this and therefor may fail?

// XXX: we could push extra paths if the `gm` library check stuff like:
// $MAGIC_HOME The current version does not check there
// $MAGICK_HOME (GraphicsMagick docs)

// We check to see if we can find binaries
for (var i = 0; i < binaryPaths.length; i++) {
  var binPath = binaryPaths[i];

  // If we have not found GraphicsMagic
  if (!graphicsmagick) {
    // Init
    var gmPath = path.join(binPath, 'gm');
    var gmExePath = path.join(binPath, 'gm.exe');

    // Check to see if binary found
    graphicsmagick = fs.existsSync(gmPath) || fs.existsSync(gmExePath);

    if (graphicsmagick) console.log('=> GraphicsMagick found');

    // If GraphicsMagic we dont have to check for ImageMagic
    // Since we prefer GrapicsMagic when selecting api
    if (!graphicsmagick && !imagemagick) {
      // Init paths to check
      var imPath = path.join(binPath, 'convert');
      var imExePath = path.join(binPath, 'convert.exe');

      // Check to see if binary found
      imagemagick = fs.existsSync(imPath) || fs.existsSync(imExePath);

      if (imagemagick) console.log('=> ImageMagick found');

    }
  }
}


if (!graphicsmagick && !imagemagick) {
        // Both failed
        console.warn(
'WARNING:\n' +
'cfs:graphicsmagick could not find "graphicsMagic" or "imageMagic" on the\n' +
'system.\n' +
'\n' +
'I just checked PATH to see if I could find the GraphicsMagick or ImageMagic\n' +
'unix/mac os/windows binaries on your system, I failed.\n' +
'\n' +
'Why:\n' +
'1. I may be blind or naive, help making me smarter\n' +
'2. You havent added the path to the binaries\n' +
'3. You havent actually installed GraphicsMagick or ImageMagick\n' +
'\n' +
'*** Make sure "$PATH" environment is configured "PATH:/path/to/binaries" ***\n' +
'\n' +
'Installation hints:\n' +
'* Mac OS X "brew install graphicsmagick" or "brew install imagemagick"\n' +
'* Linux download rpm or use packagemanager\n' +
'* Centos "yum install GraphicsMagick"' +
'* Windows download the installer and run');

  gm.isAvailable = false;

} else {
  // Rig the gm scope

  if (graphicsmagick) {
    // Prefer graphicsmagick
    gm = nodegm;
  } else {
    // Use imageMagick - we subclass for the user
    var imageMagick = nodegm.subClass({ imageMagick: true });
    gm = imageMagick;
  }

  gm.isAvailable = true;
}
