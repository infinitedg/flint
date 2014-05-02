FlintActors = {},
DramaInstanceID = new Meteor.Collection.ObjectID()._str,
DefaultPeriod = 1000;

var Actor = function(opts) {
	// Check input, handle errors
	if (typeof opts._id !== "string") {
		Flint.Log.error('Invalid actor ID - must be string');
		return;
	}
	if (typeof opts.action !== "function") {
		Flint.Log.error('Invalid actor action - must be function');
		return;
	}
	if (typeof opts.period !== "function" && typeof opts.period !== "number") {
		Flint.Log.error('Invalid actor period - must be function or integer');
		return;
	}
	if (typeof opts.onStart !== "function" && opts.onStart !== undefined) {
		Flint.Log.error('Invalid actor onStart - must be function or undefined');
		return;
	}
	if (typeof opts.onStop !== "function" && opts.onStop !== undefined) {
		Flint.Log.error('Invalid actor onStop - must be function or undefined');
		return;
	}
	if (typeof opts.onKill !== "function" && opts.onKill !== undefined) {
		Flint.Log.error('Invalid actor onKill - must be function or undefined');
		return;
	}
	if (typeof opts.onError !== "function" && opts.onError !== undefined) {
		Flint.Log.error('Invalid actor onError - must be function or undefined');
		return;
	}

	// Register the actor with this instance
	FlintActors[opts._id] = this;

	this._id = opts._id;
	this.action = opts.action;
	this.period = opts.period;
	this.onStart = opts.onStart;
	this.onStop = opts.onStop;
	this.onKill = opts.onKill;
	this.onError = opts.onError;

	var getPeriod = function(p) {
		if (typeof p === 'number') {
			return p;
		} else if (typeof p === 'function') {
			return p();
		}
		return DefaultPeriod;
	};

	this._pulse = function() {
		var a = Flint.collection('FlintActors').findOne(this._id);
		if (a && a.claimedBy === DramaInstanceID && a.running) {
			Flint.collection('FlintActors').update(this._id, {$set: {counter: 0}});
			try {
				this.action();	
			} catch (exc) {
				if (typeof this.onError == 'function') {
					this.onError(exc);
				}
			}
		}

		this._timeoutID = Meteor.setTimeout(function() {if (FlintActors[a._id]) {FlintActors[a._id]._pulse(); }}, getPeriod(FlintActors[a._id].period)); // Always run an actor
	}
};

Actor.prototype.start = function() {
	if (!this._timeoutID) {
		this._timeoutID = 'ready'; // Placeholder used to prevent multiple pulses
		var a = Flint.collection('FlintActors').findOne(this._id);
		if (a.claimedBy === DramaInstanceID || !a.claimedBy) {
			if (typeof this.onStart === "function") {
				this.onStart();
			}
			Flint.collection('FlintActors').update(this._id,{$set: {counter: 0, claimedBy: DramaInstanceID }});
		}
		Flint.collection('FlintActors').update(this._id,{$set: {running: true}});
		this._pulse();
	}
};

Actor.prototype.stop = function() {
	if (this._timeoutID) {
		var a = Flint.collection('FlintActors').findOne(this._id);
		if (a.claimedBy === DramaInstanceID || !a.claimedBy) {
			if (typeof this.onStop === "function") {
				this.onStop();
			}
		}
		Flint.collection('FlintActors').update(this._id,{$set: {running: false}});

		Meteor.clearTimeout(this._timeoutID);
		this._timeoutID = undefined;
	}
};

Actor.prototype.kill = function() {
	this.stop();
	if (typeof this.onKill === "function") {
		this.onKill();
	}
	if (this._timeoutID) {
		Meteor.clearTimeout(this._timeoutID);
	}
	delete FlintActors[this._id];
	if (Flint.collection('FlintActors').findOne(this._id)) {
		Flint.collection('FlintActors').remove(this._id);
	}
};

_.extend(Flint, {
	actor: function(opts) {
		// Create actor, move on if we are successful
		if (a = new Actor(opts)) {
			var coll = Flint.collection('FlintActors');
			var d = coll.findOne(a._id);
			if (!d) { // Insert the actor into our collection if we haven't seen it before
				coll.insert({_id: a._id, counter: 0, claimedBy: DramaInstanceID, running: true});
			}
		}
		
		return a;
	}
});

ActorObserver = Flint.collection('FlintActors').find().observeChanges({
	added: function(id, fields) {
		if (FlintActors[id] === undefined) {
			Flint.Log.warn("Pruning actor " + id + " from database - not a registered actor!");
			Flint.collection('FlintActors').remove(id);
		} else {
			if (fields.running) {
				FlintActors[id].start();
			}
		}
	}, changed: function(id, fields) {
		if (FlintActors[id]) {
			if (fields.claimedBy == DramaInstanceID) {
				Flint.Log.info("Instance " + DramaInstanceID + " taking control of actor " + id);
				fields.running = Flint.collection('FlintActors').findOne(id).running;
			}
			if (fields.running == true) {
				FlintActors[id].start();
			} else if (fields.running == false) {
				FlintActors[id].stop();
			}
		}
	}, removed: function(id) {
		if (FlintActors[id]) {
			FlintActors[id].kill();
		}
	}
});