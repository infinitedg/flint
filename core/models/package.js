Package.describe({
  summary: "Temporary package containing the model of the simulator."
});

Package.on_use(function(api) { 
  api.use('flint-fixtures');
  
  api.add_files('models.js', ['client', 'server']);
});
