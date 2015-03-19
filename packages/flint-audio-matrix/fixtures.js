Meteor.startup(function(){

  var defaultEq = {
    highshelf:{
      "enable" : 0,
      "mode" : 0,
      "freq" : 10000,
      "gain" : 0,
      "bw" : 1
    },
    lowshelf:{
      "enable" : 0,
      "mode" : 0,
      "freq" : 200,
      "gain" : 0,
      "bw" : 1
    },
    mid1:{
      "enable" : 0,
      "freq" : 5000,
      "gain" : 0,
      "bw" : 1
    },
    mid2:{
      "enable" : 0,
      "freq" : 1500,
      "gain" : 0,
      "bw" : 1
    }
  }

  if (Flint.collection('AudioMatrix').find().count() <= 0){
    Flint.collection('AudioMatrix').insert({
      _id:"voyager-audio-core",
      url:"http://voyager-audio-core.local/",
      name:"Voyager Audio Core"
    })
  }
  if (Flint.collection('AudioMatrixMix').find().count() <= 0){
    mixes = [
    {
      matrixId:"voyager-audio-core",
      name:"Bridge Mic 1",
      chan:"0",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge Mic 2",
      chan:"1",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge Headset",
      chan:"2",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Brig Mic",
      chan:"3",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Sickbay Mic",
      chan:"4",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Engineering Mic",
      chan:"5",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Transition Mic",
      chan:"6",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Conference Room Mic",
      chan:"7",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Control Room Mic 1",
      chan:"8",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Control Room Mic 2",
      chan:"9",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Music 1 L",
      chan:"10",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Music 1 R",
      chan:"11",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Music 2 L",
      chan:"12",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Music 2 R",
      chan:"13",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Video L",
      chan:"14",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Video R",
      chan:"15",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"SFX L",
      chan:"16",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"SFX R",
      chan:"17",
      eq:defaultEq,
      gate:{enable:0},
      comp:{enable:0},
      hpf:{enable:0},
      matrix:{
        fader:"1",
        pan:"0",
        solo:0,
        mute:0
      }
    }
    ]
    mixes.forEach(function(e){
      Flint.collection('AudioMatrixMix').insert(e);
    })
  }
  if (Flint.collection('AudioMatrixBus').find().count() <= 0){
    busses = [
    {
      matrixId:"voyager-audio-core",
      name:"Control Room 1",
      type:"group",
      chan:"0",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Control Room 2",
      type:"group",
      chan:"2",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Control Room 3",
      type:"group",
      chan:"4",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge L",
      type:"aux",
      chan:"0",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge R",
      type:"aux",
      chan:"1",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Sickbay L",
      type:"aux",
      chan:"2",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Sickbay R",
      type:"aux",
      chan:"3",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Engineering L",
      type:"aux",
      chan:"4",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Engineering R",
      type:"aux",
      chan:"5",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Transition L",
      type:"aux",
      chan:"6",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Transition R",
      type:"aux",
      chan:"7",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Conference L",
      type:"aux",
      chan:"8",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Conference R",
      type:"aux",
      chan:"9",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Hallway",
      type:"aux",
      chan:"10",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Brig",
      type:"aux",
      chan:"11",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge Headset L",
      type:"aux",
      chan:"12",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    },
    {
      matrixId:"voyager-audio-core",
      name:"Bridge Headset R",
      type:"aux",
      chan:"13",
      eq:defaultEq,
      matrix:{
        fader:"1",
        mute:0,
        prefader:0,
        enable:1
      }
    }

    ]
    busses.forEach(function(e){
      Flint.collection('AudioMatrixBus').insert(e);
    });
  }
  if (Flint.collection('AudioMatrixSend').find().count() <= 0){
    Flint.collection('AudioMatrixBus').find().forEach(function(bus){
      Flint.collection('AudioMatrixMix').find().forEach(function(mix){
        Flint.collection('AudioMatrixSend').insert({
          mixId:mix._id,
          busId:bus._id,
          volume:1,
          mute:0
        });
      });
    });
  }
});




