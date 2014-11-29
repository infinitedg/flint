Package.describe({
  summary: "Videochat test card",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'pedrohenriquerls:peerjs']);
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  

});