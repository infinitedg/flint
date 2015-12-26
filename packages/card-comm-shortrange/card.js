getCommName = function () {
    var commName;
    var commList = Flint.system('Short Range Communications', 'commList');
    Yloc = (Flint.system('Short Range Communications', 'commFrequency') / 4 * 1.25); //Makes it into a number out of 100.
    if (Yloc > 0 && Yloc <= 18.125) {
        commName = commList[0];
    }
    if (Yloc > 18.125 && Yloc <= 30.625) {
        commName = commList[1];
    }
    if (Yloc > 30.625 && Yloc <= 40.625) {
        commName = commList[2];
    }
    if (Yloc > 40.625 && Yloc <= 56.875) {
        commName = commList[3];
    }
    if (Yloc > 56.875 && Yloc <= 77.5) {
        commName = commList[4];
    }
    if (Yloc > 77.5 && Yloc <= 90.625) {
        commName = commList[5];
    }
    if (Yloc > 90.625 && Yloc <= 100) {
        commName = commList[6];
    }
    $('.commImage').attr('src', Flint.a('/Comm Images/' + commName));
    Flint.system('Short Range Communications', 'commName', commName);
};

Template.card_shortRangeComm.events = {
    'click .mute': function (e) {
        Flint.beep();
        if (Flint.system('Short Range Communications', 'commMute') == 'true') {
            Flint.system('Short Range Communications', 'commMute', 'false');
        } else {
            Flint.system('Short Range Communications', 'commMute', 'true');
        }
    },
    'slideStart #frequency': function (e) {

    },
    'slide #frequency': function (e) {
        var frequencyVal = (e.target.value / 4 * 1.25);
        var tf = false;
        Flint.system('Short Range Communications', 'commFrequency', e.target.value);
        Session.set('card_shortrange_frequency',e.target.value);
        Flint.collection('currentHails').find().forEach(function (h) {
            if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                Flint.system('Short Range Communications', 'commHail', 'connectable');
                tf = true;
            }
        });
        if (!tf){
            Flint.system('Short Range Communications', 'commHail', 'idle');
        }
        animate();
    },
    'slide #amplitude': function (e) {
        Flint.system('Short Range Communications', 'commAmplitude', e.target.value);
        animate();
    },
    'click .hail': function (e) {
        var frequencyVal = Flint.system('Short Range Communications', 'commFrequency') / 4 * 1.25;
        Flint.beep();
        if (Flint.system('Short Range Communications', 'commHail') == "hailing") {
            Flint.collection('currentHails').find().forEach(function (h) {
                if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                    Flint.system('Short Range Communications', 'commHail', 'connectable');
                    return false;
                }
            });
            Flint.system('Short Range Communications', 'commHail', 'idle');
        } else if (Flint.system('Short Range Communications', 'commHail') == "connected") {
            Flint.collection('currentHails').find().forEach(function (h) {
                if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                    Flint.system('Short Range Communications', 'commHail', 'connectable');
                } else {
                    Flint.system('Short Range Communications', 'commHail', 'idle');
                }
            });
        } else if (Flint.system('Short Range Communications', 'commHail') == "idle") {
            Flint.system('Short Range Communications', 'commHail', 'hailing'); //Open Hail
        } else if (Flint.system('Short Range Communications', 'commHail') == "connectable") {
            Flint.system('Short Range Communications', 'commHail', 'connected'); //Connect Hail
        }
    }
};

Template.card_shortRangeComm.helpers({
    frequency: function(){
        return Flint.system('Short Range Communications', 'commFrequency') / 4 * 1.25 + 'MHz';
    },
    hailLabel: function () {
        if (Flint.system('Short Range Communications', 'commHail') == "hailing") {
            $('#frequency').slider('disable');
            $('#amplitude').slider('disable');
            return 'CANCEL HAIL';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "connected") {
            $('#frequency').slider('disable');
            $('#amplitude').slider('disable');
            return 'DISCONNECT';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "idle") {
            $('#frequency').slider('enable');
            $('#amplitude').slider('enable');
            return 'HAIL';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "connectable") {
            $('#frequency').slider('enable');
            $('#amplitude').slider('enable');
            return 'CONNECT';
        }
    },
    muteLabel: function () {
        if (Flint.system('Short Range Communications', 'commMute') == 'false') {
            return 'Mute Communication';
        } else {
            return 'Unmute Communication';
        }
    },
    currentHails: function () {
        return Flint.collection('currentHails').find();
    },
    arrowLocation: function () {
        var frequency = this.frequency;
        var value = 'top: calc(' + frequency + '% - 26px);';
        return value;
    },
    amplitudeValue: function () {
        Comm = "Short Range Communications";
        return Flint.collection('systems').find({
            'simulatorId': Flint.simulatorId(),
            'name': Comm
        }).fetch()[0].commAmplitude;
    },
    stardate: function () {
        var calculatedDate = new Date().getTime() / 1000 / 60 / 60 / 30 / 2;
        var subtraction = Math.floor(calculatedDate);
        var finalDate = (calculatedDate - subtraction) * 100000;
        return Math.floor(finalDate) / 10;
    },
    muteEnabled: function () {
        if (Flint.system('Short Range Communications', 'commHail') == 'connected') return '';
        else return 'disabled';
    },
    vh: function (perc) {
        var windowHeight = window.innerHeight;
        return windowHeight * (perc / 100);
    },
    vw: function (perc) {
        var windowWidth = window.innerWidth;
        return windowWidth * (perc / 100);
    },
    commList: function () {
        var commList = Flint.system('Short Range Communications', 'commList');
        return commList;
    }
});

