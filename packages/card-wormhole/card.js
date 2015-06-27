Template.card_wormhole.rendered = function () {
    var system = "Wormhole";
    this.conditionObserver = Flint.collection('systems').find({
        'simulatorId': Flint.simulatorId(),
        'name': system
    }).observeChanges({
        added: function (id, fields) {
            if (typeof fields.throttle !== undefined) {
                $('#throttle').slider();
                $('#throttle').slider('setValue', Math.abs(parseInt(fields.throttle,10)-9)-6);
            }
        },
        changed: function(id, fields) {
            if (typeof fields.throttle !== undefined) {
                $('#throttle').slider('setValue', Math.abs(parseInt(fields.throttle,10)-9)-6);
            }
        }
    });
};

Template.card_wormhole.events = {
    'slide #throttle': function (e) {
        Flint.system('Engines', 'throttle', Math.abs(e.target.value-9)-6);
    }
};
