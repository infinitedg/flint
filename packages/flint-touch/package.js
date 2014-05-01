Package.describe({
  summary: 'Allows for touch events on tablets on smartphones'
});

Package.on_use(function(api) {  
  
  api.add_files(['jquery.ui.touch-punch.min.js'], 'client');
  
});
