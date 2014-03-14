/*
@module Templates
@submodule Cards
*/

/*
Card for targeting enemy ships. Target is sent from Sensors, typed in, and then locked in. Ability to show specific images for target
@class card_targeting
*/
var selectedTargetingField = '';

Template.card_targeting.selectField = function(whichField) {
    if (whichField == "next") {
        if (selectedTargetingField == 'x') {whichField = 'y';}
        if (selectedTargetingField == 'y') {whichField = 'z';}
        if (selectedTargetingField == 'z') {whichField = '';}
        if (selectedTargetingField == '')  {whichField = '';}
    }
        $(".lock-x").removeClass("selected");
        $(".lock-y").removeClass("selected");
        $(".lock-z").removeClass("selected");
        $(".lock-" + whichField).addClass("selected"); 
        $(".lock-" + whichField).text(""); 
        selectedTargetingField = whichField;
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
    },
    
    /*These next three make it so you can click on the field you want to type in.*/
    "mousedown .lock-x": function(e, context) {
    Flint.beep();
    Template.card_targeting.selectField('x');
    },
    "mousedown .lock-y": function(e, context) {
    Flint.beep();
    Template.card_targeting.selectField('y');
    },
    "mousedown .lock-z": function(e, context) {
    Flint.beep();
    Template.card_targeting.selectField('z');
    }
        
        

    
};

Template.card_targeting.rendered = function(){
    var a
  $(window).on('keydown', function(e){
    a = (e.which);
      console.log(a);
      /*Number Row keys*/
    if (a > 47 && a < 58) {
        newA=a-48;
        if (selectedTargetingField == ('')) {Template.card_targeting.selectField("x");}
        $('.selected').text($('.selected').text() + newA);
    }
      /*Number Pad keys*/
    else if (a > 95 && a < 106) {
        newA=a-96;
        if (selectedTargetingField == ('')) {Template.card_targeting.selectField("x");}
        $('.selected').text($('.selected').text() + newA);
    }
      /*Period and Decimal keys*/
    else if (a == 110 || a == 190) {
        newA='.';
        if (selectedTargetingField == ('')) {Template.card_targeting.selectField("x");}
        $('.selected').text($('.selected').text() + newA);
    }
    /*Return & Enter Keys*/
    else if (a == 13) {Template.card_targeting.selectField('next');}
     /*Delete & Backspace & clear*/
      else if (a == 8 || a == 46 || a == 12){
        if ($('.selected').text() != '') {$('.selected').text('');}
        else if ($('.selected').text() == '') {
            $(".lock-x").text("");
            $(".lock-y").text("");
            $(".lock-z").text("");
            Template.card_targeting.selectField('');
        }
        
    }
      
   return;
  }),
  $(window).on('keydown', function(e){})
               
};