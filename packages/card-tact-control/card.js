var stage, symbolsLayer, contactsLayer, ghostLayer;
var backBox;
var curveLayer, lineLayer, anchorLayer, bezier = {};
var ULLoc = '',
URLoc = '',
BLLoc = '',
BRLoc = '';
window.currentDimensions = {
    x: 'x',
    y: 'y',
    flippedX: 1,
    flippedY: 1
};
k = {
    width: 250,
    height: 250,
    scale: 0.4, // Used to determine the sizing of contacts
    strokeWidth: 2,
    color: "00ff00",
    filter: {
        red: 0,
        green: 255,
        blue: 0
    },
    spritePath: '/packages/card-sensorGrid/sprites/'
};
armyArray = {};
contactsArray = {};
labelsArray = {};
k.center = {
    x: k.width / 2,
    y: k.height / 2
};
k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;

Template.card_tacControl.helpers({
    dynamicTemplateUL: function () {
        if (!Flint.system('Tactical Control').tacScreenUL) {
            return null;
        } else if (Flint.system('Tactical Control').tacScreenUL == 'Preview'){
            return Template[Flint.system('Viewscreen','currentScreen')];
        } else {
            return Template[Flint.system('Tactical Control').tacScreenUL];
        }
    },
    dynamicTemplateBL: function () {
        if (!Flint.system('Tactical Control').tacScreenBL) {
            return null;
        } else {
            return Template[Flint.system('Tactical Control').tacScreenBL];
        }
    },
    dynamicTemplateBR: function () {
        if (!Flint.system('Tactical Control').tacScreenBR) {
            return null;
        } else {
            return Template[Flint.system('Tactical Control').tacScreenBR];
        }
    },
    dynamicTemplateUR: function () {
        if (!Flint.system('Tactical Control').tacScreenUR) {
            return null;
        } else {
            return Template[Flint.system('Tactical Control').tacScreenUR];
        }
    }
});

function transformX(x) {
    //return k.width * ((x * currentDimensions.flippedX) + 1) / 2; // Translate and scale to different coordinate system
    return x;
}

function transformY(y) {
    //return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
    return y;
}
resetLocs = function () {
    var target;
    if (contactsArray.hasOwnProperty(Session.get('selectedSymbol'))) {
        target = contactsArray[Session.get('selectedSymbol')].contact;
        URLoc.setX(target.attrs.x + target.attrs.width - 10);
        URLoc.setY(target.attrs.y - 9);
        ULLoc.setX(target.attrs.x - 9);
        ULLoc.setY(target.attrs.y + 10);
        BRLoc.setX(target.attrs.x + target.attrs.width + 9);
        BRLoc.setY(target.attrs.y + target.attrs.height - 10);
        BLLoc.setX(target.attrs.x + 10);
        BLLoc.setY(target.attrs.y + target.attrs.height + 9);
    } else {
        target = labelsArray[Session.get('selectedSymbol')];
        URLoc.setX(target.attrs.x + target.getWidth() - 10);
        URLoc.setY(target.attrs.y - 9);
        ULLoc.setX(target.attrs.x - 9);
        ULLoc.setY(target.attrs.y + 10);
        BRLoc.setX(target.attrs.x + target.getWidth() + 9);
        BRLoc.setY(target.attrs.y + target.getHeight() - 10);
        BLLoc.setX(target.attrs.x + 10);
        BLLoc.setY(target.attrs.y + target.getHeight() + 9);
    }
};


//
Template.tacticalScreen.helpers({
    stage: function (e) {
        return stage;
    }
});

Template.card_tacControl.destroyed = function (e) {};

