function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var data={
    "pageTitle":"Threshold Values",
    "ioss":[],
    "racks":[],
    "crates":[],
    "compcoils":[],
    "other":[]
  };
  
  var channels = {
    "racks":{
      "channels":[
        "24V",
        "-24V",
        "8V",
        "5V",
        "-5V"
      ],
      "ids":[1,2,3,4,5,6,7,8,9,10,11,"Timing"],
      "styles":[
        "two","two","one","two","two","two","one","two","two","one","two","one"
      ]
    },
    "crates":{
      "channels":[
        "24V",
        "-24V",
        "8V",
        "5V",
        "-5V",
        "XL3_V",
        "XL3_T"
      ],
      "ids":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],  
      "styles":[
        "one","one","one","one","one","one","one","one","one","one","one","one","one","one","one","one","one","one","one"
      ]
    },
    "compcoils":{
      "channels":[
        "current",
        "alarms"
      ],
      "ids":[
        "1A","1B",2,3,4,5,6,7,"8A","8B","9A","9B",10,11
      ],
      "styles":[
      "cc","cc","cc","cc","cc","cc","cc","cc","cc","cc","cc","cc","cc","cc","cc" 
      ]
    },
    "other":{
      "channels":[""],
      "ids":["E-Stop","Mine Power"], 
      "styles":["big","big"],
    }
  };

  for (var index=0; index<channels.racks.ids.length; index++){
    data.racks[index]={
      "id":channels.racks.ids[index],
      "style":channels.racks.styles[index],
      "channels":[]
    };
    for (var channelindex=0; channelindex<channels.racks.channels.length; channelindex++){
      data.racks[index].channels[channelindex]={"channel":channels.racks.channels[channelindex]};
    }
  }
  data.racks[11].channels[2].channel="6V";

  for (var index=0; index<channels.crates.ids.length; index++){
    data.crates[index]={
      "id":channels.crates.ids[index],
      "style":channels.crates.styles[index],
      "channels":[]
    };
    for (var channelindex=0; channelindex<channels.crates.channels.length; channelindex++){
      data.crates[index].channels[channelindex]={"channel":channels.crates.channels[channelindex]};
    }
  }

  for (var index=0; index<channels.compcoils.ids.length; index++){
    data.compcoils[index]={
      "id":channels.compcoils.ids[index],
      "style":channels.compcoils.styles[index],
      "channels":[]
    };
    for (var channelindex=0; channelindex<channels.compcoils.channels.length; channelindex++){
      data.compcoils[index].channels[channelindex]={
       "channel":channels.compcoils.channels[channelindex],
       "channelshort":channels.compcoils.channels[channelindex].charAt(0)
      };
    }
  }

  for (var index=0; index<channels.other.ids.length; index++){
    data.other[index]={
      "id":channels.other.ids[index],
      "style":channels.other.styles[index],
      "channels":[]
    };
    for (var channelindex=0; channelindex<channels.other.channels.length; channelindex++){
      data.other[index].channels[channelindex]={"channel":channels.other.channels[channelindex]};
    }
  }

  data.channels=JSON.stringify(channels);
  return Mustache.to_html(ddoc.templates.slowcontrol, data);
}
