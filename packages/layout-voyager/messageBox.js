Template.layout_voyager_messageBox.helpers({
    messages: function() {
        return Flint.collection('ChatMessages').find({simId: Flint.simulatorId()}, { sort: [['time', 'desc']]}); 
    },
    messageBoxAnimate: function() {
        if (Session.get('messageBoxOpen')){return 'shown';}
        else {return '';}
    },
    newMessage: function() {
        if (Session.get('newMessage')){return '·';}
        else {return '';}  
    }
});

           //  $(".chat").scrollTop($(".chat")[0].scrollHeight);

Template.layout_voyager_messageBox.rendered = function(){
     //Meteor.setTimeout(function(){$(".chat").scrollTop($(".chat")[0].scrollHeight);},1000);     
}

Template.layout_voyager_messageBox.events({
    "click .messageBoxHeader": function(event){
        if (!Session.get('messageBoxOpen')){Session.set('newMessage', false);}
        Session.set('messageBoxOpen', (!Session.get('messageBoxOpen')));
    },
    "keypress input#message": function(event) {
        if (event.which == 13) {
          event.preventDefault();

      if (Flint.client().name) {
        var name = Flint.client().name;
      } else {
        var name = "Anonymous";
      }

      var message = document.getElementById("message");

      if (message.value != "") {
        newMessage = ({
            name: name,
            message: message.value,
            simId: Flint.simulatorId()
        });



        document.getElementById("message").value = "";
        message.value = "";
        if (newMessage != "") {
            //Meteor.setTimeout(function(){$(".chat").scrollTop($(".chat")[0].scrollHeight);},100);     
            return Flint.collection('ChatMessages').insert(newMessage);
        }
      }
    }
    }
});

//Gives the EnderLayout color classes for different alert levels
Template.layout_voyager_messageBox.alertLevel = function() {
  var a = Flint.simulator().alertCondition;
  switch (a) {
  case 'c':
  case 'cloak':
  case 'purple':
    return 'cloakColor';
  case 5:
    return 'nominalColor';
  case 4:
    return 'attentionColor';
  case 3:
    return 'cautionColor';
  case 2:
    return 'warningColor';
  case 1:
    return 'dangerColor';
  }
    
}
    