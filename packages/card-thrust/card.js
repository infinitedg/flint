Template.card_thrust.rendered = function () {
    var system = "Engines";
    this.conditionObserver = Flint.collection('systems').find({
        'simulatorId': Flint.simulatorId(),
        'name': system
    }).observeChanges({
        added: function (id, fields) {
            if (typeof fields.thrust != undefined) {
                $('#thrust').slider();
                $('#thrust').slider('setValue', Math.abs(parseInt(fields.thrust,10)-9)-6);
            }
        },
        changed: function(id, fields) {
            if (typeof fields.thrust != undefined) {
            //    $('#thrust').slider('setValue', Math.abs(parseInt(fields.thrust,10)-9)-6);
            }
        }
    });
}
Template.card_thrust.events = {
    'slide #thrust': function (e) {
        Flint.system('Engines', 'thrust', Math.abs(e.target.value-9)-6);
    }
};
Template.card_thrust.speedNums = [6,5,4,3,2,1,0,-1,-2,-3];
Template.card_thrust.velocity = function(){
    return Flint.system('Engines','velocity');
}
Template.card_thrust.heat = function(){
    return Flint.system('Engines','heat') + 293.2;
}
Template.card_thrust.efficiency = function(){
    return Flint.system('Engines','efficiency');
}
Template.card_thrust.velocityArrow = function(type){
    var min = 0;
    var max = 50000;
    var val = Flint.system('Engines', 'velocity');
    var value = ((val - min) / (max - min)*54) - 27;
    return "-webkit-transform: rotate(" + value + "deg);";
}
Template.card_thrust.heatArrow = function(type){
    var min = 0;
    var max = 100;
    var val = Flint.system('Engines', 'heat');
    var value = ((val - min) / (max - min)*54) - 27;
    return "-webkit-transform: rotate(" + value + "deg);";
}
Template.card_thrust.efficiencyArrow = function(type){
    var min = 0;
    var max = 300;
    var val = Flint.system('Engines', 'efficiency');
    var value = ((val - min) / (max - min)*54) - 27;
    return "-webkit-transform: rotate(" + value + "deg);";
}