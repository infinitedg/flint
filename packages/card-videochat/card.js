      var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

  Template.card_videochat.rendered = function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    peer.on('open', function(){
      Session.set('video-peer-id',peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });
    step1();
  }
  Template.card_videochat.events({
    'click #make-call': function(){
      var call = peer.call($('#callto-id').val(), window.localStream);
      step3(call);
    },
    'click #end-call': function(){
     window.existingCall.close();
     step2();
   },
   'click #step1-retry': function(){
    $('#step1-error').hide();
    step1();
  }
})

  function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        Session.set('video-stream', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        Session.set('video-theirStream', URL.createObjectURL(stream))
      });

      // UI stuff
      window.existingCall = call;
      Session.set('video-their-id',call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    } 


    Template.card_videochat.helpers({
      peerId: function(){
        return Session.get('video-peer-id');
      },
      theirId: function(){
        return Session.get('video-their-id');
      },
      myStream: function(){
        return Session.get('video-stream');
      },
      theirStream: function(){
        return Session.get('video-theirStream');
      }
    })
