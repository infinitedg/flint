Template.layout_admin.hideCardlistCSS = function() {
  if (Flint.client('name')) {
    return '';
  } else {
    return 'hide';
  }
};

Template.layout_admin.destroyed = function() {
   this.subComputation.stop();  
};

Template.layout_admin.simulator = function() {
  return Flint.simulator();
}

Template.layout_admin.station = function() {
  return Flint.station();
}
Template.layout_admin.cardName = function() {
    return Flint.card().name;   
}
Template.layout_admin.cardId = function() {
    return Flint.card().cardId;
};
Template.layout_admin.created = function() {
    this.subComputation = Deps.autorun(function() {
        Meteor.subscribe("cards.chatMessages", Flint.simulatorId());
    });
	//Flint.play('sciences');
}
/*
 * metismenu - v1.0.3
 * Easy menu jQuery plugin for Twitter Bootstrap 3
 * https://github.com/onokumus/metisMenu
 *
 * Made by Osman Nuri Okumuş
 * Under MIT License
 */
!function(a,b,c){function d(b,c){this.element=b,this.settings=a.extend({},f,c),this._defaults=f,this._name=e,this.init()}var e="metisMenu",f={toggle:!0};d.prototype={init:function(){var b=a(this.element),c=this.settings.toggle;this.isIE()<=9?(b.find("li.active").has("ul").children("ul").collapse("show"),b.find("li").not(".active").has("ul").children("ul").collapse("hide")):(b.find("li.active").has("ul").children("ul").addClass("collapse in"),b.find("li").not(".active").has("ul").children("ul").addClass("collapse")),b.find("li").has("ul").children("a").on("click",function(b){b.preventDefault(),a(this).parent("li").toggleClass("active").children("ul").collapse("toggle"),c&&a(this).parent("li").siblings().removeClass("active").children("ul.in").collapse("hide")})},isIE:function(){for(var a,b=3,d=c.createElement("div"),e=d.getElementsByTagName("i");d.innerHTML="<!--[if gt IE "+ ++b+"]><i></i><![endif]-->",e[0];)return b>4?b:a}},a.fn[e]=function(b){return this.each(function(){a.data(this,"plugin_"+e)||a.data(this,"plugin_"+e,new d(this,b))})}}(jQuery,window,document);

Template.layout_admin.rendered = function(){
$('#side-menu').metisMenu();
//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
        topOffset = 50;
        width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse')
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse')
        }

        height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
}
Template.layout_admin.events = {

}
