/*
@module Templates
@submodule Cards
*/

/*
Card for targeting enemy ships. Target is sent from Sensors, typed in, and then locked in. Ability to show specific images for target.
@class card_targeting
*/
var selectedTargetingField = '';
var currentTacticalTarget;
var imagePath = "/packages/card-targeting/targeting-imgs/";
var randomLoopX;
var randomLoopY;
var randomLoopZ;
var TimeoutX;
var TimeoutY;
var TimeoutZ;
var TimeoutEnd;

Template.card_targeting.helpers({
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    selectField: function (whichField) {
        if (whichField == "next") {
            if (selectedTargetingField == 'x') {
                whichField = 'y';
            }
            if (selectedTargetingField == 'y') {
                whichField = 'z';
            }
            if (selectedTargetingField == 'z') {
                Template.card_targeting.lockTarget();
            }
            if (selectedTargetingField === '') {
                whichField = '';
            }
        }
        $(".lock-x").removeClass("selected");
        $(".lock-y").removeClass("selected");
        $(".lock-z").removeClass("selected");
        $(".lock-" + whichField).addClass("selected");
        $(".lock-" + whichField).text("");
        selectedTargetingField = whichField;
    },
    lockTarget: function () {
        if ($('.calculated-x').text() !== ('') && $('.lock-x').text() == $('.calculated-x').text() && $('.lock-y').text() == $('.calculated-y').text() && $('.lock-z').text() == $('.calculated-z').text()) {
            setTimeout(function () {
                clearInterval(randomLoopX);
                $(".lock-x").addClass("selected");
            }, 0);
            setTimeout(function () {
                clearInterval(randomLoopY);
                $(".lock-x").removeClass("selected");
                $(".lock-y").addClass("selected");
            }, 250);
            setTimeout(function () {
                clearInterval(randomLoopZ);
                $(".lock-y").removeClass("selected");
                $(".lock-z").addClass("selected");
            }, 500);
            setTimeout(function () {
                $(".lock-z").removeClass("selected");
            }, 750);
            $(".current-target-image").attr("src", ($(".target-image").attr("src")));
            a = Flint.simulator().tacticalTarget;
            a.targeted = true;
            Flint.simulators.update(Flint.simulatorId(), {
                $set: {
                    tacticalTarget: (a)
                }
            });

        } else {
            $(".current-target-image").attr("src", (imagePath + "notTargeting.png"));
            a = Flint.simulator().tacticalTarget;
            a.targeted = false;
            Flint.simulators.update(Flint.simulatorId(), {
                $set: {
                    tacticalTarget: (a)
                }
            });
        }


        Template.card_targeting.selectField('');
    },
    
});

/*This changes the image of the current target currently. It could do more, since the key it is observing is an array.*/
Template.card_targeting.created = function () {
    this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
        changed: function (id, fields) {
            if (fields.tacticalTarget) {
                if (fields.tacticalTarget.image === '') {
                    _i = 'noTarget.png';
                    $('.calculateBtn').addClass('disabled');
                    clearInterval(randomLoopX);
                    clearInterval(randomLoopY);
                    clearInterval(randomLoopZ);
                    clearTimeout(TimeoutX);
                    clearTimeout(TimeoutY);
                    clearTimeout(TimeoutZ);
                    clearTimeout(TimeoutEnd);
                    $(".calculated-x").text('');
                    $(".calculated-y").text('');
                    $(".calculated-z").text('');
                    a = Flint.simulator().tacticalTarget;
                    a.targeted = false;
                    Flint.simulators.update(Flint.simulatorId(), {
                        $set: {
                            tacticalTarget: (a)
                        }
                    });
                } else {
                    _i = fields.tacticalTarget.image + ".png";
                    $('.calculateBtn').removeClass('disabled');

                }
                $(".target-image").attr("src", (imagePath + _i));

                if (fields.tacticalTarget.targeted === false) {
                    $(".calculated-x").text('');
                    $(".calculated-y").text('');
                    $(".calculated-z").text('');
                    $(".current-target-image").attr("src", (imagePath + "notTargeting.png"));

                }
            }
        }
    });
};

