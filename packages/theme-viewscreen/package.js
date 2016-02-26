Package.describe({
  summary: "Viewscreen theme",
  version: "0.1.0"
});

Package.on_use(function(api) { 
	api.use(['templating','flint']);
	api.add_files(['1p1s.html','theme.html','theme.js'], ['client']);
});
