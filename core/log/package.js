Package.describe({
  summary: "Wrapper to Winston"
});

Package.on_use(function(api) { 
  api.use(['winston', 'log']);
  
  api.add_files('logger.js', ['client', 'server']);
});
