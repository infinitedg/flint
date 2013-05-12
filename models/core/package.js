Package.describe({
});

Package.on_use(function(api) { 
  api.use('flint-models');  
  api.use('flint-fixtures');
  api.add_files(['odyssey.json', 'phoenix.json', 'voyager.json'], 'server');
});
