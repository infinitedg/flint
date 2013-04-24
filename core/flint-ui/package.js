Package.describe({
  summary: "Build a simulator interface using themes, cards, and layouts."
});

Package.on_use(function(api) {  
  api.use(['log', 'templating', 'flint-core', 'utils']);
  
  api.add_files('main.html', 'client');
  api.add_files(['routing.js', 'render.js', 'ui.js'], 'client');
  // TODO: Move this to the core layout package.
  api.add_files('lib/jquery.masonry.min.js', 'client');
});
