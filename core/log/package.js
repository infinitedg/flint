Package.describe({
  summary: "Wrapper to Winston"
});

Package.on_use(function(api) { 
  api.use(['winston-client', 'winston-loggly']);
  
  api.add_files('logger.js', ['client', 'server']);
});
