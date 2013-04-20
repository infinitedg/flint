(function() {
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
}());