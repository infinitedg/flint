Template.flint_components.helpers({
	components: function() {
		return Flint.components();
	}
});

var _componentDep = new Deps.Dependency,
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
	return _.keys(_components);
};