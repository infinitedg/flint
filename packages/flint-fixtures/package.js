Package.describe({
  summary: "Import fixture files to initialize the server.",
  internal: false
});

Package.on_use(function(api) {  
  // We're going to use the addFixture file from flint-models.
  api.use('flint');
});

// // TODO: Since we add this package to the app's packages folder, this
// //       extension is applied to the entire project.
// var fs = Npm.require('fs');
// // Package.register_extension(
// Package._transitional_registerBuildPlugin(
//   "json", function(bundle, source_path, serve_path, where) {
    
//     if (where !== "server") {
//       console.warn("Warning: Can not add json file as a fixture to the client. (" + source_path + ")", 'flint-fixtures');
//       return;
//     }
    
//     // @TODO: xxx - Probably should deal with encodings better.
//     var json = fs.readFileSync(source_path);
//     var result = "Flint.addFixture(" + json.toString('utf8') + ");";
    
//     bundle.add_resource({
//       type: "js",
//       where: "server",
//       path: serve_path,
//       data: result
//     });
//   }
// );
