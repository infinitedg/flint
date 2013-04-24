Package.describe({
  summary: "Utilities, often extending Meteor."
});

Package.on_use(function(api, where) {
  where = where || ['client', 'server'];
  api.add_files(['memoize.js'], where);
});