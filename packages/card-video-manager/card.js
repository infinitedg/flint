Template.card_video_manager.created = function(){
	Meteor.subscribe('card.viewscreen.viewscreens',Flint.simulatorId());
	if (!Session.get('card.viewscreen.mainViewscreen')) Session.set('card.viewscreen.mainViewscreen',localStorage.getItem('viewscreen'));
	if (!Session.get('card.video_manager.videoConfig')) Session.set('card.video_manager.videoConfig',{
		template:{
			name:null,
			context:{}
		},
		viewscreenId:null,
		inputName:null,
		weight:null,
		priority:null,
	});
};

Template.card_video_manager.helpers({
	viewscreen: function(){
		return Flint.collection('viewscreens').find({simulatorId:Flint.simulatorId()});
	},
	viewscreenSelected: function(viewscreen){
		if (viewscreen === 'viewscreen'){
			return localStorage.getItem('viewscreen');
		}
		return Session.get('card.viewscreen.cueViewscreen');
	},
	mainViewscreen: function(){
		return Session.get('card.viewscreen.mainViewscreen');
	},
	previewViewscreen: function(){
		return Flint.simulatorId() + '-preview';
	}
});

Template.card_video_manager.events({
	'change [name="viewscreenSelect"]':function(e){
		var value = e.target.value;
		Session.set('card.viewscreen.mainViewscreen',value);
	},
	'click #cueInsert':function(){
		var viewscreen = Flint.simulatorId() + '-preview';
		var input = Session.get('card.video_manager.videoConfig');
		input.simulatorId = Flint.simulatorId();
		input.viewscreenId = viewscreen;
		Flint.collections.viewscreeninputs.insert(input);
		Session.set('card.video_manager.videoConfig',{
			template:{
				name:null,
				context:{}
			},
			viewscreenId:null,
			inputName:null,
			weight:null,
			priority:null,
		});
	},
	'click #viewscreenInsert':function(){
		var viewscreen = Session.get('card.viewscreen.mainViewscreen');
		var input = Session.get('card.video_manager.videoConfig');
		input.template.context.paused = !input.template.context.autoplay;
		input.simulatorId = Flint.simulatorId();
		input.viewscreenId = viewscreen;
		Flint.collections.viewscreeninputs.insert(input);
		Session.set('card.video_manager.videoConfig',{
			template:{
				name:null,
				context:{}
			},
			viewscreenId:null,
			inputName:null,
			weight:null,
			priority:null,
		});
	},
	'click #cueClear':function(){
		var viewscreen = Flint.simulatorId() + '-preview';
		Flint.collections.viewscreeninputs.find({viewscreenId:viewscreen}).forEach(function(e){
			Flint.collection('viewscreeninputs').remove({_id:e._id});
		});
	},
	'click #viewscreenClear':function(){
		var viewscreen = Session.get('card.viewscreen.mainViewscreen');
		Flint.collections.viewscreeninputs.find({viewscreenId:viewscreen}).forEach(function(e){
			Flint.collection('viewscreeninputs').remove({_id:e._id});
		});
	},
	'click #previewSelected':function(){

	},
	'click #cueToViewscreen':function(){
		var viewscreen = Session.get('card.viewscreen.mainViewscreen');
		Flint.collections.viewscreeninputs.find({viewscreenId:viewscreen}).forEach(function(e){
			Flint.collection('viewscreeninputs').remove({_id:e._id});
		});
		Flint.collections.viewscreeninputs.find({viewscreenId:Flint.simulatorId() + '-preview'}).forEach(function(e){
			delete e._id;
			e.viewscreenId = viewscreen;
			Flint.collection('viewscreeninputs').insert(e);
			Flint.collection('viewscreeninputs').remove({_id:e._id});
		});
	},
	'click #removeInput':function(){
		Flint.collection('viewscreeninputs').remove({_id:this._id});
	},
	'click #pauseInput':function(){
		var input = Flint.collection('viewscreeninputs').findOne({_id:this._id});
		input.template.context.paused = !input.template.context.paused;
		Flint.collection('viewscreeninputs').update({_id:this._id},{$set:{template:input.template}});
	}
});

Template.widget_video_manager.helpers({
	templates:function(){
		return Object.keys(Template).filter(function(e){
			return e.substring(0,10) === 'viewscreen';
		});
	},
	configTemplate:function(){
		if (Session.get('card.video_manager.videoConfig').template.name){
			return 'config_' + Session.get('card.video_manager.videoConfig').template.name;
		}
		//Set up the proper session variabled
		var template = Session.get('card.video_manager.videoConfig').template;
		var container = Flint.collections.flintassetcontainers.findOne({fullPath:template.context.video}) || {};
		Session.set('comp.flintAssetBrowser.selectedContainer',container._id);
		Session.set('comp.flintAssetBrowser.currentDirectory',container.folderPath);
		return false;
	},
	viewscreens:function(){
		return Flint.collection('viewscreens').find();
	},
	selectedViewscreen:function(){
		if (this._id === Session.get('card.video_manager.videoConfig').viewscreenId){
			return 'selected';
		}
	},
	context:function(){
		return JSON.stringify(Session.get('card.video_manager.videoConfig').template.context);
	},
	inputName:function(){
		return Session.get('card.video_manager.videoConfig').inputName;
	},
	weight:function(){
		return Session.get('card.video_manager.videoConfig').weight;
	},
	priorityChecked:function(priority){
		if (priority){
			if (Session.get('card.video_manager.videoConfig').priority){
				return 'checked';
			}
		} else {
			if (!Session.get('card.video_manager.videoConfig').priority){
				return 'checked';
			}
		}
	},
	selectedTemplate:function(){
		if (this.toString() === Session.get('card.video_manager.videoConfig').template.name){
			return 'selected';
		}
	},
	//This next line watches for a change in the Session.get('comp.flintAssetBrowser.selectedContainer')
	//So that I can attach the asset path to the macro preset
	selectedAsset:function(){
		var selectedContainer = Flint.collection('flintassetcontainers').findOne({_id:Session.get('comp.flintAssetBrowser.selectedContainer')});
		var template = Session.get('card.video_manager.videoConfig').template;
		template.context = template.context || {};
		if (template.context.video !== selectedContainer.fullPath){
			template.context.video = selectedContainer.fullPath;
			var videoConfig = Session.get('card.video_manager.videoConfig')
			videoConfig.template = template;
			Session.set('card.video_manager.videoConfig',videoConfig);
		}
		return '';
	}
});


Template.widget_video_manager.events({
	'change [name="inputName"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		videoConfig.inputName = e.target.value;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
	'change [name="viewscreenId"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		videoConfig.viewscreenId = e.target.value;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
	'change [name="weight"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		videoConfig.weight = e.target.value;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
	'change [name="priority"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		videoConfig.priority = !!e.target.value;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
	'change [name="template"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		var value = e.target.value;
		var template = videoConfig.template || {};
		template.context = template.context || {};
		template.name = value;
		videoConfig.template = template;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
	'change input[type="checkbox"]':function(e){
		var videoConfig = Session.get('card.video_manager.videoConfig');
		var value = e.target.checked;
		var template = videoConfig.template || {};
		template.context = template.context || {};
		template.context[e.target.name] = value;
		if (e.target.name === 'autoplay') template.context.paused = !value;
		videoConfig.template = template;
		Session.set('card.video_manager.videoConfig',videoConfig);
	},
});
