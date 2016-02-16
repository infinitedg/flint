var macros;
Meteor.startup(function(){
	macros = new Mongo.Collection('dmxMacro',{connection:Flint.remote('light-server')});
})
Template.card_lightingControl.helpers({
	macro:function(){
		return macros.find();
	}
})