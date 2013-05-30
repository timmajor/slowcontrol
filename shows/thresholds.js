function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var data={
    "word":"A Word"
  };
  
//  data.detail=JSON.stringify(ddoc.templates.detail);
//  data.thresh1=JSON.stringify(ddoc.templates.thresh1);

  return Mustache.to_html(ddoc.templates.thresh1, data);
}
