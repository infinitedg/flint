Template.theme_vanguard_frame.alertName = function(){
	var alertNum = Flint.simulator('alertCondition');
	if (alertNum == 5 || alertNum == 4){
		return 'attention';
	} else 
	if (alertNum == 3){
		return 'caution';
	} else
	if (alertNum == 2){
		return 'warning';
	} else
	if (alertNum == 1){
		return 'danger';
	} else
	if (alertNum == 'c' || alertNum == 'cloak' || alertNum == 'p'){
		return 'cloak';
	} else {
		return 'default';
	}
};
Template.theme_vanguard_frame.alertColorDesat = function(){
	var alertNum = Flint.simulator('alertCondition');
	if (alertNum == 5 || alertNum == 4){
		return '#4D6580';
	} else 
	if (alertNum == 3){
		return '#80804D';
	} else
	if (alertNum == 2){
		return '#80664D';
	} else
	if (alertNum == 1){
		return '#661414';
	} else
	if (alertNum == 'c' || alertNum == 'cloak' || alertNum == 'p'){
		return '#6F4D80';
	} else {
		return '#808080';
	}
};
Template.theme_vanguard_frame.alertColora = function(level){
	var alertNum = Flint.simulator('alertCondition');

	var colorval;
	if (alertNum == 5 || alertNum == 4){
		colorval = '48,88,138';
	} else 
	if (alertNum == 3){
		colorval = '138,127,48';
	} else
	if (alertNum == 2){
		colorval = '138,100,48';
	} else
	if (alertNum == 1){
		colorval = '138,48,48';
	} else
	if (alertNum == 'c' || alertNum == 'cloak' || alertNum == 'p'){
		colorval = '100,48,138';
	} else {
		colorval = '138,138,138';
	}
	return 'rgba(' + colorval + ',' + level + ')';
};

Template.theme_vanguardTextInputs.alertColora = function(level){
	var alertNum = Flint.simulator('alertCondition');

	var colorval;
	if (alertNum == 5 || alertNum == 4){
		colorval = '48,88,138';
	} else 
	if (alertNum == 3){
		colorval = '138,127,48';
	} else
	if (alertNum == 2){
		colorval = '138,100,48';
	} else
	if (alertNum == 1){
		colorval = '100,48,138';
	} else
	if (alertNum == 'c' || alertNum == 'cloak' || alertNum == 'p'){
		colorval = '100,48,138';
	} else {
		colorval = '138,138,138';
	}
	return 'rgba(' + colorval + ',' + level + ')';
};

Template.theme_styledRadioCheck.alertColora = function(level){
	var alertNum = Flint.simulator('alertCondition');

	var colorval;
	if (alertNum == 5 || alertNum == 4){
		colorval = '48,88,138';
	} else 
	if (alertNum == 3){
		colorval = '138,127,48';
	} else
	if (alertNum == 2){
		colorval = '138,100,48';
	} else
	if (alertNum == 1){
		colorval = '100,48,138';
	} else
	if (alertNum == 'c' || alertNum == 'cloak' || alertNum == 'p'){
		colorval = '100,48,138';
	} else {
		colorval = '138,138,138';
	}
	return 'rgba(' + colorval + ',' + level + ')';
};