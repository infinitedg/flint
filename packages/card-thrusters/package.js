Package.describe({
  "summary": "Thruster screen.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'less', 'infinitedg:gsap']);
  api.use(['ldk:three']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'thrusterStyle.css'], 'client');
  api.add_files(['rotation.html', 'rotation.js', 'style.less'], 'client');
    
});


        
