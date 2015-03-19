Package.describe({
  name: 'worker-animation',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Worker that handles processing animation',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use(['flint', 'flint-jobs', 'infinitedg:tween', 'underscore']);

  api.addFiles('worker-animation.js', ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('worker-animation');
  api.addFiles('worker-animation-tests.js');
});
