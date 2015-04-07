function highestMigrationIndex() {
	return _.reduce(Migrations._list, function(memo, migration) {
		if (migration.version > memo) {
			return migration.version;
		} else {
			return memo;
		}
	}, 0);
}

Flint.Migrations = {
	/**
	API Compliant with percolate:migrations with one important exception: the add function will automatically pick the next version in the system
	This makes it possible to have both ordered migrations, or to have migrations that don't mind order as much.
	@TODO Explore migrations in-depth and figure out a way to handle migrations that packages need, including respect for dependencies.
	*/
	add: function(data) {
		if (!data.version) {
			data.version = highestMigrationIndex() + 1;
		}
		Migrations.add(data);
	},
	migrateTo: function(target) {
		Migrations.migrateTo(target);
	}
};