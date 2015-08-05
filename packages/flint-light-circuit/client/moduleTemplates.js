var Modules = Flint.collection('lightcircuit-modules');

Template.lightModule_default.rendered = function(){
	var self = this;
	$('.colorpicker').spectrum({
		color:'#000',
		showInput:false,
		className:'full-spectrum',
		showInitial:false,
		flat:true,
		maxSelectionSize:10,
		preferredFormat:'rgb',
		showButtons:false,
		move:function(color) {
			Modules.update({_id:self.data._id}, {$set:{color:color.toRgbString()}});
		},
	});
};

Template.lightModule_default.events({
	'blur #module_label':function(e){
		Modules.update({_id:this._id}, {$set:{label:e.target.value}});
	},
});

Template.lightModule_value.events({
	'change #module_value':function(e){
		Modules.update({_id:this._id}, {$set:{arguments:{value:e.target.value}}});
	},
});

Template.lightModule_comment.events({
	'change #module_title':function(e){
		var argumentsList;
		if (Modules.findOne({_id:this._id})){
			argumentsList = Modules.findOne({_id:this._id}).arguments;
			argumentsList.title = e.target.value;
			Modules.update({_id:this._id}, {$set:{arguments:argumentsList}});
		}
	},
	'change #module_body':function(e){
		var argumentsList;
		if (Modules.findOne({_id:this._id})){
			argumentsList = Modules.findOne({_id:this._id}).arguments;
			argumentsList.body = e.target.value;
			Modules.update({_id:this._id}, {$set:{arguments:argumentsList}});
		}
	},
});
Template.lightModule_conditional.events({
	'change #module_type':function(e){
		Modules.update({_id:this._id}, {$set:{arguments:{type:e.target.value}}});
	},
});
Template.lightModule_operation.events({
	'change #module_type':function(e){
		Modules.update({_id:this._id}, {$set:{arguments:{type:e.target.value}}});
	},
});
