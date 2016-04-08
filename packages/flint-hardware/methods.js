var brigState = false;
var brigDmxChannel = 48;
Meteor.methods({
	'brigKey':function(code){
		var value = 0;
		if (tf){
			value = 255;
		}
		//if (code == "0008609312"){
			Flint.remote('light-server').call('setDmxChannel',brigDmxChannel,value);
			tf = !tf;
		//}
	} 
});
