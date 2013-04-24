Package.describe({
  summary: "The basic backbone of a simulator."
});

Package.on_use(function(api) {
  api.use(['log', 'templating', 'utils']);
  
  api.add_files(['collections.js'], ['client', 'server']);
  api.add_files(['core_client.js', 'routing.js', 'loading.html'], 'client');
  api.add_files(['core_server.js'], 'server');
});