function animate() {
    var canvas = $('#canvasCandy')[0];
    var context = canvas.getContext('2d');
    var f = parseInt(Flint.system('Short Range Communications', 'commFrequency'),10) / 16;
    var a = parseInt(Flint.system('Short Range Communications', 'commAmplitude'),10);
    var p = 5;

    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (Flint.system('Short Range Communications', 'commHail') == 'connected') {
        context.lineWidth = 6;
        context.strokeStyle = '#00B7FF';
    } else {
        context.lineWidth = 3;
        context.strokeStyle = '#00ff45';
    }
    var xOffset = canvas.width / 2;
    context.beginPath();
    context.moveTo(xOffset, 0);
    for (var y = 0; y < canvas.height + 10; y++) {
        // Sine wave equation
        context.lineTo(Math.sin(y * Math.PI / 180 * f) * a + p + xOffset, y);
    }
    // blue-ish color
    context.stroke();
   // window.requestAnimationFrame(animate);
}

Template.card_shortRangeComm.created = function () {
    this.subscription = Tracker.autorun(function () {
        Meteor.subscribe('cards.shortRangeComm.hails', Flint.simulatorId());
    });
};
Template.card_shortRangeComm.rendered = function () {
    Comm = "Short Range Communications";
    $('#frequency').slider();
    $('#amplitude').slider();
    $('#frequency').slider('setValue', parseInt(Flint.system('Short Range Communications', 'commFrequency'),10));
    $('#amplitude').slider('setValue', parseInt(Flint.system('Short Range Communications', 'commAmplitude'),10));
   /* this.conditionObserver = Flint.collection('systems').find({
        'simulatorId': Flint.simulatorId(),
        'name': Comm
    }).observeChanges({
        added: function (id, fields) {
            if (fields.commFrequency && fields.commAmplitude) {
                $('#frequency').slider();
                $('#amplitude').slider();
                $('#frequency').slider('setValue', parseInt(fields.commFrequency,10));
                $('#amplitude').slider('setValue', parseInt(fields.commAmplitude,10));
            }
            if (fields.commHail) {
                if (fields.commHail == "hailing") {
                    $('#frequency').slider('disable');
                    $('#amplitude').slider('disable');
                }
                if (fields.commHail == "connected") {
                    $('#frequency').slider('disable');
                    $('#amplitude').slider('disable');
                }
                if (fields.commHail == "idle") {
                    $('#frequency').slider('enable');
                    $('#amplitude').slider('enable');
                }
                if (fields.commHail == "connectable") {
                    $('#frequency').slider('enable');
                    $('#amplitude').slider('enable');
                }
            }
        },
        changed: function (id, fields) {
            if (fields.commFrequency) {
                var frequencyVal = fields.commFrequency / 4 * 1.25;
                Flint.collection('currentHails').find().forEach(function (h) {
                    if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                        Flint.system('Short Range Communications', 'commHail', 'connectable');
                    } else {
                        Flint.system('Short Range Communications', 'commHail', 'idle');
                    }
                });
            }
            if (fields.commHail) {
                if (fields.commHail == "hailing") {
                    $('#frequency').slider('disable');
                    $('#amplitude').slider('disable');
                }
                if (fields.commHail == "connected") {
                    $('#frequency').slider('disable');
                    $('#amplitude').slider('disable');
                }
                if (fields.commHail == "idle") {
                    $('#frequency').slider('enable');
                    $('#amplitude').slider('enable');
                }
                if (fields.commHail == "connectable") {
                    $('#frequency').slider('enable');
                    $('#amplitude').slider('enable');
                }
            }
        }
    });*/



var c = $('#canvasCandy');
var ct = c.get(0).getContext('2d');
var container = $(c).parent();

    //Run function when browser resizes
    $(window).resize(respondCanvas);

    function respondCanvas() {
        c.attr('width', $(container).width()); //max width
        c.attr('height', $(container).height()); //max height
    }

    respondCanvas();
    getCommName();

    animate();
};
