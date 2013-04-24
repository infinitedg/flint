Package.describe({
  summary: "Instance of observatory-apollo"
});

Package.on_use(function(api) { 
  api.use('log');
   
  api.add_files('logger.js', ['client', 'server']);
});
