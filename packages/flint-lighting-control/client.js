Meteor.startup(function(){
	Flint.collections.dmxMacro = new Mongo.Collection('dmxMacro',{connection:Flint.remote('light-server')});
})
Template.card_lightingControl.helpers({
	macro:function(){
		return Flint.collections.dmxMacro.find();
	}
})

Template.card_lightingControl.events({
	'click .macro':function(e){
		console.log(this);
	}
})