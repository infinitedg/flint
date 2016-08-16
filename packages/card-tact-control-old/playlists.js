Template.playlistPlayer.events = {
	'click .preset': function(e,t){
		console.log('WOrking');
		Flint.system('Viewscreen','video',e.currentTarget.dataset.preset);
	},
	'click .videoLibrary': function(e,t){
		Flint.system('Viewscreen','video',this.fullPath);
		console.log(this);
	}

};

Template.playlistPlayer.helpers({
	libraryList: function(){
		return Flint.Asset.listFolder('/Videos/Library').containers;
	}
});
