Package.describe({
  summary: "Micro-queue provides a small, fast queue/list built for Power-Queue"
});

Package.on_use(function (api) {

  api.use('deps', ['client', 'server']);

  api.export && api.export('MicroQueue');
  api.add_files(['micro-queue.js'], ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('micro-queue');
  api.use('test-helpers', 'server');
  api.use('tinytest');

  api.add_files('tests.js');
});
