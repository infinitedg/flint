Template.card_transporters.transporterTarget = function(){
	return Flint.system('Transporters','targets');
};
Template.card_transporters.targetStyle = function(){
	return 'top: ' + this.top + "%; left: " + this.left + "%;";
};
Template.card_transporters.possible = function(){
	if (Flint.system('Transporters','locked') != 'false'){
		return '';
	} else {
		return 'hidden';
	};
};
Template.card_transporters.rendered = function(){
	Draggable.create($(".crossHairs"), {
		type: "x,y",
		edgeResistance: 0.95,
		bounds: $(".targetBox")[0],
		onDrag: function () {
			var that = $(".crossHairs")[0];
			var hit = 'false';
			$('.transTarget').each(function(e){
				if (Draggable.hitTest(that,this,"90%")){
					hit = this.id;
				}
			})
			Flint.system('Transporters','locked',hit);
		},
		onDragEnd: function () {

		}
	});
};
Template.card_transporters.scanBtnLabel = function(){
	if (Flint.system('Transporters','state') == 'idle'){
		return "Scan for Transporter Target";
	}
	if (Flint.system('Transporters','state') == 'scanning'){
		return "Cancel Transporter Scan";
	}
	if (Flint.system('Transporters','state') == 'targets'){
		return 'Cancel Transport';
	}
};
Template.card_transporters.fieldsDisabled = function(){
	if (Flint.system('Transporters','state') == 'idle'){
		return '';
	} else {
		return 'disabled';
	}
}
Template.card_transporters.isScanning = function(){
	if (Flint.system('Transporters','state') == 'scanning'){
		return 'scan';
	} else {
		return false;
	}
}
Template.card_transporters.powerUpStyle = function(){
	return "height: " + Flint.system('Transporters','powerUp') + "%;";
}
Template.card_transporters.events = {
	'mousemove .powerUp' : function(e,t){
		var cover = t.find('.powerUpCover')
		if (Flint.system('Transporters','locked') != 'false' && (cover.clientHeight - e.offsetY) < 10){
			Flint.system('Transporters','powerUp', ((e.offsetY / e.currentTarget.clientHeight * 100)));
		}
	},
	'click .transScan' : function(e,t){
		Flint.beep();
		if (Flint.system('Transporters','state') == 'idle'){
			Flint.system('Transporters','target',t.find('#transDesiredTarget').value);
			Flint.system('Transporters','destination',t.find('#transDesiredDestination').value)
			Flint.system('Transporters','state','scanning');
		}else if (Flint.system('Transporters','state') == "scanning"){
			Flint.system('Transporters','target','');
			Flint.system('Transporters','destination','')
			Flint.system('Transporters','state','idle');
		} else if (Flint.system('Transporters','state') == "targets"){
			Flint.system('Transporters','target','');
			Flint.system('Transporters','destination','')
			Flint.system('Transporters','state','idle');
			Flint.system('Transporters','targets',[]);
		}
	}
}