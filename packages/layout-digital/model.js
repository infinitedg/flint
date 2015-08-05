var ChatMessages = Flint.collection('ChatMessages');

if (Meteor.isServer){
    Flint.collection('ChatMessages').find().observeChanges({
        addedBefore: function (id, message) {
            Flint.collection('ChatMessages').update(id,{
                name: message.name,
                message: message.message,
                simId: message.simId,
                date: Date.now()});
           // message.time = Date.now();
            }
        
        
    });
}