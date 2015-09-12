Package.describe({
  name: 'flint-midi',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Provide support for MIDI controllers',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use(['flint', 'templating']);
  api.addFiles(['component.html', 'client.js'], 'client');
  api.addFiles(['server.js'], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('flint-jobs');
  api.addFiles('flint-jobs-tests.js');
});
