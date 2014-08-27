Flint.Log.verbose("Observing flintSounds to prepare for playback", "flint-audio-engine");

// Convert soundGroups into soundPlayers on new objects
Flint.collection('flintSounds').find({soundGroups: {$not: { $size: 0 }}}).observe({
	added: function(doc) {
		// Map groups to specific players
		doc.soundGroups = doc.soundGroups || [];
		doc.soundPlayers = doc.soundPlayers || [];
		var newSoundPlayers = [];

		Flint.collection('flintSoundPlayers').find({groupNames: {$in: doc.soundGroups}, simulatorId: doc.simulatorId}).forEach(function(doc) {
			newSoundPlayers.push(doc.playerId);
		});
		
		var newPlayers = _.union(doc.soundPlayers, newSoundPlayers);

		Flint.collection('flintSounds').update(doc._id, {
			$set: {soundPlayers: newPlayers}, 
			$unset: {soundGroups: ""}
		});
	}
});

// Pruning players from sounds when the players don't exist
// Look only at sounds that have been rendered into groups
Flint.collection('flintSounds').find({soundGroups: {$exists: false}}, {fields: {soundPlayers: 1}}).observe({
	added: function(sound) {
		var prunedPlayers = [];
		for (var i = sound.soundPlayers.length - 1; i >= 0; i--) {
			if (!Flint.collection('flintSoundPlayers').findOne({playerId: sound.soundPlayers[i]})) {
				prunedPlayers.push(sound.soundPlayers[i]);
			}
		};

		Flint.collection('flintSounds').update(sound._id, {$pullAll: {soundPlayers: prunedPlayers}}, {multi: true});
	}
});

// General sound preparation
Flint.collection('flintSounds').find({}).observe({
	added: function(doc) {
		// ParentKeys must be an empty array, if nothing at all
		if (!Array.isArray(doc.parentSounds)) {
			Flint.collection('flintSounds').update(doc._id, {$set: {parentSounds: []}});
		}
	}
});

// Remove sound objects with no players, no groups, and no parents
Flint.collection('flintSounds').find({soundGroups: {$exists: false}, 
	soundPlayers: {$size: 0}, 
	parentSounds: {$size: 0}}).observe({
		added: function(sound) {
			Flint.collection('flintSounds').remove(sound._id);
		}
	});

// Prune removed sounds from the parentKeys of all other sounds
Flint.collection('flintSounds').find({}).observe({
		removed: function(sound) {
			Flint.collection('flintSounds').update({}, {$pull: {parentSounds: sound.parentKey}}, {multi: true});
		}
	});

// Watch for incoming clients, setup/takedown players where appropriate
Flint.Log.verbose("Observing flintClients for new players", "flint-audio-engine");
Flint.collection('flintClients').find({},{fields: {stationId: 1, simulatorId: 1}}).observe({
	added: function(doc) {
		// If this client has a station and that station has soundPlayerGroups...
		var station = Flint.stations.findOne(doc.stationId);
		if (station && station.soundPlayerGroups) {
			Flint.Log.verbose("Setting up sound player for client " + doc._id, "flint-audio-engine");
			Flint.collection('flintSoundPlayers').insert({
				playerId: doc._id,
				simulatorId: doc.simulatorId,
				groupNames: station.soundPlayerGroups
			});
		}
	},
	changed: function(doc) {
		// If this client has a station and that station has soundPlayerGroups...
		var station = Flint.stations.findOne(doc.stationId);
		if (station && station.soundPlayerGroups) {
			if (station.soundPlayerGroups && 
				doc.simulatorId && 
				Array.isArray(station.soundPlayerGroups) &&
				station.soundPlayerGroups.length > 0) {

				Flint.Log.verbose("Client changed, updating sound player " + doc._id + " with latest groups", "flint-audio-engine");
				
				Flint.collection('flintSoundPlayers').upsert({playerId: doc._id},{
					playerId: doc._id,
					simulatorId: doc.simulatorId,
					groupNames: station.soundPlayerGroups
				});
			} else {
				Flint.Log.verbose("Client changed, removing soundPlayer " + doc._id, "flint-audio-engine");
				Flint.collection('flintSoundPlayers').remove({playerId: doc._id});
			}
		}
	},
	removed: function(doc) {
		Flint.Log.verbose("Client dropped, removing soundPlayer " + doc._id, "flint-audio-engine");
		Flint.collection('flintSoundPlayers').remove({playerId: doc._id});
	}
});

// Watch for station soundPlayer changes
Flint.Log.verbose("Observing stations to keep soundPlayers consistent", "flint-audio-engine");
Flint.stations.find({}, {fields: {soundPlayerGroups: 1, _id: 1}}).observe({
	changed: function(station) {
		// Get clients used by this station
		// Array of _id strings ["id1", "id2", ...]
		var stationClients = _.pluck(
			Flint.collection('flintClients').find({stationId: station._id}, 
				{fields: {_id: 1}
			}).fetch(), "_id");

		// If this station has soundPlayerGroups
		if (station.soundPlayerGroups && 
			Array.isArray(station.soundPlayerGroups) && 
			station.soundPlayerGroups.length > 0) {
			Flint.Log.verbose("Station " + station._id + " changed, updating soundPlayers", "flint-audio-engine");
			// Setup the latest set of player groups
			Flint.collection('flintSoundPlayers').update({playerId: {$in: stationClients}},
				{$set: {groupNames: station.soundPlayerGroups}});
		} else { // Prune the player
			Flint.Log.verbose("Station " + station._id + " no longer playing, removing soundPlayers", "flint-audio-engine");
			Flint.collection('flintSoundPlayers').remove({playerId: {$in: stationClients}});
		}
	}
});

// Prune sound players that don't exist anymore from sounds
Flint.collection('flintSoundPlayers').find({}).observe({
	removed: function(doc) {
		Flint.collection('flintSounds').update({soundPlayers: {$in: [doc.playerId]}}, {$pull: {soundPlayers: doc.playerId}}, {multi: true});
	}
});

Meteor.publish("flint.audio-engine.selfPlayer", function() {
	// Based on the connection, send back this player
	return Flint.collection('flintSoundPlayers').find({playerId: this.connection.id});
});

Meteor.publish("flint.audio-engine.sounds", function() {
	return Flint.collection('flintSounds').find({soundPlayers: {$in: [this.connection.id]}});
});