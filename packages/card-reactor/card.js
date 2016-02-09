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
  dynamoStyle:function(){
    return 'transform: rotate(' + Session.get('reactorDynamo_rotation') + 'deg);';
  },
  batteryLevel:function(){
  }
});
Template.card_reactor.rendered = function(){
  Session.set('reactorDynamo_rotation',0);
  Draggable.create(".dynamo .dragger", {
    type:"rotation",
    bounds:{minRotation:-90, maxRotation:90},
    onDrag: function(){
     Flint.system('Reactor','dynamoFactor',(this.rotation + 90) / 180);
   }
 });
  function render(){
    Session.set('reactorDynamo_rotation', (Session.get('reactorDynamo_rotation') + Math.pow(Flint.system('Reactor','dynamoFactor') * 10,2)) % 360);
  }
  function animloop(){
    requestAnimationFrame(animloop);
    render();
  }
  requestAnimationFrame(animloop);
};

