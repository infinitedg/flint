Template.core_targetingGrid.created = function(){
	this.subscription = Deps.autorun(function () {
		Meteor.subscribe('cards.core-targetingGrid.armies', Flint.simulatorId());
	});
	context.init({
		compact: true
	});
}
Template.core_targetingGrid.events({
	'contextmenu .target img': function (e, t) {
		Session.set('currentSensorIcon', {
			which: e.target.parentElement.id
		});
	}
})
Template.core_targetingGrid.helpers({
	armyTarget:function(){
		return Flint.collection('armyTarget').find();
	},
	icon:function(){
		var contextArray = [{
			header: 'Icon'
		}, {
			text: 'Icons',
			subMenu: iconList(this._id)
		}, {
			divider: true
		}, {
			text: 'IFF',
			subMenu: iffList(this._id)
		}, {
			text: 'Behaviors'
		}];
		context.attach(('#' + this._id), contextArray);
		return Flint.a('/Sensor Icons/' + this.icon);
	}
})

function changeIcon(icon, id) {
	Flint.collection('armyTarget').update(id, {
		$set: {
			icon: icon
		}
	});
}

function changeIFF(iff,id) {
	var color;
	switch (iff) {
		case 'Friendly':
		color = "#0077ff";
		break;
		case 'Neutral':
		color = "#ffff00";
		break;
		case 'Foe':
		color = "#ff0000";
		break;
		case 'Unknown':
		color = "#aaaaaa";
		break;
	}
	Flint.collection('armyTarget').update(id, {
		$set: {
			color: color
		}
	});
}

iconList = function (id) {
	var sel = {};
	var iconList = [];
	var folderList = Flint.Asset.listFolder('/Sensor Icons');
	folderList.containers.forEach(function(e){
		iconList.push({
			text: e.name,
			action: function (e) {
				changeIcon(e.target.text,id);
			}
		});
	})
	return iconList;
};
iffList = function (id) {
	var iffList = [];
	iffList.push({
		text: "Friendly",
		action: function (e) {
			changeIFF(e.target.text,id);
		}
	});
	iffList.push({
		text: "Neutral",
		action: function (e) {
			changeIFF(e.target.text,id);
		}
	});
	iffList.push({
		text: "Foe",
		action: function (e) {
			changeIFF(e.target.text,id);
		}
	});
	iffList.push({
		text: "Unknown",
		action: function (e) {
			changeIFF(e.target.text,id);
		}
	});
	return iffList;
};