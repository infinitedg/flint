var currentUser, currentUserDep = new Deps.Dependency;

Flint.user = function() {
  currentUserDep.depend();
  return currentUser;
}

Flint.login = function(name) {
  currentUserDep.changed();
  currentUser = {name: name};
}

Flint.logout = function() {
  currentUserDep.changed();
  currentUser = undefined;
}