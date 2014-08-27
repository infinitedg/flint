Package.describe({
  summary: "ReactiveList provides a small, fast queue/list built for Power-Queue"
});

Package.on_use(function (api) {

  api.use('deps', ['client', 'server']);

  api.export && api.export('ReactiveList');
  api.add_files(['reactive-list.js'], ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('reactive-list');
  api.use('test-helpers', 'server');
  api.use('tinytest');

  api.add_files('tests.js');
});
