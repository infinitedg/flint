Package.describe({
  summary: "A bootstrap slider control.",
  version: "0.1.0"
});

Package.on_use(function (api, where) {
  api.use('jquery');
  api.add_files(['./slider/css/slider.css', './slider/js/bootstrap-slider.js'], 'client');
});
