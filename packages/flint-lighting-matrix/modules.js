Template.lightingmodule_channel.events({
	'change input':function(e){
		var data = Flint.collection('flintLightingModules').findOne({_id:this._id}).data;
		data[e.target.name] = e.target.value;
		Flint.collection('flintLightingModules').update({_id:this._id},{$set:{data:data}});
	}
});
