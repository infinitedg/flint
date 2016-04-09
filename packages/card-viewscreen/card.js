var viewscreenInputs;

Template.card_viewscreen.created = function(){
    this.subscription = Tracker.autorun(function () {
        Meteor.subscribe('card.viewscreen.inputs', Flint.simulatorId());
    });
    viewscreenInputs = Flint.collection('viewscreenInputs').find({},{sort:{weight:1}});
};

Template.card_viewscreen.helpers({
    viewscreenInputs: function(){
        return Flint.collection('viewscreenInputs').find({},{sort:{weight:1}});
    },
    context:function(){
        var context = this.template.context;
        context._id = this._id;
        return context;
    },
    viewscreenStyle: function (e,t) {
        var priority = 0, secondary = 0;
        viewscreenInputs.forEach(function(e){
            if (e.priority){
                priority ++;
            } else {
                secondary ++;
            }
        });
        console.log('theme_viewscreen_' + priority + "p" + secondary + "s");
        return Template['theme_viewscreen_' + priority + "p" + secondary + "s"];
    }

});

Template.viewscreen_video.helpers({
    tacticalVideo: function () {
        return Flint.a(this.video);
    },
    videoLooping: function(){
        if (this.looping === true){
            return 'loop';
        } else {
            return null;
        }
    },
    videoPaused:function(){
        if (this.paused){
            Template.instance().find('#' + this._id).pause();
        } else {
            Template.instance().find('#' + this._id).play();
        }
    }
});