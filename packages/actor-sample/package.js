Package.describe({
  summary: "Sample actor implementation",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'flint-drama']);
   
  api.add_files(['actor.js'], ['server']);
});
