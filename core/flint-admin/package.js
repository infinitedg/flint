/**
@class Flint
*/
Package.describe({
  summary: "Provides administrative controls for managing simulators, stations, and cards."
});

Package.on_use(function(api) { 
  api.use(['log', 'flint-debug', 'templating']);
   
  api.add_files(['admin.html', 'admin.js'], 'client');
  api.add_files(['admin-subscriptions.js'], 'server');
});
