Package.describe({
  summary: "Sensors actor implementation",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'infinitedg:gsap', 'underscore', 'flint-server-monitor']);
   
  api.add_files(['server.js'], ['server']);
  api.add_files(['api.js'], ['client', 'server']);
});
