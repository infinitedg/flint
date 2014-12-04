var randomLoopX;
var randomLoopY;
var randomLoopZ;
var TimeoutX;
var TimeoutY;
var TimeoutZ;
var starsLoop;
var xStars = 0, yStars = 0, xPos = 0, yPos = 0, xBracket = 0, yBracket = 0, xCrosshairs = 0, yCrosshairs = 0;
getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
startScan = function(){
	randomLoopX = setInterval(function() {
		$(".calculatedX").text(getRandomInt(1,99999)/100);
	}, 40);
	randomLoopY = setInterval(function() {
		$(".calculatedY").text(getRandomInt(1,99999)/100);
	}, 40);
	randomLoopZ = setInterval(function() {
		$(".calculatedZ").text(getRandomInt(1,99999)/100);
	}, 40);
	starsLoop = animLoop(function( deltaT ) {
		if (Flint.system('Course Calculation','desiredCourse').substr(-1,1) != '*'){return false;}
		var stars = $('.stars img');
		var starbox = $('.starsBox');
		var starHeight = stars.height();
		var starWidth = stars.width();
		var boxHeight = starbox.height();
		var boxWidth = starbox.width();
		if (xPos == xStars){xStars = Math.round(Math.random() * (starWidth) - boxWidth) ;}
		if (yPos == yStars){yStars = Math.round(Math.random() * (starHeight)  - boxHeight);}

		if (xPos < xStars){xPos += 0.5;}
		else {xPos -= 0.5;}
		if (yPos < yStars){yPos += 0.5;}
		else {yPos -= 0.5;}

		stars.css('left',("-" + xPos + "px"));
		stars.css('top',("-" + yPos + "px"));

		var crosshairs = $('.brackets');
		if (xCrosshairs == xBracket){xBracket = Math.round(Math.random() * (boxWidth - 16));}
		if (yCrosshairs == yBracket){yBracket = Math.round(Math.random() * (boxHeight - 16));}
		if (xCrosshairs < xBracket){xCrosshairs += 0.5;}
		else {xCrosshairs -= 0.5;}
		if (yCrosshairs < yBracket){yCrosshairs += 0.5;}
		else {yCrosshairs -= 0.5;}

		crosshairs.css('left',xCrosshairs);
		crosshairs.css('top',yCrosshairs);
		$('.linex').css('top',yCrosshairs + 7);
		$('.liney').css('left',xCrosshairs + 7);	
	});
};
stopScan = function(values,immediate){
	starsLoop = '';
	clearInterval(randomLoopX);
	clearInterval(randomLoopY);
	clearInterval(randomLoopZ);
	if (immediate === undefined){
		if (values !== undefined) {$(".calculatedX").text(values.x);}
		else {$(".calculatedX").text('');}
			$(".calculatedX").addClass("hilited"); 
		TimeoutY = setTimeout(function() {
			if (values !== undefined) {$(".calculatedY").text(values.y);}
			else {$(".calculatedY").text('');}
			$(".calculatedX").removeClass("hilited");   
			$(".calculatedY").addClass("hilited");   
		},250);
		TimeoutZ = setTimeout(function() {
			if (values !== undefined) {$(".calculatedZ").text(values.z);}
			else {$(".calculatedZ").text('');}
				$(".calculatedY").removeClass("hilited");   
			$(".calculatedZ").addClass("hilited"); 
		},500);
		TimeoutEnd = setTimeout(function() {
			$(".calculatedZ").removeClass("hilited");  
		},750);
	} else {
		
		if (values !== undefined) {$(".calculatedX").text(values.x);}
		if (values !== undefined) {$(".calculatedY").text(values.y);}
		if (values !== undefined) {$(".calculatedZ").text(values.z);}

	}
};
selectField = function(whichField) {
	if (whichField == "next") {
		if (Session.get('selectedCourseField') == 'X') {whichField = 'Y';}
		if (Session.get('selectedCourseField') == 'Y') {whichField = 'Z';}
        if (Session.get('selectedCourseField') == 'Z') {submitCoordinates();}//Template.card_targeting.lockTarget();}
        if (Session.get('selectedCourseField') === undefined)  {whichField = undefined;}
    }
    $(".currentX").removeClass("selected");
    $(".currentY").removeClass("selected");
    $(".currentZ").removeClass("selected");
    $(".current" + whichField).addClass("selected"); 
    $(".current" + whichField).text(""); 
    Session.set('selectedCourseField',whichField);
};
submitCoordinates = function(){
	var obj = {
		'x': $(".currentX").text(),
		'y': $(".currentY").text(),
		'z': $(".currentZ").text()
	};
	Flint.system('Course Calculation','currentCoordinates',obj);
	$(".currentX").addClass("hilited"); 
	TimeoutY = setTimeout(function() {
		if (obj.x != Flint.system('Course Calculation','desiredCoordinates').x){$(".currentX").addClass("invalid");}
		else {$(".currentX").removeClass("invalid");}
		$(".currentX").removeClass("hilited");   
		$(".currentY").addClass("hilited");   
	},250);
	TimeoutZ = setTimeout(function() {
		if (obj.y != Flint.system('Course Calculation','desiredCoordinates').y){$(".currentY").addClass("invalid");}
		else {$(".currentY").removeClass("invalid");}
		$(".currentY").removeClass("hilited");   
		$(".currentZ").addClass("hilited"); 
	},500);
	TimeoutEnd = setTimeout(function() {
		if (obj.z != Flint.system('Course Calculation','desiredCoordinates').z){$(".currentZ").addClass("invalid");}
		else {$(".currentZ").removeClass("invalid");}
		$(".currentZ").removeClass("hilited");  
	},750);
	selectField('');
};

