Template.card_login.events = {
	'click .btn-login': function(e) {
		if ($('.btn-login').val() == 'Login' && $('input.loginname').val()) {
			$('.btn-login').val('Logout');
			$('.login').fadeIn(App.transitionSpeed);
			$('span.loginname').html($('input.loginname').val()).show();
			$('input.loginname').hide();
			Session.set('username', $('input.loginname').val());
		} else {
			$('.btn-login').val('Login');
			$('.login').fadeOut(App.transitionSpeed);
			$('input.loginname').show();
			$('span.loginname').hide();
			Session.set('username', undefined);
		}
		return false;
	}
}