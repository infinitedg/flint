Package.describe({
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['card.html'], 'client');
});
