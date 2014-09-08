Package.describe({
  summary: 'Package to wrap Numeral-js, a library for formatting and manipulating numbers'
});

Package.on_use(function(api) {
  api.export('numeral');
  api.add_files(['numeral/numeral.js', 'meteor-numeral.js'], ['server','client']);
});

Package.on_test(function (api) {
  api.use(['numeral', 'tinytest']);
  api.add_files('meteor-numeral-tests.js', ['server', 'client']);
});