Template.tactical_controls.rendered = function (e) {
    $('#symbolSize').slider({
        range: true,
        tooltip: false,
        value: 100,
        min: 20,
        max: 1000,
        step: 1
    });
    $('#fontSize').slider({
        range: true,
        tooltip: true,
        value: 18,
        min: 6,
        max: 144,
        step: 2
    });
    $('#symbolControls').addClass('hidden');
    $('#labelControls').addClass('hidden');
    $('.colorpicker').colorpicker();
};
Template.tacticalScreen.rendered = function (e) {
    screenStage = new Kinetic.Stage({
        container: 'tacScreen',
        width: 720,
        height: 380
    });
    screenAnchorLayer = new Kinetic.Layer();
    screenLineLayer = new Kinetic.Layer();
    screenCurveLayer = new Kinetic.Layer();
    screenContactsLayer = new Kinetic.Layer();
    screenGridLayer = new Kinetic.Layer();

    backBox = new Kinetic.Rect({
        x: 1,
        y: 1,
        width: 718,
        height: 313,
        fill: 'black',
        stroke: 'green'
    });
    screenGridLayer.add(backBox);
    backBox.on('mousedown', function (e) {
        Session.set('selectedSymbol', '');
    });
    var line;
    for (i = 1; i < 24; i++) {
        line = new Kinetic.Line({
            points: [i * 60, 0, i * 60, 315],
            dash: [10, 5],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1
        });
        screenGridLayer.add(line);
    }
    for (i = 1; i < 5; i++) {
        line = new Kinetic.Line({
            points: [0, i * 60, 720, i * 60],
            dash: [10, 5],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1
        });
        screenGridLayer.add(line);
    }
    screenStage.add(screenGridLayer);
    screenStage.add(screenSymbolsLayer);
    screenStage.add(screenLineLayer);
    screenStage.add(screenCurveLayer);
    screenStage.add(screenAnchorLayer);
    screenStage.add(screenContactsLayer); // Uppermost layer
};


