Template.core_courseCalculation.currentCoordinates = function(axis) {
	return Flint.simulator('currentCoordinates')[axis];
};
Template.core_courseCalculation.calculatedCoordinates = function(axis){
	return Flint.simulator('desiredCoordinates')[axis];
};
Template.core_courseCalculation.desiredCourse = function(which){
	var course = Flint.simulator('desiredCourse');
	if (course.substr(-1,1) == '*'){return course.slice(0,-1);}
	else {return course;}
};
Template.core_courseCalculation.events = {
	'click .sendCourse': function(){
		if (Flint.simulator('desiredCourse').substr(-1,1) == '*'){
			var course = Flint.simulator('desiredCourse').slice(0,-1);
			Flint.simulator('desiredCourse', course);
		}
		var obj = {};
		obj.x = $('.calculatedX').val();
		obj.y = $('.calculatedY').val();
		obj.z = $('.calculatedZ').val();
		Flint.simulator('desiredCoordinates',obj);
		
	},
	'click .randomCourse': function(){
		$('.calculatedX').val(getRandomInt(1,99999)/100);
		$('.calculatedY').val(getRandomInt(1,99999)/100);
		$('.calculatedZ').val(getRandomInt(1,99999)/100);
	},
	'click .unknownCourse': function(){
		$('.calculatedX').val('No');
		$('.calculatedY').val('Course');
		$('.calculatedZ').val('Available');
	}
};
getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};