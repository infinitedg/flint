/*
@module Templates
@submodule Cards
*/

/*
Card for targeting enemy ships. Target is sent from Sensors, typed in, and then locked in. Ability to show specific images for target
@class card_targeting
*/
var selectedTargetingField = '';

Template.card_targeting.selectField = function(which) {
    if (which == "next") {
        if (selectedTargetingField == 'x') {which = 'y';}
        if (selectedTargetingField == 'y') {which = 'z';}
        if (selectedTargetingField == 'z') {which = '';}
    }
        $(".lock-x").removeClass("selected");
        $(".lock-y").removeClass("selected");
        $(".lock-z").removeClass("selected");
        $(".lock-" + which).addClass("selected"); 
        selectedTargetingField = which;
};

/*
Show whether the thruster buttons are being depressed.
*/


Template.card_targeting.events = {
    "mousedown .keypad": function(e, context) {
        var a;
        Flint.beep();
        if (selectedTargetingField == ('')) {
            Template.card_targeting.selectField("x");   
        }
        a = e.target.textContent;
        $('.selected').text($('.selected').text() + a);
        e.preventDefault();
    },
    
    "mousedown .returnButton": function(e, context) {
    Flint.beep();
    Template.card_targeting.selectField('next');
    
    },
    
    "mousedown .clearButton": function(e, context) {
    Flint.beep();
    if ($('.selected').text() != '') {
        $('.selected').text('');
    } else if ($('.selected').text() == '') {
        $(".lock-x").text("");
        $(".lock-y").text("");
        $(".lock-z").text("");
        Template.card_targeting.selectField('');
    }
    }
    
};