Template.tacticalPreview.rendered = function (e) {
    $(window).on('keydown', function (e) {
        if (contactsArray.hasOwnProperty(Session.get('selectedSymbol'))) {
            var id = Session.get('selectedSymbol');
            var target = contactsArray[Session.get('selectedSymbol')].contact;
            var updateObj = {};
            if (e.which == 87) { //'w'
                //updateObj['X'] = target.attrs.x + 1;
            updateObj.Y = target.attrs.y - 1;
            Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
        }
            if (e.which == 83) { //'s'
                updateObj.Y = target.attrs.y + 1;
            Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
        }
            if (e.which == 65) { //'a'
                updateObj.X = target.attrs.x - 1;
            Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
        }
            if (e.which == 68) { //'d'
                updateObj.X = target.attrs.x + 1;
            Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
        }
    }
    console.log(e.which);
});
Session.set('selectedSymbol', '');
stage = new Kinetic.Stage({
    container: 'tacPreview',
    width: 720,
    height: 380
});
anchorLayer = new Kinetic.Layer();
lineLayer = new Kinetic.Layer();
curveLayer = new Kinetic.Layer();
contactsLayer = new Kinetic.Layer();
symbolsLayer = new Kinetic.Layer();
ghostLayer = new Kinetic.Layer();
gridLayer = new Kinetic.Layer();

    // keep curves insync with the lines
    anchorLayer.on('beforeDraw', function () {
        drawCurves();
        updateDottedLines();
    });

    var selectionLocImage = new Image();
    selectionLocImage.onload = function () {
        URLoc = new Kinetic.Image({
            image: selectionLocImage,
            x: 20,
            y: 20,
            width: 19,
            height: 20,
            draggable: false,
            red: 255,
            green: 0,
            blue: 0
        });
        contactsLayer.add(URLoc);
        ULLoc = new Kinetic.Image({
            image: selectionLocImage,
            x: 40,
            y: 20,
            width: 19,
            height: 20,
            draggable: false,
            red: 255,
            green: 0,
            blue: 0,
            rotation: 270
        });
        contactsLayer.add(ULLoc);
        BRLoc = new Kinetic.Image({
            image: selectionLocImage,
            x: 20,
            y: 40,
            width: 19,
            height: 20,
            draggable: false,
            red: 255,
            green: 0,
            blue: 0,
            rotation: 90
        });
        contactsLayer.add(BRLoc);
        BLLoc = new Kinetic.Image({
            image: selectionLocImage,
            x: 40,
            y: 40,
            width: 19,
            height: 20,
            draggable: false,
            red: 255,
            green: 0,
            blue: 0,
            rotation: 180
        });
        contactsLayer.add(BLLoc);
        URLoc.opacity = 0;
        ULLoc.opacity = 0;
        BRLoc.opacity = 0;
        BLLoc.opacity = 0;
        URLoc.setX(-500);
        ULLoc.setX(-500);
        BRLoc.setX(-500);
        BLLoc.setX(-500);
    };
    selectionLocImage.src = "/packages/card-tacControl/images/cornerLoc.png";
    var trashCanIcon = new Image();
    trashCanIcon.onload = function () {
        trashCan = new Kinetic.Image({
            image: trashCanIcon,
            x: 670,
            y: 315,
            height: 50,
            width: 50,
            opacity: 0.5
        });
        // add hover styling
        trashCan.on('mouseover', function () {
            console.log('blah');
            this.opacity(1);
            contactsLayer.draw();
        });
        trashCan.on('mouseout', function () {
            this.opacity(0.5);
            contactsLayer.draw();
        });
        contactsLayer.add(trashCan);
    };
    trashCanIcon.src = "/packages/card-tacControl/images/trashcan.png";
    this.subscription = Deps.autorun(function () {
        Meteor.subscribe('cards.card-tacControl.symbols', Flint.simulatorId());
        Meteor.subscribe('cards.card-tacControl.contacts', Flint.simulatorId());
    });
    this.selectionWatcher = Deps.autorun(function (c) {
        var target;
        if (Session.get('selectedSymbol') !== '') {
            if (contactsArray.hasOwnProperty(Session.get('selectedSymbol'))) {
                $('#symbolControls').removeClass('hidden');
                $('#curveControls').addClass('hidden');
                $('#labelControls').addClass('hidden');
                resetLocs();
                URLoc.opacity = 1;
                ULLoc.opacity = 1;
                BRLoc.opacity = 1;
                BLLoc.opacity = 1;
                target = contactsArray[Session.get('selectedSymbol')].contact;
                $('#symbolSize').slider('setValue', (target.attrs.width * 4));
                //$('#symbolRotation').slider('setValue', (target.rotation()));
            }
            if (bezier.hasOwnProperty(Session.get('selectedSymbol'))) {
                $('#symbolControls').addClass('hidden');
                $('#curveControls').removeClass('hidden');
                $('#labelControls').addClass('hidden');
            }
            if (labelsArray.hasOwnProperty(Session.get('selectedSymbol'))) {
                $('#symbolControls').addClass('hidden');
                $('#curveControls').addClass('hidden');
                $('#labelControls').removeClass('hidden');
                resetLocs();
                URLoc.opacity = 1;
                ULLoc.opacity = 1;
                BRLoc.opacity = 1;
                BLLoc.opacity = 1;
                target = labelsArray[Session.get('selectedSymbol')];
                $('#labelContent').text(target.text());

            }
        } else if (URLoc) {
            $('#symbolControls').addClass('hidden');
            $('#curveControls').addClass('hidden');
            $('#labelControls').addClass('hidden');
            URLoc.opacity = 0;
            ULLoc.opacity = 0;
            BRLoc.opacity = 0;
            BLLoc.opacity = 0;
            URLoc.setX(-500);
            ULLoc.setX(-500);
            BRLoc.setX(-500);
            BLLoc.setX(-500);
        }
        contactsLayer.draw();
        // c.stop();
    });
backBox = new Kinetic.Rect({
    x: 1,
    y: 1,
    width: 718,
    height: 313,
    fill: 'black',
    stroke: 'green'
});
gridLayer.add(backBox);
backBox.on('mousedown', function (e) {
    Session.set('selectedSymbol', '');
});
var line;
for (i = 1; i < 24; i++) {
    line = new Kinetic.Line({
        points: [i * 60, 0, i * 60, 315],
        dash: [10, 5],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 1
    });
    gridLayer.add(line);
}
for (i = 1; i < 5; i++) {
    line = new Kinetic.Line({
        points: [0, i * 60, 720, i * 60],
        dash: [10, 5],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 1
    });
    gridLayer.add(line);
}
var sel = {};
sel.parentObject = Flint.collection('flintAssets').findOne({
    fullPath: '/Tactical Contacts'
})._id;
tacSymbolAssets = Flint.collection('flintAssets').find(sel);

this.tacSymbolsObserver = tacSymbolAssets.observe({
    addedAt: function (doc, atIndex) {
        var id = doc._id;
        var a = doc;
        if (a.defaultObject) {
            var f = Flint.FS.collection('flintAssets').findOne(a.defaultObject);
            if (f) {
                a.defaultUrl = f.url();
            }
        }

        if (!armyArray[id]) {
            armyArray[id] = {};
                // Draggable Contact
                var contactObj = new Image();
                contactObj.onload = function () {
                    var icon = new Kinetic.Image({
                        x: atIndex * (50 * k.scale + 5),
                        y: (315 + 50 * k.scale / 2),
                        image: contactObj,
                        width: 50 * k.scale,
                        height: (contactObj.height / contactObj.width) * 50 * k.scale,
                        draggable: true,
                        red: 242,
                        green: 174,
                        blue: 67
                    });
                    // Setup filters
                    icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                    // Dragging handler
                    icon.on('dragend', function (evt) {
                        var cTmpl = Flint.collection('tacSymbols').findOne(id);
                        var //x = ( currentDimensions.flippedX * 2 * (this.getX() + k.width + 30) / k.width) + 1 * currentDimensions.flippedX * -1,
                        //y = ( currentDimensions.flippedY * 2 * (this.getY()) / k.height) + 1 * currentDimensions.flippedY * -1,
                        x = this.getX(),
                        y = this.getY(),
                        width = this.attrs.image.width,
                        height = this.attrs.image.height,
                        d = true;
                        if (d) { // Only drop the contact if we are within 120% of the grid's radius
                            var updateObj = {
                                red: 0,
                                green: 255,
                                blue: 0,
                                type: 'contact',
                                isMoving: true,
                                selected: true,
                                isVisible: true,
                                velocity: 0.05,
                                icon: a.defaultUrl,
                                simulatorId: Flint.simulatorId()
                            };
                            updateObj.X = x;
                            updateObj.Y = y;
                            updateObj.width = 50;
                            updateObj.height = (height / width) * 50;
                            delete updateObj._id;
                            Flint.collection('tacticalContacts').insert(updateObj);
                        }
                        // Move back to the origin
                        this.setY(315 + 50 * k.scale / 2);
                        this.setX(atIndex * (50 * k.scale + 5));
                        symbolsLayer.draw();
                    });
                    // add the shape to the layer
                    symbolsLayer.add(icon);
                    icon.cache();
                    icon.draw();
                    armyArray[id].contact = icon;
                };
                contactObj.src = a.defaultUrl; //k.spritePath + doc.icon;
            }
        },
        changedAt: function (id, fields) {
            // Update kinetic image properties
        },
        removedAt: function (id) {}
    });
this.tacticalObserver = Flint.collection('tacticalContacts').find().observeChanges({
    added: function (id, doc) {
            // console.log("Added", id, doc);
            if (doc.type === 'contact') {
                if (!contactsArray[id]) {

                    contactsArray[id] = {};
                    // Draggable Contact
                    var contactObj = new Image();
                    contactObj.onload = function () {
                        var icon = new Kinetic.Image({
                            x: transformX(doc.X),
                            y: transformY(doc.Y),
                            selected: true,
                            image: contactObj,
                            width: (doc.width),
                            height: (doc.height),
                            draggable: true,
                            red: doc.red,
                            green: doc.green,
                            blue: doc.blue
                        });
                        // Setup filters
                        icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                        // Dragging handler
                        icon.on('mousedown', function (evt) {
                            Session.set('selectedSymbol', id);
                            contactsLayer.draw();
                        });
                        icon.on('dragstart', function (evt) {
                            Session.set('selectedSymbol', id);
                            contactsLayer.draw();
                        });
                        icon.on('dragmove', function (evt) {
                            resetLocs();
                        });
                        icon.on('dragend', function (evt) {
                            var x = this.getX(),
                            y = this.getY(),
                            updateObj = {
                                isMoving: true
                            };
                            if (x > 660 && x < 720 && y > 305 && y < 380) {
                                Flint.collection('tacticalContacts').remove(id);
                                Session.set('selectedSymbol', '');
                            } else {
                                updateObj.X = x;
                                updateObj.Y = y;
                                Flint.collection('tacticalContacts').update(id, {
                                    $set: updateObj
                                });
                            }
                        });
                        // add the shape to the layer
                        contactsLayer.add(icon);
                        icon.cache();
                        icon.draw();
                        contactsArray[id].contact = icon;
                        Session.set('selectedSymbol', id);
                    };
                    contactObj.src = doc.icon;
                }
            }
            if (doc.type === 'bezier') {
                if (!bezier[id]) {
                    addBezier(id, doc);
                }
            }
            if (doc.type === 'label') {
                if (!labelsArray[id]) {
                    var label = new Kinetic.Text({
                        x: doc.x,
                        y: doc.y,
                        text: doc.text,
                        fontSize: doc.fontSize,
                        fontFamily: doc.fontFamily,
                        fill: doc.fill,
                        align: doc.align,
                        selected: true,
                        draggable: true
                    });
                    label.on('mousedown', function (evt) {
                        Session.set('selectedSymbol', id);
                        contactsLayer.draw();
                    });
                    label.on('dragstart', function (evt) {
                        Session.set('selectedSymbol', id);
                        contactsLayer.draw();
                    });
                    label.on('dragmove', function (evt) {
                        resetLocs();
                    });
                    label.on('dragend', function (evt) {
                        var x = this.getX(),
                        y = this.getY(),
                        updateObj = {
                            isMoving: true
                        };
                        if (x > 660 && x < 720 && y > 305 && y < 380) {
                            Flint.collection('tacticalContacts').remove(id);
                            Session.set('selectedSymbol', '');
                        } else {
                            updateObj.x = x;
                            updateObj.y = y;
                            Flint.collection('tacticalContacts').update(id, {
                                $set: updateObj
                            });
                        }
                    });
                    labelsArray[id] = label;
                    contactsLayer.add(label);
                    Session.set('selectedSymbol', id);
                    contactsLayer.draw();
                }
            }
        },
        changed: function (id, fields) {
            fields.type = Flint.collection('tacticalContacts').findOne({
                _id: id
            }).type;
            // console.log("Changed", id, fields);
            if (fields.type === 'contact') {

                var contact = contactsArray[id].contact;
                if (contact) {
                    if (fields.X !== undefined) {
                        contact.setX(transformX(fields.X));
                    }
                    if (fields.Y !== undefined) {
                        contact.setY(transformY(fields.Y));
                    }
                    if (fields.red !== undefined) {
                        contact.attrs.red = fields.red;
                        contact.attrs.green = fields.green;
                        contact.attrs.blue = fields.blue;
                        contact.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                        contact.cache();
                    }
                    resetLocs();
                    contactsLayer.draw();
                }
            }
            if (fields.type === 'bezier') {
                updateBezier(id, fields);
            }
            if (fields.type === 'label') {
                var label = labelsArray[id];
                if (fields.x !== undefined) {
                    label.setX(fields.x);
                }
                if (fields.y !== undefined) {
                    label.setY(fields.y);
                }
                if (fields.text) {
                    label.text(fields.text);
                }
                if (fields.fontFamily) {
                    label.fontFamily(fields.fontFamily);
                }
                if (fields.fontSize) {
                    label.fontSize(fields.fontSize);
                }
                if (fields.fill) {
                    label.fill(fields.fill);
                }
                resetLocs();
                contactsLayer.draw();
            }
        },
        removed: function (id) {
            // console.log("Removed", id);
            if (contactsArray.hasOwnProperty(id)) {
                contactsArray[id].contact.remove();
                delete contactsArray[id];
                contactsLayer.draw();
            }
            if (bezier.hasOwnProperty(id)) {
                bezier[id].start.remove();
                bezier[id].control1.remove();
                bezier[id].control2.remove();
                bezier[id].end.remove();
                bezier[id].curveLine.remove();
                bezier[id].bezierLine.remove();
                bezier[id].arrow.remove();
                delete bezier[id];
                curveLayer.draw();
                anchorLayer.draw();
                lineLayer.draw();
            }
            if (labelsArray.hasOwnProperty(id)) {
                labelsArray[id].remove();
                delete labelsArray[id];
                contactsLayer.draw();
            }
        }
    });
stage.add(gridLayer);
stage.add(ghostLayer);
stage.add(symbolsLayer);
stage.add(lineLayer);
stage.add(curveLayer);
stage.add(anchorLayer);
    stage.add(contactsLayer); // Uppermost layer
};
