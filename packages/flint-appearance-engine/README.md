== Flint Appearance Engine ==

The appearance engine is basically a hierarchical key-value store: key-value in the sense that it deals with discrete values stored against keys, and hierarchical in teh sense that layers of keys are flattened to determine the true value output by a get request:


Simulator
	-> Station
		-> Card
			-> Client

A given key may be set with a value at any layer in the above hierarchy and, when requested, is returned from the lowest level available. If the value "foo" is set to "123" on a station, and "abc" on the client, then whenever requested, the value "abc" will be returned (unless a value is explicitly requested from a given level).

== Setters ==
Flint.appearance.set('keyName', 'value'[, 'level']);

Level defaults to the lowest level in the hierarchy available, if not set (if nothing is set, it is set on the Simulator object). Level is one of 'Simulator','Station','Card', or 'Client' (Case insensitive)

== Getters ==
Flint.appearance.get('keyname'[, 'level'])

Reactively returns the current value from the lowest available level.