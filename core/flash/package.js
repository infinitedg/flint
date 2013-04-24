Package.describe({
  summary: "Flash a client's screen."
});

Package.on_use(function(api) { 
  api.use('log');
   
  api.add_files('flash.js', 'client');
});
