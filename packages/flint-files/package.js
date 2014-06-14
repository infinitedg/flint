Package.describe({
  summary: "Centralized file access for CollectionFS"
});

Package.on_use(function(api) { 
  api.use(['flint', 'collectionFS', 'cfs-filesystem', 'underscore']);
   
  api.add_files('start.js', ['client', 'server']);
  api.add_files('server.js', 'server');
  api.add_files('client.js', 'client');
  api.add_files('common.js', ['server', 'client']);
});
