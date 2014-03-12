Package.describe({
  summary: 'Greensocks library for animation and dragging'
});

Package.on_use(function(api) {  
  
  api.add_files(['CSSPlugin.js', 'Draggable.js', 'TweenLite.js', 'cssShake.css'], 'client');

});
