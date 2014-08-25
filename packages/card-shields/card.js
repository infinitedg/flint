Template.card_shields.events = {

};
Template.card_shields.topView = function(){
	return Flint.a('/Ship Views/Top');
};
Template.card_shields.shieldStyle = function(){
	return "-webkit-filter: drop-shadow(0px 0px 15px " + Flint.system('shields','color') + ");";
};
Template.card_shields.shieldState = function(){
	if (Flint.system('shields','state') == "raised"){
		return "Lower Shields";
	} else {
		return "Raise Shields";
	}
};
Template.card_shields.shieldLevel = function(){
	return Flint.system('shields','strength') + "%";
};
Template.card_shields.shieldStrengthStyle = function(){
	return "width: " + Flint.system('shields','strength') + "%;";
}
Template.card_shields.rendered = function(){
	var shieldObserver = Flint.collection('systems').find({'name':'Shields'}).observeChanges({
		changed: function(fields,id){
			if (fields.state){
				if (fields.state == "raised"){
					//Flint.tween('systems', id, 5, {})
				}
			}
			if (fields.strength){

			}
		}
	})
}