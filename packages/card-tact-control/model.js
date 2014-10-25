Meteor.methods({
	updateTacticalScreen: function(){
		Flint.collection('tacticalScreenContacts').remove({});
		Flint.collection('tacticalContacts').find().forEach(function(doc){
			console.log(doc);
			Flint.collection('tacticalScreenContacts').insert(doc);
		});
	}
});