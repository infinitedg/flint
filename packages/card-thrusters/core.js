/**
@module Templates
@submodule Core
*/

/**
Thruster card. Directional and Rotational thrusters.
@class core_thrusters
*/
Template.core_thrusters.helpers({
    rotationValue: function (which) {
        return Flint.system('Thrusters','current')[which];
    },
    directionHilight: function(which){
        if (which === Flint.system('Thrusters','direction')){
            return 'highlight'};
        }
    });

/*Template.core_thrusters.created = function () {
    this.conditionObserver = Flint.collection('systems').find(Flint.simulatorId()).observeChanges({
        changed: function (id, fields) {
            if (fields.thrusterDirection) {
                if (fields.thrusterDirection !== 'none') {
                    $('#' + fields.thrusterDirection).addClass('highlight');
                } else {
                    $(".thruster-icon").each(function () {
                        $(this).removeClass("highlight");
                    });
                }
            }
        }
    });
};

Template.core_thrusters.destroyed = function () {
    this.conditionObserver.stop();
};
*/
Template.core_thrusters.events = {
    'click .manual-thrusters': function (e) {
        var obj = {
            'yaw': Math.round(Math.random() * 359),
            'pitch': Math.round(Math.random() * 359),
            'roll': Math.round(Math.random() * 359)
        };
        Flint.system('Thrusters','required', obj);
        Flint.system('Thrusters','manualThruster', String(e.target.checked));
    }
};