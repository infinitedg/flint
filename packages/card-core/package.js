Package.describe({
	name: 'card-core',
	summary: "Card for rendering core widgets",
  version: "0.1.0",
	documentation: "README.md"
});

Package.onUse(function(api) {
  api.use(['templating', 'flint', 'underscore']);

  api.add_files(['card.html', 'card.js','core.css'], 'client');
});
