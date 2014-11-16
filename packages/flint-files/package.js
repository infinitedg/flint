Package.describe({
  summary: "Centralized file access for CollectionFS",
  version: "0.1.0"
});

Package.on_use(function(api) { 
  api.use(['flint', 'cfs:standard-packages', 'cfs:filesystem', 'cfs:s3', 'underscore']);
   
  api.add_files(['common.js', 'stores.js'], ['server', 'client']);
});