Template.card_courseCalculation.helpers({
	buttonHidden: function(which){
		var course = Flint.system('Course Calculation','desiredCourse');
		if (which == "calculate"){
			if (course.substr(-1,1) == '*'){return 'hidden';} //Asterisk means calculating
			else {return null;}
		}
		if (which == "cancel"){
			if (course.substr(-1,1) == '*'){return null;} //Asterisk means calculating
			else {return 'hidden';}
		}
	},
	starsImage: function(){
		return Flint.a('/Stars');
	},
	desiredCourse: function(){
		var course = Flint.system('Course Calculation','desiredCourse');
		if (course.substr(-1,1) == '*'){return course.slice(0,-1);}
		else {return course;}
	},
	desiredCoordinates: function(axis){
		return Flint.system('Course Calculation','desiredCoordinates')[axis];
	},
	currentCoordinates: function(axis){
		return Flint.system('Course Calculation','currentCoordinates')[axis];
	}
});

Template.card_courseCalculation.events({
	'keydown window': function(e,context){
		console.log(e);
	},
	'click .calculateCourse': function(e,context){
		if ($('.courseInput').val() !== ''){
			Flint.beep();
			$(".currentX").removeClass("invalid");
			$(".currentY").removeClass("invalid");
			$(".currentZ").removeClass("invalid");
			Flint.system('Course Calculation','desiredCourse', $('.courseInput').val() + "*");
		}
	},
	'click .cancelCalculation': function(e,context){
		Flint.beep();
		var course = Flint.system('Course Calculation','desiredCourse').slice(0,-1);
		Flint.system('Course Calculation','desiredCourse', course);
	},
	"click .keypad": function(e, context) {
		var a;
		Flint.beep();
		if (!Session.get('selectedCourseField')) {
			selectField("X");   
		}
		a = e.target.textContent;
		$('.selected').text($('.selected').text() + a);
		e.preventDefault();
	},
	"click .btn.enter": function(e, context) {
		Flint.beep();
		selectField('next');

	},
	"click .clearButton": function(e, context) {
		Flint.beep();
		if ($('.selected').text() !== '') {
			$('.selected').text('');
		} else if ($('.selected').text() === '') {
			$(".currentX").text("");
			$(".currentY").text("");
			$(".currentZ").text("");
			$(".currentX").removeClass("invalid");
			$(".currentY").removeClass("invalid");
			$(".currentZ").removeClass("invalid");
			selectField('');
		}
	},

	/*These next three make it so you can click on the field you want to type in.*/
	"click .currentX": function(e, context) {
		Flint.beep();
		selectField('X');
	},
	"click .currentY": function(e, context) {
		Flint.beep();
		selectField('Y');
	},
	"click .currentZ": function(e, context) {
		Flint.beep();
		selectField('Z');
	}
});


Template.card_courseCalculation.rendered = function(){
	Session.set('selectedCourseField',undefined);
	var system = "Course Calculation"
	this.conditionObserver = Flint.collection('systems').find({
        'simulatorId': Flint.simulatorId(),
        'name': system
    }).observeChanges({
		changed: function(id, fields) {
			if (fields.desiredCourse) {
				if (fields.desiredCourse.substr(-1,1) == '*'){startScan();}
				else {
					stopScan();}
				}
				if (fields.desiredCoordinates) {
					var obj = {
						'x':(fields.desiredCoordinates.x),
						'y':(fields.desiredCoordinates.y),
						'z':(fields.desiredCoordinates.z)
					};
					stopScan(obj);
				//$(".calculatedX").text(fields.desiredCoordinates.x);
				//$(".calculatedY").text(fields.desiredCoordinates.y);
				//$(".calculatedZ").text(fields.desiredCoordinates.z);
			}
		}
	});
	if (Flint.system('Course Calculation','desiredCourse').substr(-1,1) == '*'){
		startScan();
	}
	var a;
	$(window).on('keydown', function(e){
		a = (e.which);
		/*Number Row keys*/
		if (a > 47 && a < 58) {
			newA=a-48;
			if (!Session.get('selectedCourseField')) {selectField("X");}
			$('.selected').text($('.selected').text() + newA);
		}
		/*Number Pad keys*/
		else if (a > 95 && a < 106) {
			newA=a-96;
			if (!Session.get('selectedCourseField')) {selectField("X");}
			$('.selected').text($('.selected').text() + newA);
		}
		/*Period and Decimal keys*/
		else if (a == 110 || a == 190) {
			newA='.';
			if (!Session.get('selectedCourseField')) {selectField("X");}
			$('.selected').text($('.selected').text() + newA);
		}
		/*Return & Enter Keys*/
		else if (a == 13) {selectField('next');}
		/*Delete & Backspace & clear*/
		else if (a == 8 || a == 46 || a == 12){
			if ($('.selected').text() !== '') {$('.selected').text('');}
			else if ($('.selected').text() === '') {
				$(".currentX").text("");
				$(".currentY").text("");
				$(".currentZ").text("");
				$(".currentX").removeClass("invalid");
				$(".currentY").removeClass("invalid");
				$(".currentZ").removeClass("invalid");
				selectField('');
			}

		}

		return;
	});
};

function animLoop( render, element ) {
	var running, lastFrame = new Date();
	function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
        	requestAnimationFrame( loop, element );
        	running = render( now - lastFrame );
        	lastFrame = now;
        }
    }
    loop( lastFrame );
}

