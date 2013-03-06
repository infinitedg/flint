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
}());