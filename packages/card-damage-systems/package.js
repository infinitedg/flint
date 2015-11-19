Package.describe({
	"summary": "Template Card",
	version: "0.1.0",
	author:"Alex Anderson",
});

Package.on_use(function(api) {
	api.use(['templating', 'flint', 'less', 'mizzao:bootboxjs']);
	api.add_files(['card.html', 'card.js', 'card.less'], 'client');
});
