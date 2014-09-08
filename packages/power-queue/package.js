Package.describe({
  summary: "PowerQueue is a powerful tool for handling async tasks, throtling etc."
});

Package.on_use(function (api) {

  api.use(['deps', 'reactive-property'], ['client', 'server']);

  // We let the user decide what spinal queue to use - We support both
  // reactive-list and micro-queue they obey the spinal-queue spec
  api.use(['reactive-list', 'micro-queue'], ['client', 'server'], { weak: true });

  api.export && api.export('PowerQueue');
  api.add_files(['power-queue.js'], ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['power-queue', 'reactive-list']);
  api.use('test-helpers', ['server', 'client']);
  api.use('tinytest');

  api.add_files('tests.js');
});
