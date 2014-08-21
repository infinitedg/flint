Flint.collection('systems').find().observeChanges({
	changed: function(id, fields){
		if (fields.damageStatus){
			if (fields.damageStatus == 'damaged'){
				var simulatorId = Flint.collection('systems').findOne(id).simulatorId;
				var sysName = Flint.collection('systems').findOne(id).name;
				var damageReports = Flint.collection('systems').findOne(id).damageReportTemplates;
				var usableReports = [];
				for (var report in damageReports){
					
					if (damageReports[report].type == 'short'){
						usableReports.push(damageReports[report]);
					}
				}
				var reportPick = Math.floor(Math.random() * usableReports.length); //Get a random report
				var obj = {
					'simulatorId' : simulatorId,
					'system' : sysName,
					'report' : usableReports[reportPick]
				};
				var reportId = Flint.collection('damageReports').insert(obj);
				Flint.collection('systems').update(id,{$set: {'currentDamageReport' : reportId}});
			}
		}

	}
})
Meteor.publish('cards.card-damageReports.damageReports', function(simulatorId) {
	return Flint.collection('damageReports').find({ simulatorId: simulatorId});
});