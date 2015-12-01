Template.core_workOrders.helpers({
	workOrder:function(){
		return Flint.collection('workOrders').find({},{sort:{order:1}});
	},
	systems:function(){
		return Flint.systems.find();
	},
	isDiagnostic:function(){
		return this.maintenance.diagnostic === 'progress' || this.maintenance.diagnostic === 'complete';
	},
	systemTime:function(){
		return durationFormat(this.time) || '?';
	},
	time:function(){
		return durationFormat(this.time);
	},
	elapsed:function(){
		return durationFormat(this.elapsed);
	}
});

function durationFormat(time){
	var minutes = moment.duration(parseInt(time, 10) * 1000).minutes();
	var seconds = moment.duration(parseInt(time, 10) * 1000).seconds();
	if (seconds < 10){
		seconds = "0" + seconds;
	}
	return minutes + ":" + seconds;
}
Template.core_workOrders.events({
	'click .time':function(){

	},
	'click .systemTime':function(){
		var self = this;
		var system = Flint.systems.findOne({_id:this._id});
		var maintenance = system.maintenance || {};
		maintenance.diagnostic = 'complete';
		maintenance.report = '<h1>REPORT</h1>'
		//TODO: Bootbox which accepts seconds and minutes:seconds
		function checkTime(input){
			var re = /^([0-5]?[0-9]|[2][0-3]):([0-5][0-9])$|([0-1]?[0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;
			var output;
			var hour = 0;
			var minute = 0;
			var second = 0;
			output = re.exec(input);
			if (output === null){
				if (!isNaN(parseInt(input, 10))){
					return input;
				}
				return false;
			}
			//Parse the regex output;
			if (output[1]){
				minute = output[1];
				second = output[2];
			} else {
				hour = output[3];
				minute = output[4];
				second = output[5];
			}
			//return the number
			return parseInt(hour, 10) * 60 * 60 + parseInt(minute, 10) * 60 + parseInt(second, 10);
		}
		bootbox.prompt('Please enter a time',function(e){
			var time = checkTime(e);
			if (time === false){
				return false;
			}
			maintenance.time = time;
			Flint.systems.update({_id:self._id},{$set:{maintenance:maintenance}});
		});
	},
	'click .ping':function(){

	},
	'click .reject':function(){
		var system = Flint.systems.findOne({_id:this._id});
		var maintenance = system.maintenance || {};
		maintenance.diagnostic = 'idle';
		Flint.systems.update({_id:this._id},{$set:{maintenance:maintenance}});
	}
});

Template.core_workOrders.onCreated(function(){
	this.subscribe('damageControl.workOrders',Flint.simulatorId());
});
