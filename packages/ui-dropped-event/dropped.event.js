  // backwards compatibility
  var ref;
  if (typeof Blaze !== "undefined" && typeof Blaze.View !== "undefined") {
    // Meteor 0.8.3+
    ref = Template.prototype;
  } else {
    ref = UI.Component;
  }

  // Save super before overwriting
  var _super = ref.events;

  // The noopHandler stops propagation and default
  var _noopHandler = function noopEventHandler(evt) {
    // var evt = (e.originalEvent || e);
    evt.stopPropagation();
    evt.preventDefault();
  }

  // Overwrite name it for debugging
  ref.events = function uiDroppedEvents_Overwrite(dict) {
    var self = this;

    // Carry
    var resultDict = {};

    // Iterate over the event bindings
    for (var name in dict) {

      // XXX: we dont currently support 'dropped #foo, dropped #bar'
      if (/^dropped/.test(name)) {
        // Get the selector part
        var selector = name.split(' ')[1];
        var n = name;

        if (selector) {

          // Block drag events
          resultDict['dragenter/dragexit/dragover/dragend ' + selector] = _noopHandler;

          // Rig the drop event
          resultDict['drop ' + selector] = function(evt, tmp) {
            // Stop original behaviour
            _noopHandler(evt);

            // Run user callback
            dict[n].apply(this, [evt, tmp]);
          };
        }
      } else {
        // Pass on original
        resultDict[name] = dict[name];
      }

    }

    // Hand over to super
    return _super.apply(self, [resultDict]);
  };
