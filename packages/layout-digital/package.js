Package.describe({
  summary: "Digital layout.",
  version: "0.0.1"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'less', 'ccorcos:transitioner', 'iron:router']);
  
    api.add_files(['model.js'], ['server', 'client']);
    api.add_files(['publish.js'], 'server');
    api.add_files(['messageBox.html', 'messageBox.js', 'messageBox.css',
    /*'cardList.html', 'cardList.js', 
    , ,*/
    'template.html', 'template.js', 'layout.less', 'transitioner.js'], 'client');
    
});
