Package.describe({
  summary: "Utilities, often extending Meteor.",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.add_files(['memoize.js'], ['client', 'server']);
  api.export("Utils");
});