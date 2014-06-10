Meteor.startup(function() {
	if (Meteor.absoluteUrl() === "http://flint-demo.spaceedventures.org/") {
		Kadira.connect('RDdnWDiGhuFxWtmYG', 'ec95c1a1-f361-4bc4-964e-94223a8a476b');
	}
});
