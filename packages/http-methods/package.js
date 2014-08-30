Package.describe({
  version: '0.0.23',
    summary: 'Adds HTTP.methods RESTful'
});

Package.on_use(function(api) {
  'use strict';
  api.use(['webapp', 'underscore', 'ejson'], 'server');

  api.use('http', { weak: true });

  api.export && api.export('HTTP');

  api.export && api.export('_methodHTTP', { testOnly: true });

  api.add_files('http.methods.client.api.js', 'client');
  api.add_files('http.methods.server.api.js', 'server');

});

Package.on_test(function (api) {
  api.use('http-methods', ['server']);
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.add_files('http.methods.tests.js', 'server');
});
