Package.describe({
  summary: "Control the simulation with actors."
});

Package.on_use(function(api) { 
  api.use('log');
   
  api.add_files('actor.js', 'server');
});
