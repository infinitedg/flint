Package.describe({
  summary: "Layout for the admin page.",
  version: "0.0.1"
});

Package.on_use(function(api) {
  api.use(['flint', 'templating', 'iron:router', 'less']);

    api.add_files([
    'cardList.html', 'cardList.js',
    'template.html', 'template.js', 'template.less'], 'client');

});
