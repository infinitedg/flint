Package.describe({
  "summary": "Template Card",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'less', 'mizzao:bootboxjs', 'rubaxa:sortable']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.less'], 'client');
  api.add_files(['model.js'],['client','server']);
  api.add_files(['publish.js'],'server');
});
