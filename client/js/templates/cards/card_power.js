(function () {
// 	}
// 	
// 	var mouseDragging = false;
// 	var moveBar = function(e, context) {
// 		var parentOffset = $(context).parent().offset(); 
// 		var relX = e.pageX - parentOffset.left;
// 		var relY = e.pageY - parentOffset.top;
// 		
// 		var ratioW = relX / $(context).width();
// 		var rounded = Math.floor(Math.round(ratioW * 10)) * 10;
// 		$(context).find('.bar').css('width', rounded + '%');
// 		$(context).data('level', rounded);
// 		setProgressColor(context);
// 	}
// 	Template.card_power.events = {
// 		'mousedown .progress': function(e) {
// 			mouseDragging = true;
// 			moveBar(e, this);
// 			App.beep();
// 		},'mouseup .progress': function(e) {
// 			mouseDragging = false;
// 		}
// 	};
	Template.card_power.events = {
		'click div.progress': function(e, context) {
			App.beep();
			var relX = e.pageX - $(e.target).position().left;
			// var relY = e.pageY - $(e.target).position().top;
			var el = ($(e.target).hasClass('progress')) ? $(e.target) : $(e.target).parent('.progress');
			var ratioW = (relX / el.width());
			var newPower = Math.round(ratioW * this.maxPower);
			Systems.update({ _id: this._id }, { $set: {power: newPower}});
		}
	};

	Template.card_power.systems = function() {
		return Systems.find({});
	}
	
	Template.card_power.barPercent = function() {
		return (this.power / this.maxPower) * 100;
	}
	
	Template.card_power.barClass = function() {
		var level = (this.power / this.maxPower) * 100;
		if (level < 25) {
			return 'danger';
		} else if (level < 50) {
			return 'warning';
		} else if (level < 75) {
			return 'info';
		} else {
			return 'success';
		}
	}
}());