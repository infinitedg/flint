Template.card_recordsLog.helpers({
	log:function(){
		return Flint.collection('recordsLogs').find({state:'unassigned'});
	},
	includedLogs:function(){
		return Flint.collection('recordsLogs').find({state:'queued'});
	},
	recordsLogImage:function(){
		return Flint.a('/Records Log');
	},
	activeLog:function(){
		return Session.get('recordsLogs-activeLog');
	}
})

Template.card_recordsLog.events({
	'click .btn-writeLog':function(){
		$('.modal').modal();
	},
	'click .newRecordsLog':function(){
		var obj = {
			_id: Random.id(),
			simulatorId: Flint.simulatorId(),
			contents: []
		}
		Session.set('recordsLogs-activeLog',obj);
	}
})

Template.record_composer.helpers({
	stardate:function(){
		var now = new Date();
		var sd = now.getYear().toPrecision().slice(2,3) +
			Math.round(now.getMonth()/1.2) +

			now.getDay() + Math.round(now.getDate()/3.1)
			Math.round(Date.now()/5555555)/100
	}
})