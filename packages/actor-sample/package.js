Package.describe({
  summary: "Sample actor implementation"
});

Package.on_use(function(api) { 
  api.use(['flint', 'flint-drama']);
   
  api.add_files(['actor.js'], ['server']);
});
