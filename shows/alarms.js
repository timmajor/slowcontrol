function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var data={
    "pageTitle":"Threshold Values",
    "ioss":[]
  };
  var sizes={
    "ioss":[
      {
        "ios":1,
        "cards":[
          {"card":"cardA",
            "channels":20
          },
          {"card":"cardC",
            "channels":20
          },
          {"card":"cardD",
            "channels":20
          }
        ]
      },
      {
        "ios":2,
        "cards":[
          {"card":"cardA",
            "channels":20
          },
          {"card":"cardB",
            "channels":20
          },
          {"card":"cardC",
            "channels":20
          }
        ]
      },
      {
        "ios":3,
        "cards":[
          {"card":"cardA",
            "channels":32
          }
        ]
      }
    ]
  };

  for (var ios=0; ios<sizes.ioss.length; ios++){
    data.ioss[ios]={
      "ios":ios,
      "cards":[]
    };
    for (var card=0; card<sizes.ioss[ios].cards.length; card++){
      data.ioss[ios].cards[card]={
        "card":card,
        "channels":[]
      };
      for (var channel=0; channel<sizes.ioss[ios].cards[card].channels; channel++){
        data.ioss[ios].cards[card].channels[channel]={"channel":channel};
      }
    }
  }  
  
  data.sizes=JSON.stringify(sizes);

  return Mustache.to_html(ddoc.templates.alarms, data);
}
