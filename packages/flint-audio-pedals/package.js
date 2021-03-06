Package.describe({
  summary: "Web Audio API Abstraction for configuring flint audio nodes",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['flint', 'templating', 'underscore', 'flint-jobs']);

  api.add_files(['engine.js'], 'server');
  api.add_files(['component.html', 'component.js','tuna.js'], 'client');

  api.export(['tuna'],'client');
});
