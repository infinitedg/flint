Package.describe({
  summary: "Show notifications on the client's screen."
});

Package.on_use(function(api) { 
  api.use('log');
   
  api.add_files('notifications.js', 'client');
});
