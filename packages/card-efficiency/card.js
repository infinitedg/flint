Template.card_efficiency.dialControls = [
{
	'name' : 'Speed',
	'dialId' : 'speed'
},
{
	'name' : 'Deflector Power',
	'dialId' : 'deflector'
},
{
	'name' : 'Emitter Power',
	'dialId' : 'emitter'
},
{
	'name' : "Gravity Output",
	'dialId' : "gravity"
}
];

Template.card_efficiency.rendered = function(){
	Draggable.create($(".dial"), {
		type: "rotation",
		onDrag: function (t) {
           var value = Math.abs(this.rotation-240)/240; //Normalize the value to just 360
           Flint.system('Efficiency',t.target.id,value)
       },
       onDragEnd: function () {


       },
       bounds: {
       	minRotation: 240,
       	maxRotation: 480
       }
   });	
};

Template.card_efficiency.helpers({
	speed: function(){
		return Math.round(Flint.system('Efficiency','speed')*178) + (" Km/s");
	},
	distance: function(){
		return Flint.system('Efficiency','distance');
	},
	travelTime: function(){
		var distance = Flint.system('Efficiency','distance');
		var speed = Flint.system('Efficiency','speed');
		return Math.trunc((distance * speed * 178)/60);
	}
});