var ModuleTypes = Flint.collection('lightcircuit-moduletypes');
var Categories = Flint.collection('lightcircuit-categories');
var Modules = Flint.collection('lightcircuit-modules');
Template.module_container.created = function(){
  Meteor.subscribe('lightCircuit_categories', {onReady:function(){
   Session.set('category_openstate', Categories.find().fetch());
 }});
  Meteor.subscribe('lightCircuit_moduletypes');
};
Template.module_container.rendered = function(){
  Draggable.create('ui-draggable', {
  });
};
Template.module_container.helpers({
  categories:function(){
    return Categories.find();
  },
  categoryOpen:function(){
    var self = this;
    var categories = Session.get('category_openstate');
    if (categories){
      categories.forEach(function(e){
        if (e.name === self.name){
          if (e.state === 'closed'){
            return 'closed';
          }
          return 'open';
        }
      });
    }
  },
  categoryModule:function(){
    return ModuleTypes.find({category:this.name});
  },
});
Template.module_container.events({
  'click .palette-header':function(){
    var self = this;
    var i;
    var categories = Session.get('category_openstate');
    for (i = 0; i < categories.length; i++){
     if (categories[i].name === self.name){
      if (categories[i].state !== 'closed'){
        categories[i].state = 'closed';
      } else {
        categories[i].state = 'open';
      }
    }
  }
  Session.set('category_openstate', categories);
},
'mousedown .ui-draggable':function(e){
  var self = this;
  var target = $(e.currentTarget).clone();
  target.css('position', 'absolute');
  target.css('top', e.pageY - e.currentTarget.clientHeight);
  target.css('left', e.pageX - e.currentTarget.clientWidth / 2);
  target = document.body.appendChild(target[0]);
  a = Draggable.create(target, {
    onDragEnd:function(){
      self.xPosition = e.pageX;
      self.yPosition = e.pageY - 18;
      self._id = Random.id();
      Modules.insert(self);
      target.remove();
    },
  });
  e.target = target;
  a[0].startDrag(e);
},
});

Template.sidebarTemplate.helpers({
  sideBarTemplate:function(){
    return Modules.findOne({_id:Session.get('selectedModule')});
  },
  sidebarTemplateName:function(){
    if (Modules.findOne({_id:Session.get('selectedModule')})){
      return 'lightModule_' + Modules.findOne(
        {_id:Session.get('selectedModule')}).name;
    }
  },
});
