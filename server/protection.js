if (Meteor.absoluteUrl() === "http://flint-demo.spaceedventures.org/") {
	Accounts.config({ restrictCreationByEmailDomain: 'savethespacecenter.org'});
}
