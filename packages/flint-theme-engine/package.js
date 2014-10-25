Package.describe({
  summary: 'Theme handling system',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint', 'underscore', 'templating'], ['server', 'client']);

  api.add_files(['client.html', 'client.js'], ['client']);
});
