/**
 * Setup a 5 column JQuery Masonry layout on create
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
