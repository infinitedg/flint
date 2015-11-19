Package.describe({
	summary: "Curve Layout.",
	version: "0.0.1",
	notes: 'Design Copyright Todd and BJ; used under license'
});

Package.on_use(function(api) { 
	api.use(['flint', 'templating', 'less', 'ccorcos:transitioner', 'iron:router']);
	api.add_files(['layout.html', 'layout.js', 'layout.less', 'transitioner.js'], 'client');
	api.add_files(['fonts/styles.css','theme.less'],'client');
	api.addAssets(['fonts/sn-Boldfont.ttf','fonts/DINAlternate-Bold.ttf'],'client');
	api.addAssets(['fonts/sn-Boldfont.eot','fonts/DINAlternate-Bold.eot'],'client');
	api.addAssets(['fonts/sn-Boldfont.svg','fonts/DINAlternate-Bold.svg'],'client');
	api.addAssets(['fonts/sn-Boldfont.woff','fonts/DINAlternate-Bold.woff'],'client');
	api.addAssets(['images/slice1.png','images/slice2.png','images/slice3.png'],'client');
	api.addAssets(['images/background-blue.svg','images/background-yellow.svg','images/background-orange.svg'],'client');
	api.addAssets(['images/background-red.svg','images/background-purple.svg'],'client');
	api.addAssets(['images/simulatorLogo.png'],'client');
});
