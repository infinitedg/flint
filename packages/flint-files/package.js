Package.describe({
  summary: "Centralized file access for CollectionFS",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'raix:collection-fs', 'raix:cfs-filesystem', 'underscore']);
   
  api.add_files('common.js', ['server', 'client']);
});
