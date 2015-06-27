Package.describe({
  version: '0.0.7',
  summary: "Add dropped event to Meteor UI Templates"
});

Package.onUse(function (api) {
  "use strict";
  api.use(['ui', 'templating'], 'client');
  api.addFiles(['dropped.event.js'], 'client');
});
