var viewscreenInputs;

Template.card_viewscreen.created = function(){
    Meteor.subscribe('card.viewscreen.inputs',Flint.simulatorId());
};

Template.card_viewscreen.helpers({
    viewscreenInputs: function(){
        var viewscreen = localStorage.getItem('viewscreen') || Flint.simulatorId() + '-bridge';
        if (Template.instance().data.forceViewscreen) viewscreen = Template.instance().data.forceViewscreen;
        return Flint.collection('viewscreenInputs').find({viewscreenId:viewscreen},{sort:{weight:1}});
    },
    context:function(){
        var context = this.template.context;
        context._id = this._id;
        context.isDev = !!Template.instance().data.forceViewscreen;
        return context;
    },
    viewscreenStyle: function (e,t) {
        var priority = 0, secondary = 0;
        var viewscreen = localStorage.getItem('viewscreen') || Flint.simulatorId() + '-bridge';
        if (Template.instance().data.forceViewscreen) viewscreen = Template.instance().data.forceViewscreen;
        Flint.collection('viewscreenInputs').find({viewscreenId:viewscreen},{sort:{weight:1}}).forEach(function(e){
            if (e.priority){
                priority ++;
            } else {
                secondary ++;
            }
        });
        console.log('theme_viewscreen_' + priority + "p" + secondary + "s");
        return Template['theme_viewscreen_' + priority + "p" + secondary + "s"];
    },
    isDev:function(){
        if (Template.instance().data.forceViewscreen){
            return 'inline';
        }
        return 'none';
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
    autoplay: function(){
        if (this.autoplay === true){
            return 'autoplay';
        } else {
            return null;
        }
    },
    videoPaused:function(){
        if (this.paused){
            Template.instance().find('#' + this._id).pause();
            return 'play';
        } else {
            Template.instance().find('#' + this._id).play();
            return 'pause';
        }
    },
    isDev:function(){
        if (this.isDev){
            return 'block';
        }
        return 'none';
    }
});
