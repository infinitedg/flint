Template.card_status.listStatus = function(){
	return Flint.card().status;
}
Template.card_status.statusCounter = function(){
	var collection = Flint.collection(this.collection);
	var doc = collection.findOne(this.document);
	if (this.type == "bar"){
		var min;
		var max;
		var returner = [];
		if (typeof this.min == "string"){
			min = doc[this.min];
		} else {
			min = this.min
		}
		if (typeof this.max == "string"){
			max = doc[this.max];
		} else {
			max = this.max
		}
		var value = Math.round((doc[this.key] - min) / (max - min)*10);
		for (i = 0; i < value; i++){
			if (i < 2){
				returner.push('red');
			} else if (i < 8){
				returner.push('blue');
			} else {
				returner.push('green');
			}
		}
	}
	return returner;
}

