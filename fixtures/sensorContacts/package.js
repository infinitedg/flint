Package.describe({
  "summary": "Provides fixtures for sensorContact information"
});

Package.on_use(function(api) { 
  api.use('flint-models');
  api.add_files('collections.js', ['client', 'server']);
  api.use('flint-fixtures');
  api.add_files(['odyssey.json', 'phoenix.json', 'voyager.json'], 'server');
});
