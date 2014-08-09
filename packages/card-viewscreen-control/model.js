var viewscreenCameras = Flint.collection('viewscreenCameras');

if (Meteor.isServer){
    
 
}
if (Meteor.isClient){
    Flint.collection('viewscreenCameras').find().observeChanges({
       
    });
}