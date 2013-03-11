(function () {
	var render = function(name, options) {
		if (Template[name]) {
			return new Handlebars.SafeString(Template[name]());
		}
	};
	
	Handlebars.registerHelper('render', render);

	Handlebars.registerHelper('renderCard', function(name, options) {
		return render('card_' + name, options);
	});
	
	Handlebars.registerHelper('renderCore', function(name, options) {
		return render('core_' + name, options);
	});
	
	Handlebars.registerHelper('renderLayout', function(name, options) {
		return render('layout_' + name, options);
	});
}());