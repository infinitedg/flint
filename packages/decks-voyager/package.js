Package.describe({
  "summary": "Voyager Deck SVG",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['decks.html', 'decks.js'], 'client');
});
