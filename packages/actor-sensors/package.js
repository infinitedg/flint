Package.describe({
  summary: "Sensors actor implementation"
});

Package.on_use(function(api) { 
  api.use(['flint', 'flint-drama', 'tween']);
   
  api.add_files(['actor.js'], ['server']);
});