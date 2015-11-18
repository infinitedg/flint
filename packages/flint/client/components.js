Template.flint_components.helpers({
	components: function() {
		return Flint.components();
	}
});

var _componentDep = new Tracker.Dependency(),
_components = {};

Flint.addComponent = function(compName) {
	_components[compName] = 1;
	_componentDep.changed();
};

Flint.removeComponent = function(compName) {
	if (_components[compName]) {
		delete _components[compName];
	}
	_componentDep.changed();
};

Flint.components = function() {
	_componentDep.depend();
	// Use components property from current station (if available)
    // Combines (with de-duplication) from keys of manually-registered components
	return _.uniq(
        _.union(
            _.keys(_components),
            Flint.station('components') || [] // Default to empty array where appropriate
        )
    );
};
