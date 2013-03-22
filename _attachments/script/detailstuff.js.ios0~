$.couch.app(function(app) {
  var presentThresholdData=[];
  var approvedThresholdData=[];
  var filledThresholdData=[];
  var presentData=[];
  var path="http://127.0.0.1:5984";
  var channeldb="/slowcontrol/_design/slowcontrol";
  var datadb="/slowcontrol-data-5sec/_design/slowcontrol-data-5sec";
  var options="?descending=true&limit=1";
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

  var fillThresholds = function(thresholdData){
    filledThresholdData=thresholdData;
    $("#statustext").text("Filling thresholds...");
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; 
        channel<sizes.ioss[ios].cards[card].channels; 
        channel++){
          $("#name_ios"+ios+"card"+card+"channel"+channel).text("" + 
            thresholdData[ios].cards[card].channels[channel].id + " " + 
            thresholdData[ios].cards[card].channels[channel].signal + " " + 
            thresholdData[ios].cards[card].channels[channel].type);
          if (thresholdData[ios].cards[card].channels[channel].lolo){
            $("#lolo_ios"+ios+"card"+card+"channel"+channel).val(
            thresholdData[ios].cards[card].channels[channel].lolo);
            $("#lo_ios"+ios+"card"+card+"channel"+channel).val(
            thresholdData[ios].cards[card].channels[channel].lo);
            $("#hi_ios"+ios+"card"+card+"channel"+channel).val(
            thresholdData[ios].cards[card].channels[channel].hi);
            $("#hihi_ios"+ios+"card"+card+"channel"+channel).val(
            thresholdData[ios].cards[card].channels[channel].hihi);
          }
          else {
            $("#lolo_ios"+ios+"card"+card+"channel"+channel).attr(
            "disabled",true);
            $("#lo_ios"+ios+"card"+card+"channel"+channel).attr(
            "disabled",true);
            $("#hi_ios"+ios+"card"+card+"channel"+channel).attr(
            "disabled",true);
            $("#hihi_ios"+ios+"card"+card+"channel"+channel).attr(
            "disabled",true);
          }
          if (thresholdData[ios].cards[card]
          .channels[channel].isEnabled!=null){ //if proprety exists
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .attr("checked", thresholdData[ios].cards[card]
            .channels[channel].isEnabled);
          }
          else {
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .attr("disabled", true);
          }
        }
      }
    }
    $("#statustext").text("Done.");
  }

  var showThresholds = function(thresholdData, present){
    var type;
    if (present){
      type="present";
    }else{
      type="approved";
    }
    $("#statustext").text("Showing...");
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; 
        channel<sizes.ioss[ios].cards[card].channels; 
        channel++){
          if (thresholdData[ios].cards[card].channels[channel].lolo){
            $("#lolo_"+type+"_ios"+ios+"card"+card+"channel"+channel).text(
            thresholdData[ios].cards[card].channels[channel].lolo);
            $("#lo_"+type+"_ios"+ios+"card"+card+"channel"+channel).text(
            thresholdData[ios].cards[card].channels[channel].lo);
            $("#hi_"+type+"_ios"+ios+"card"+card+"channel"+channel).text(
            thresholdData[ios].cards[card].channels[channel].hi);
            $("#hihi_"+type+"_ios"+ios+"card"+card+"channel"+channel).text(
            thresholdData[ios].cards[card].channels[channel].hihi);
          }
        }
      }
    }
    $("#statustext").text("Done.");
  }
 
  var fillValues = function(presentValues){
    $("#statustext").text("Refreshing...");
    var cardCount;
    for (var ios=0; ios<sizes.ioss.length; ios++){
      cardCount=0;
      if (presentData[ios].cardA){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardA.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardB){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardB.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardC){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardC.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardD){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardD.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
    }
    $("#statustext").text("Done.");
  }
 
  var retrievePresentThresholds = function(fill){
    $("#statustext").text("Getting Thresholds...");
    $.getJSON(path+channeldb+"/_view/recent1"+options,function(result1){
      presentThresholdData[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent2"+options,function(result2){ 
        presentThresholdData[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent3"+options,function(result3){
          presentThresholdData[2]=result3.rows[0].value;
          $("#statustext").text("Done.");
          if (fill){
            fillThresholds(presentThresholdData);
          }
          else{
            showThresholds(presentThresholdData, true);
          }
        });
      });
    });
  }

  var retrieveApprovedThresholds = function(fill){
    $("#statustext").text("Getting Thresholds...");
    $.getJSON(path+channeldb+"/_view/recent_approved1"+options,function(result1){
      approvedThresholdData[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent_approved2"+options,function(result2){ 
        approvedThresholdData[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent_approved3"+options,function(result3){
          approvedThresholdData[2]=result3.rows[0].value;
          $("#statustext").text("Done.");
          if (fill){
            fillThresholds(approvedThresholdData);
          }
          else{
            showThresholds(approvedThresholdData, false);
          }
        });
      });
    });
  }

  var retrievePresentValues = function(){
    $("#statustext").text("Getting Values...");
    $.getJSON(path+datadb+"/_view/recent1"+options,function(result1){
      presentData[0]=result1.rows[0].value;
      $.getJSON(path+datadb+"/_view/recent2"+options,function(result2){ 
        presentData[1]=result2.rows[0].value;
        $.getJSON(path+datadb+"/_view/recent3"+options,function(result3){
          presentData[2]=result3.rows[0].value;
          $("#statustext").text("Done.");
          fillValues(presentData);
        });
      });
    });
  }

  $("#fillPresentThresholds").click(function(){
    retrievePresentThresholds(true);
  });
  $("#fillApprovedThresholds").click(function(){
    retrieveApprovedThresholds(true);
  });
  $("#showPresentThresholds").click(function(){
    retrievePresentThresholds(false);
    $(".present").css({"display":"block"});
  });
  $("#showApprovedThresholds").click(function(){
    retrieveApprovedThresholds(false);
    $(".approved").css({"display":"block"});
  });
  $("#hidePresentThresholds").click(function(){
    $(".present").css({"display":"none"});
  });
  $("#hideApprovedThresholds").click(function(){
    $(".approved").css({"display":"none"});
  });
  $("#refreshPresent").click(function(){
    retrievePresentValues();
  });

  $("#saveThresholds").click(function(){
    $("#statustext").text("Saving.");
    $(".present").css({"display":"none"});
    $(".approved").css({"display":"none"});
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; channel<sizes.ioss[ios].cards[card].channels; 
        channel++){
          if (presentThresholdData[ios].cards[card].channels[channel].lolo!=null){
            filledThresholdData[ios].cards[card].channels[channel].lolo=
            parseFloat($("#lolo_ios"+ios+"card"+card+"channel"+channel)
            .val());
            filledThresholdData[ios].cards[card].channels[channel].lo=
            parseFloat($("#lo_ios"+ios+"card"+card+"channel"+channel)
            .val());
            filledThresholdData[ios].cards[card].channels[channel].hi=
            parseFloat($("#hi_ios"+ios+"card"+card+"channel"+channel)
            .val());
            filledThresholdData[ios].cards[card].channels[channel].hihi=
            parseFloat($("#hihi_ios"+ios+"card"+card+"channel"+channel)
            .val());
          }
          if (presentThresholdData[ios].cards[card].channels[channel]
          .isEnabled!=null){
            if ($("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .attr("checked")){
              filledThresholdData[ios].cards[card].channels[channel]
              .isEnabled=1;
            } else {
              filledThresholdData[ios].cards[card].channels[channel]
              .isEnabled=0;
            }
          }
        }
      }

      filledThresholdData[ios].timestamp=Math.round(Date.now()/1000);
      filledThresholdData[ios].approved=0;
    }
    $("#statustext").text("Saving..");
    $.getJSON(path+"/_uuids?count="+sizes.ioss.length, function(result){
    $("#statustext").text("Saving...");
      for (var ios=0; ios<sizes.ioss.length; ios++){
        filledThresholdData[ios]._id=result.uuids[ios]; 
        delete filledThresholdData[ios]._rev;
        app.db.saveDoc(filledThresholdData[ios], {
          success : function(resp) {
            $("#statustext").text("Saved.");
          }
        });
      }
    });
  });

  retrievePresentThresholds(true); // on pageload
  retrievePresentValues();

});
