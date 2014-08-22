Package.describe({
  summary: 'Allows for touch events on tablets on smartphones',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.add_files(['jquery.ui.touch-punch.min.js'], 'client');
  
});
