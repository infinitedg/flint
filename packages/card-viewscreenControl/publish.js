Meteor.startup(function() {
    Meteor.publish('viewscreen.cameras', function(simulatorId) {
        return Flint.collection('viewscreenCameras').find({simId: simulatorId});
    });
});