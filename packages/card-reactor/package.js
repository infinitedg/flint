Package.describe({
  "summary": "Template Card",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'less', 'mizzao:bootboxjs', 'infinitedg:gsap']);
  
  api.add_files(['core.html', 'core.js','svg.html'], 'client');
  api.add_files(['card.html', 'card.js', 'card.less'], 'client');
});
