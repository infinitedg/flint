getCommName = function () {
    var commName;
    Yloc = (Flint.system('Short Range Communications', 'commFrequency') / 4 * 1.25); //Makes it into a number out of 100.
    if (Yloc > 0 && Yloc <= 18.125) {
        commName = Template.card_shortRangeComm.commList()[0];
    }
    if (Yloc > 18.125 && Yloc <= 30.625) {
        commName = Template.card_shortRangeComm.commList()[1];
    }
    if (Yloc > 30.625 && Yloc <= 40.625) {
        commName = Template.card_shortRangeComm.commList()[2];
    }
    if (Yloc > 40.625 && Yloc <= 56.875) {
        commName = Template.card_shortRangeComm.commList()[3];
    }
    if (Yloc > 56.875 && Yloc <= 77.5) {
        commName = Template.card_shortRangeComm.commList()[4];
    }
    if (Yloc > 77.5 && Yloc <= 90.625) {
        commName = Template.card_shortRangeComm.commList()[5];
    }
    if (Yloc > 90.625 && Yloc <= 100) {
        commName = Template.card_shortRangeComm.commList()[6];
    }
    $('.commControls .textbox').html("FREQUENCY: " + (Math.floor(parseInt(Flint.system('Short Range Communications', 'commFrequency'),10) * 1.25 * 4.25 * 10) / 10) + " MHz" + '</br>' + commName);
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
        'click .submit': function (e) {
        var canvas = document.getElementById('canvasCandy');
        var theta = 0;
        var time = (new Date()).getTime();
        animate(canvas, theta, time);
    },
        'slideStart #frequency': function (e) {

    },
        'slide #frequency': function (e) {
        getCommName();
        Flint.system('Short Range Communications', 'commFrequency', e.target.value);
        var frequencyVal = (e.target.value / 4 * 1.25);
        Flint.collection('currentHails').find().forEach(function (h) {
            if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                Flint.system('Short Range Communications', 'commHail', 'connectable');
            } else {
                Flint.system('Short Range Communications', 'commHail', 'idle');
            }
        });
    },
        'slide #amplitude': function (e) {
        Flint.system('Short Range Communications', 'commAmplitude', e.target.value);
    },
        'click .hail': function (e) {
        Flint.beep();
        var frequencyVal = Flint.system('Short Range Communications', 'commFrequency') / 4 * 1.25;
        if (Flint.system('Short Range Communications', 'commHail') == "hailing") {
            Flint.collection('currentHails').find().forEach(function (h) {
                if (h.frequency + 0.5 > frequencyVal && h.frequency - 0.5 < frequencyVal) {
                    Flint.system('Short Range Communications', 'commHail', 'connectable');
                } else {
                    Flint.system('Short Range Communications', 'commHail', 'idle');
                }
            });
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
    hailLabel: function () {
        if (Flint.system('Short Range Communications', 'commHail') == "hailing") {
            return 'CANCEL HAIL';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "connected") {
            return 'DISCONNECT';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "idle") {
            return 'HAIL';
        }
        if (Flint.system('Short Range Communications', 'commHail') == "connectable") {
            return 'CONNECT - ' + Flint.system('Short Range Communications', 'commName');
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
        var canvas = document.getElementById('canvasCandy');
        var theta = 0;
        var time = (new Date()).getTime();
        animate(canvas, theta, time);
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

function drawSpring(canvas, context) {
    var c = $('#canvasCandy');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();
    context.beginPath();
    context.moveTo(0, 0);
    var f = parseInt(Flint.system('Short Range Communications', 'commFrequency'),10) / 16; //parseInt($('#frequency').val())/8;
    var a = parseInt(Flint.system('Short Range Communications', 'commAmplitude'),10); //parseInt($('#amplitude').val());
    var p = 5;
    //debugger;
    for (var y = 0; y < $(container).height(); y++) {
        // Sine wave equation
        var x = Math.sin(y * Math.PI / 180 * f) * a + p;
        context.lineTo(x, y);
    }
}

function animate(canvas, theta, lastTime) {
    var context = canvas.getContext('2d');

    // update
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    theta += timeDiff / 400;
    lastTime = time;

    var scale = 0.8 * (Math.sin(theta) + 1.3);

    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw
    context.save();
    context.translate(canvas.width / 2, 0);

    context.save();
    context.scale(1, scale);
    drawSpring(canvas, context);
    context.restore();

    if (Flint.system('Short Range Communications', 'commHail') == 'connected') {
        context.lineWidth = 6;
        context.strokeStyle = '#00B7FF';
    } else {
        context.lineWidth = 3;
        context.strokeStyle = '#00ff45';
    }
    // blue-ish color
    context.stroke();

    context.translate(0, 200 * scale);
    //drawWeight(canvas, context);
    context.restore();

}

Template.card_shortRangeComm.created = function () {
    this.subscription = Deps.autorun(function () {
        Meteor.subscribe('cards.shortRangeComm.hails', Flint.simulatorId());
    });
};
Template.card_shortRangeComm.rendered = function () {
    Comm = "Short Range Communications";
    this.conditionObserver = Flint.collection('systems').find({
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
            var canvas = document.getElementById('canvasCandy');
            var theta = 0;
            var time = (new Date()).getTime();
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
            if (fields.commAmplitude || fields.commFrequency) {
                animate(canvas, theta, time);
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
                animate(canvas, theta, time);
            }
        }
    });



    var c = $('#canvasCandy');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();

    //Run function when browser resizes
    $(window).resize(respondCanvas);

    function respondCanvas() {
        c.attr('width', $(container).width()); //max width
        c.attr('height', $(container).height()); //max height
        var canvas = document.getElementById('canvasCandy');
        var theta = 0;
        var time = (new Date()).getTime();
        animate(canvas, theta, time);
    }

    respondCanvas();
    getCommName();

    var canvas = document.getElementById('canvasCandy');
    var theta = 0;
    var time = (new Date()).getTime();
    animate(canvas, theta, time);
};