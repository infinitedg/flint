Template.card_tacControl.events = {
    'change #previewSelectUL': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacScreenUL: target
            }
        });
        e.preventDefault();
    },
        'change #previewSelectBL': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacScreenBL: target
            }
        });
        e.preventDefault();
    },
    'change #previewSelectUR': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacScreenUR: target
            }
        });
        e.preventDefault();
    },
        'change #previewSelectBR': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacScreenBR: target
            }
        });
        e.preventDefault();
    },
        'click body': function (e, context) {
        Session.set('selectedSymbol', '');
    },
        'click updateViewscreen': function(e, context){
            tacContacts = Flint.collection('racticalContacts')
    },
        'click #clearAll': function (e, context) {
        Session.set('selectedSymbol', '');
        for (var id in contactsArray) {
            Flint.collection('tacticalContacts').remove(id);
        }
        for (var id in bezier) {
            Flint.collection('tacticalContacts').remove(id);
        }
        for (var id in labelsArray) {
            Flint.collection('tacticalContacts').remove(id);
        }
    },
        'click .screenPicker': function (e, context) {
        var target = $(e.target);
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                currentScreen: target.attr('placeholder')
            }
        });
        e.preventDefault();
    },
        'change #screenSelect': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                currentScreen: target
            }
        });
        e.preventDefault();
    },
        'change #videoSelect': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacticalVideo: target
            }
        });
        e.preventDefault();
    },
    /*'slide #symbolRotation': function(e, context){
        var value = (e.value);
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        var xVal = target.attrs.x;
        var yVal = target.attrs.y;
        target.offset({x: target.attrs.width/2, y:target.attrs.height/2});
        //target.setPosition(stage.getWidth()/2,stage.getHeight()/2);
        target.clearCache();
        target.rotation(value);
        target.offset({x:0, y:0});
        contactsLayer.draw();
        },*/
        'slideStop #symbolSize': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        updateObj['width'] = target.attrs.width;
        updateObj['height'] = target.attrs.height;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'slide #symbolSize': function (e, context) {
        var value = (e.value) / 4;
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        var aspect = target.attrs.image.height / target.attrs.image.width;
        target.clearCache();
        target.attrs.width = value;
        target.attrs.height = value * aspect;
        target.cache();
        resetLocs();
        contactsLayer.draw();
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['width'] = target.attrs.width;
        updateObj['height'] = target.attrs.height;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'click .manualMove': function (e, context) {
        var target = e.target;
        if (target.id == 'manualMove1') {
            if (Session.get('manualMoveIJKL') == Session.get('selectedSymbol')) {
                Session.set('manualMoveIJKL', '');
            }
            Session.set('manualMoveWASD', Session.get('selectedSymbol'));
        } else if (target.id == 'manualMove2') {
            if (Session.get('manualMoveWASD') == Session.get('selectedSymbol')) {
                Session.set('manualMoveWASD', '');
            }
            Session.set('manualMoveIJKL', Session.get('selectedSymbol'));
        }
    },
        'hidePicker #contactColor': function (e, context) {
        var colors = e.color.toRGB();
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['red'] = colors.r;
        updateObj['green'] = colors.g;
        updateObj['blue'] = colors.b;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'click #curveArrow': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        if (e.target.checked) {
            updateObj['hasArrow'] = true;
        } else {
            updateObj['hasArrow'] = false;
        }
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'hidePicker #curveColor': function (e, context) {
        var colors = e.color.toHex();
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['color'] = colors;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'hidePicker #labelColor': function (e, context) {
        var colors = e.color.toHex();
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['fill'] = colors;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'change #LabelFont': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['fontFamily'] = e.target.value;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'change #LabelFunction': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['labelFunction'] = e.target.value;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'keyup #labelContent': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['text'] = e.target.value;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'slide #fontSize': function (e, context) {
        var value = (e.value);
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['fontSize'] = value;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'click #addCurve': function (e, context) {
        var updateObj = {
            type: 'bezier',
            selected: false,
            isVisible: true,
            start: {
                x: 100,
                y: 100
            },
            control1: {
                x: 150,
                y: 125
            },
            control2: {
                x: 175,
                y: 200
            },
            end: {
                x: 150,
                y: 150
            },
            color: "#00ff00",
            hasArrow: true,
            simulatorId: Flint.simulatorId()
        };

        Flint.collection('tacticalContacts').insert(updateObj);
    },
        'click #addLabel': function (e, context) {
        var updateObj = {
            type: 'label',
            labelFunction: 'normal',
            x: 100,
            y: 60,
            text: 'LABEL',
            fontSize: 18,
            fontFamily: 'Gamecuben',
            fill: '#fff',
            align: 'center',
            simulatorId: Flint.simulatorId()
        };
        Flint.collection('tacticalContacts').insert(updateObj);
    }
};