Template.card_targeting.events = {
    "mousedown .keypad": function (e, context) {
        var a;
        Flint.beep();
        if (selectedTargetingField === ('')) {
            Template.card_targeting.selectField("x");
        }
        a = e.target.textContent;
        $('.selected').text($('.selected').text() + a);
        e.preventDefault();
    },

        "mousedown .returnButton": function (e, context) {
        Flint.beep();
        Template.card_targeting.selectField('next');

    },

        "mousedown .clearButton": function (e, context) {
        Flint.beep();
        if ($('.selected').text() !== '') {
            $('.selected').text('');
        } else if ($('.selected').text() === '') {
            $(".lock-x").text("");
            $(".lock-y").text("");
            $(".lock-z").text("");
            Template.card_targeting.selectField('');
        }
    },

    /*These next three make it so you can click on the field you want to type in.*/
        "mousedown .lock-x": function (e, context) {
        Flint.beep();
        Template.card_targeting.selectField('x');
    },
        "mousedown .lock-y": function (e, context) {
        Flint.beep();
        Template.card_targeting.selectField('y');
    },
        "mousedown .lock-z": function (e, context) {
        Flint.beep();
        Template.card_targeting.selectField('z');
    },
        "mousedown .lockInBtn": function (e, context) {
        Flint.beep();
        Template.card_targeting.lockTarget();
    },
        "mousedown .calculateBtn": function (e, context) {
        Flint.beep();
        randomLoopX = setInterval(function () {
            $(".calculated-x").text(Template.card_targeting.getRandomInt(1, 99999) / 100);
        }, 40);
        randomLoopY = setInterval(function () {
            $(".calculated-y").text(Template.card_targeting.getRandomInt(1, 99999) / 100);
        }, 40);
        randomLoopZ = setInterval(function () {
            $(".calculated-z").text(Template.card_targeting.getRandomInt(1, 99999) / 100);
        }, 40);
        TimeoutX = setTimeout(function () {
            clearInterval(randomLoopX);
            $(".calculated-x").addClass("hilited");
        }, 10000);
        TimeoutY = setTimeout(function () {
            clearInterval(randomLoopY);
            $(".calculated-x").removeClass("hilited");
            $(".calculated-y").addClass("hilited");
        }, 10250);
        TimeoutZ = setTimeout(function () {
            clearInterval(randomLoopZ);
            $(".calculated-y").removeClass("hilited");
            $(".calculated-z").addClass("hilited");
        }, 10500);
        TimeoutEnd = setTimeout(function () {
            $(".calculated-z").removeClass("hilited");
        }, 10750);



    }


};

Template.card_targeting.rendered = function () {
    var a;
    $(window).on('keydown', function (e) {
        a = (e.which);
        /*Number Row keys*/
        if (a > 47 && a < 58) {
            newA = a - 48;
            if (selectedTargetingField === ('')) {
                Template.card_targeting.selectField("x");
            }
            $('.selected').text($('.selected').text() + newA);
        }
        /*Number Pad keys*/
        else if (a > 95 && a < 106) {
            newA = a - 96;
            if (selectedTargetingField === ('')) {
                Template.card_targeting.selectField("x");
            }
            $('.selected').text($('.selected').text() + newA);
        }
        /*Period and Decimal keys*/
        else if (a == 110 || a == 190) {
            newA = '.';
            if (selectedTargetingField === ('')) {
                Template.card_targeting.selectField("x");
            }
            $('.selected').text($('.selected').text() + newA);
        }
        /*Return & Enter Keys*/
        else if (a == 13) {
            Template.card_targeting.selectField('next');
        }
        /*Delete & Backspace & clear*/
        else if (a == 8 || a == 46 || a == 12) {
            if ($('.selected').text() !== '') {
                $('.selected').text('');
            } else if ($('.selected').text() === '') {
                $(".lock-x").text("");
                $(".lock-y").text("");
                $(".lock-z").text("");
                Template.card_targeting.selectField('');
            }

        }

        return;
    });

};