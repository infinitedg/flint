Package.describe({
  summary: "Setup and manage distributed, periodic processes",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'underscore']);
   
  api.add_files(['drama.js', 'actors.js'], ['server']);
});
