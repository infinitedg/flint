Package.describe({
  summary: "Allow picking a station from the client."
});

Package.on_use(function(api) {  
  api.use(['log', 'templating', 'flint-core', 'utils']);
  
  api.add_files(['stationPicker.html', 'stationPicker_client.js', 
                 'routing.js'], 'client');
  api.add_files(['stationPicker_server.js'], 'server');
});
