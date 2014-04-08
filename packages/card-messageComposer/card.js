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
                },10)
            $(context.find('.body-text')).attr('disabled', 'disabled');
            Flint.collection('lrmessages').upsert(Session.get('currentLRMessage'),{$set: {encoded: true}});
 
    },
    
    'click .saveBtn' : function(e,context) {
        Template.card_messageComposer.saveMessage(context);
        },
    
    
    'click .textbox p' : function(e, t) {
        Template.card_messageComposer.saveMessage(t);
        $(t.findAll('.message-list .textbox p')).removeClass('lineSelected');
        t.find('.to-input').value = this.to;
        t.find('.body-text').value = this.body;
        $(e.target).addClass('lineSelected');
        if (this.encoded){
            console.log('encoded!');
            $(t.find('.body-text')).attr('disabled', 'disabled');
        } else {
            console.log('Not encoded!');
            $(t.find('.body-text')).removeAttr('disabled');
        }
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
            status: '',
            simulatorId: Flint.simulatorId()
          });
        t.find('.to-input').value = '<<NEW MESSAGE>>';
        t.find('.body-text').value = '';
        Session.set('currentLRMessage',messageID);
   },
    'click .clearBtn' : function(e, t) {
        var messageID = Session.get('currentLRMessage');
        Flint.collection('lrmessages').remove(messageID);
        t.find('.to-input').value = '';
        t.find('.body-text').value = '';
        $(t.find('.body-text')).removeAttr('disabled');
        Session.set('currentLRMessage','');
   }
};

Template.card_messageComposer.saveMessage = function(context){
    var message = Flint.collection('lrmessages').find({_id: Session.get('currentLRMessage')});
        Flint.collection('lrmessages').upsert(
            Session.get('currentLRMessage'),
            {
            sender: Flint.station().name,
            to: context.find('.to-input').value,
            body: context.find('.body-text').value,
            encoded: message.encoded,
            status: message.status,
            simulatorId: Flint.simulatorId()
          });
};
/**
Create a subscripton to cards.messageComposer.lrmessages and save for later teardown
@method created
*/
Template.card_messageComposer.created = function() {
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
};

Template.card_messageComposer.messageList = function(){
    return Flint.collection('lrmessages').find();
};
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
};