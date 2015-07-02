Flint.collection('systems').find({'name' : 'Transporters'}).observeChanges({
	'changed' : function(id, fields){
		if (fields.powerUp){
			if (fields.powerUp < 2){
				var transporters = Flint.collection('systems').findOne(id);
				var targets = transporters.targets;
				var locked = transporters.locked;
				var removeKey;
				for (i=0; i < targets.length; i++){
					if (targets[i].targetId == locked){

						removeKey = i;
						break;
					}
				}
				if (removeKey){targets.splice(removeKey,1);}
				var state = 'idle';
				Flint.collection('systems').update(id,{$set: {'locked' : 'false', 'state' : state, 'targets' : targets}});
				Meteor.setTimeout(function(){
					Flint.tween('systems',id,3,{'powerUp' : 100});
				},1000);

			}
		}
	}
});
