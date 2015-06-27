//client only code
Template.card_reactor.helpers({
  output:function(){
    return Flint.system('Reactor','output');
  },
  batteries:function(){
    return Math.round(Flint.system('Reactor','output') * Flint.system('Reactor','batteryFactor'));
  },
  leftWing:function(){
    var powerUsed = Flint.system('Reactor','output') - Flint.system('Reactor','output') * Flint.system('Reactor','batteryFactor');
    return Math.round(powerUsed * (1 - Flint.system('Reactor','wingFactor')) * 0.5);
  },
  rightWing:function(){
    var powerUsed = Flint.system('Reactor','output') - Flint.system('Reactor','output') * Flint.system('Reactor','batteryFactor');
   return Math.round(powerUsed * (1 + Flint.system('Reactor','wingFactor')) * 0.5);

 },
 powerUsed:function(){
   return Math.round(Flint.system('Reactor','output') - (Flint.system('Reactor','output') * Flint.system('Reactor','batteryFactor'))); 
 },
 batteryLevel:function(){
 }
})
Template.card_reactor.rendered = function(){

  Draggable.create(".batteries .dragger", {
    type:"rotation",
    bounds:{minRotation:0, maxRotation:90},
    onDrag: function(e){
     Flint.system('Reactor','batteryFactor',this.rotation/90);
   }
 });
  Draggable.create(".wings .dragger", {
    type:"rotation",
    bounds:{minRotation:-90, maxRotation:90},
    onDrag: function(e){
     Flint.system('Reactor','wingFactor',this.rotation/90);
   }
 });

}