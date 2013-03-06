(function (){
	Session.setDefault('loggedIn', false);
	
	Template.card_login.events = {
		'click .btn-login': function(e) {
			App.beep();
			Session.set('loggedIn', true);
			Session.set('currentUser', $('.loginname').val());
			return false;
		},
		'click .btn-logout': function(e) {
			App.beep();
			Session.set('loggedIn', false);
			Session.set('currentUser', undefined);
			return false;
		},
		'keypress input.loginname': function(e) {
			if (e.which === 13) {
				Template.card_login.events['click .btn-login'](null);
				e.preventDefault();
				return false;
			}
			return true;
		}
	};
	
	Template.card_login.loggedIn = function() {
		return (Session.get('loggedIn') === true);
	};
	
	Template.card_login.userName = function() {
		return Session.get('currentUser');
	};
}());