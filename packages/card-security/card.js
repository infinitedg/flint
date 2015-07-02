Template.card_security.created =  function(){
    var stage = new Kinetic.Stage({
        container: 'shipview',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var layer = new Kinetic.Layer();

    var imageObj = new Image();
    imageObj.onload = function() {
        var image = new Kinetic.Image({
            x: 200,
            y: 50,
            image: imageObj,
            width: 613,
            height: 429

        });
        // add the shape to the layer
        layer.add(image);

        // add the layer to the stage
        stage.add(layer);
    };
    imageObj.src = '/packages/card-security/img/ship.png';

};
