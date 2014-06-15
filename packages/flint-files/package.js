Package.describe({
  summary: "Centralized file access for CollectionFS"
});

Package.on_use(function(api) { 
  api.use(['flint', 'collectionFS', 'cfs-filesystem', 'underscore']);
   
  api.add_files('common.js', ['server', 'client']);
});
