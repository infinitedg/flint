/**
@module Templates
@submodule Layouts
*/
 
/**
Core layout for control room stations
@class layout_core
*/

/**
Setup a 5 column JQuery Masonry layout
@method created
*/
Template.layout_core.created = function() {
  var context = this;
  Meteor.defer(function() {
    $(context.find('.masonryBox')).masonry({
      itemSelector: '.coreCard',
      columnWidth: function(containerWidth) {
        return containerWidth / 5;
      }
    });
  });
};
