var brigState = false;
var brigDmxChannel = 46;
Meteor.methods({
	'brigKey':function(code){
		var value = 0;
		if (tf){
			value = 255;
		}
		console.log('brig:',value);
		//if (code == "0008609312"){
			var obj = {};
			obj[brigDmxChannel - 1] = value;
			Flint.remote('light-server').call('sendDmxCommand',obj);
			Meteor.call('runMacroHIDKey','76',{ meta: false,alt: false,shift: false,control: false,caps: false },'voyager')
			tf = !tf;
		//}
	} 
});
