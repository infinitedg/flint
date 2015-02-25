Template.card_video_manager.helpers({
	videoLibrary:function(){

	},
	videoClip: function(){

	},
	videoSegment:function(){

	}
})

Template.card_video_manager.rendered = function(){
	Session.set('comp.flintAssetBrowser.currentDirectory', '/Videos')
}