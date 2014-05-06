Package.describe({
});

Package.on_use(function(api) {  
    api.use(['templating', 'flint']);
  
    api.add_files(['card.html', 'card.js', 'card.css'], 'client');
    api.add_files(['model.js'], ['server', 'client']);
    api.add_files(['publish.js'], 'server');
                                            
});
