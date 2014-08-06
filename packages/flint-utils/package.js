Package.describe({
  summary: "Utilities, often extending Meteor."
});

Package.on_use(function(api) {
  api.add_files(['memoize.js'], ['client', 'server']);
  api.export("Utils");
});