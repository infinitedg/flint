Package.describe({
  version: '0.0.7',
  summary: "Add dropped event to Meteor UI Templates"
});

Package.on_use(function (api) {
  api.use(['ui', 'templating'], 'client');
  api.add_files(['dropped.event.js'], 'client');
});
