Package.describe({
  summary: "Model a simulator using fixture files."
});

Package.on_use(function(api) {  
  api.use(['log', 'flint-core', 'utils']);
  
  api.add_files('collection.js', ['client', 'server']);
  api.add_files(['fixture.js', 'reset.js'], 'server');
});
