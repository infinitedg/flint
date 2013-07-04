Package.describe({
  "summary": "Core fixtures for defining simulator, structured simulator data"
});

Package.on_use(function(api) { 
  api.use('flint-models');  
  api.use('flint-fixtures');
  api.add_files(['odyssey.json', 'phoenix.json', 'voyager.json'], 'server');
});
