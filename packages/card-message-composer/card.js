//The LRMessages key in the database is an array with the following keys:
//key: ID - a unique identifyer for each message, probably the milliseconds.
//Sender - the station which initiated the message, IE 1st officer, Ambassador, Quartermaster, Communications, etc.
//To - the 'To' field
//Body - the 'Body' field
//Endcoded - if this key is set, the message appears as binary and cannot be edited
//Status - if the message has been sent and is visible to the Flight Director, or if it has been queued.  
Template.card_messageComposer.events = {
    'click .encodeBtn' : function(e, context) {
            str = context.find('.body-text').value;
            var i = str.length;
            var j = 0;
           
                encoder = Meteor.setInterval(function() {
                    if (str[j] != ' ') {
                        bin = Math.floor(Math.random() * 2);
                        str = setCharAt(str,j,bin);
                        context.find('.body-text').value = (str);
                    }
                    j++;
                    if (j > i) {Meteor.clearInterval(encoder);}
                },10);
            $(context.find('.body-text')).attr('disabled', 'disabled');
            Flint.collection('lrmessages').update(Session.get('currentLRMessage'),{$set: {encoded: true}});
 
    },
    
    'click .saveBtn' : function(e,context) {
        Template.card_messageComposer.saveMessage(context);
        },
    
    
    'click .textbox p' : function(e, t) {
        Template.card_messageComposer.saveMessage(t);
        $(t.findAll('.message-list .textbox p')).removeClass('lineSelected');
        t.find('.to-input').value = this.to;
        if (this.body != 'undefined'){
        t.find('.body-text').value = this.body;}
        $(e.target).addClass('lineSelected');
        $(t.find('.to-input')).removeAttr('disabled');
        $(t.find('.body-text')).removeAttr('disabled');
        Session.set('currentLRMessage',this._id);
    },
    'click .newBtn' : function(e, t) {
        Template.card_messageComposer.saveMessage(t);
       var messageID = Flint.collection('lrmessages').insert(
            {
            sender: Flint.station().name,
            to: '<<NEW MESSAGE>>',
            body: ''.value,
            encoded: false,
            status: 'draft',
            simulatorId: Flint.simulatorId()
          });
        t.find('.to-input').value = '<<NEW MESSAGE>>';
        t.find('.body-text').value = '';
        $(t.find('.body-text')).removeAttr('disabled');
        $(t.find('.to-input')).removeAttr('disabled');
        Session.set('currentLRMessage',messageID);
   },
    'click .queueBtn' : function(e, t) {
        Flint.collection('lrmessages').update(Session.get('currentLRMessage'),{$set: {status: 'queued'}});
        t.find('.to-input').value = '';
        t.find('.body-text').value = '';
        $(t.find('.body-text')).removeAttr('disabled');
        $(t.find('.body-text')).attr('disabled', 'disabled');
        $(t.find('.to-input')).attr('disabled', 'disabled');
        Session.set('currentLRMessage','');
        
    },
    'click .clearBtn' : function(e, t) {
        var messageID = Session.get('currentLRMessage');
        Flint.collection('lrmessages').remove(messageID);
        t.find('.to-input').value = '';
        t.find('.body-text').value = '';
        $(t.find('.body-text')).attr('disabled', 'disabled');
        $(t.find('.to-input')).attr('disabled', 'disabled');
        Session.set('currentLRMessage','');
   },
    'blur .body-text, blur .to-input' : function(e, t) {
        Template.card_messageComposer.saveMessage(t);
    }
};

Template.card_messageComposer.helpers({
    saveMessage: function(context){
        var bodytext;
        if (Session.get('currentLRMessage') === '') {return null;}
        var message = Flint.collection('lrmessages').find({_id: Session.get('currentLRMessage')}).fetch();
        var senderName = Flint.station().name;
        console.log(message);
        if (message.encoded === true) {bodyText = message.body;}
        else {bodyText = context.find('.body-text').value;}
        var toText = context.find('.to-input').value;
        if (bodyText === null) {bodyText = '';}
        if (toText === null || toText === '') {toText = '<<NEW MESSAGE>>';}
        Flint.collection('lrmessages').update(
            Session.get('currentLRMessage'),
            {
                sender: senderName,
                to: toText,
                body: bodyText,
                encoded: message.encoded,
                status: 'draft',
                simulatorId: Flint.simulatorId()
            });
    },
    messageList: function(){
        return Flint.collection('lrmessages').find({status: 'draft', sender: Flint.station().name, simulatorId: Flint.simulatorId()});
    }
});


/**
Create a subscripton to cards.messageComposer.lrmessages and save for later teardown
@method created
*/
Template.card_messageComposer.created = function() {
    Session.set('currentLRMessage','');
    this.subComputation = Deps.autorun(function() {
    Meteor.subscribe("cards.messageComposer.lrmessages", Flint.simulatorId());
  });
};

/**
Teardown subscription to cards.messageComposer.lrmessages
@method destroyed
*/
Template.card_messageComposer.destroyed = function() {
  this.subComputation.stop();
    //Session.set('currentLRMessage','');
};

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}