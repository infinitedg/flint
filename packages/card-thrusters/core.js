/**
@module Templates
@submodule Core
*/
 
/**
Thruster card. Directional and Rotational thrusters.
@class core_thrusters
*/

Template.core_thrusters.created = function() {
  this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
    changed: function(id, fields) {
      if (fields.thrusterDirection) {
          if (fields.thrusterDirection !== 'none') {
            $('#' + fields.thrusterDirection).addClass('highlight');
          
          }
          else {
            $(".thruster-icon").each(function() {
              $(this).removeClass("highlight");
            });
          }
      }
      
      if (fields.thrusterRotationYaw) {
        $(".yaw-value").text(fields.thrusterRotationYaw);
      }
      if (fields.thrusterRotationPitch) {
        $(".pitch-value").text(fields.thrusterRotationPitch);
      }
      if (fields.thrusterRotationRoll) {
        $(".roll-value").text(fields.thrusterRotationRoll);
      }
    }
  })
};

Template.core_thrusters.destroyed = function() {
  this.conditionObserver.stop();
};