Meteor.publish('flint-audiomatrix', function(){
	return Flint.collection('audiomatrix').find();
})

Meteor.publish('flint-audiomatrix-mix', function(){
	return Flint.collection('audiomatrixmix').find();
})

Meteor.publish('flint-audiomatrix-bus', function(){
	return Flint.collection('audiomatrixbus').find();
})

Meteor.publish('flint-audiomatrix-send', function(){
	return Flint.collection('audiomatrixsend').find();
})