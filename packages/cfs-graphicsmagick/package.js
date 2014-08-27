Package.describe({
  summary: "Adds `gm` to scope with the ability to perform GraphicsMagick or ImageMagick manipulation"
});

Npm.depends({
  gm: "1.14.2"
});

//also requires that you install the ImageMagick
//and GraphicsMagick apps on your server

Package.on_use(function(api) {

  api.add_files('gm.js', 'server');

  api.export('gm');
});

Package.on_test(function(api) {
  api.use(['cfs-graphicsmagick', 'test-helpers', 'tinytest'], 'server');
  api.add_files('tests/server-tests.js', 'server');
});
