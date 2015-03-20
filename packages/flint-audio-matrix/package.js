Package.describe({
  summary: "Controls for manipulating a MOTU16 A device through HTTP calls",
  version: "0.1.0",
  documentation: "README.md"
});

Package.on_use(function(api) {
  api.use(['flint', 'http', 'less', 'templating', 'underscore', 'infinitedev:dnscache', 'thepumpinglemma:flat', 'liyu:sprintfjs']);

  api.add_files(['fixtures.js', 'publish.js'], 'server');
  api.add_files(['card.html', 'card.js', 'card.less'], 'client');

  api.add_files(['matrix.js'], 'server');
});
