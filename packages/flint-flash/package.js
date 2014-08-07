Package.describe({
  summary: "Flash a client's screen.",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'underscore']);
   
  api.add_files('flash.js', 'client');
});
