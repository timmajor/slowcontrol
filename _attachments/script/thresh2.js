$.couch.app(function(app) {
  var presentThresholdData=[];
  var approvedThresholdData=[];
  var filledThresholdData=[];
  var presentData=[];
  var alarmData=[];
  var path="http://couch.snopl.us";
  var channeldb="/slowcontrol-channeldb/_design/slowcontrol";
  var datadb="/slowcontrol-data-5sec/_design/slowcontrol-data-5sec";
  var alarmdb="/slowcontrol-alarms/_design/slowcontrol-alarms";
  var options="?descending=true&limit=1";
  var checking = true;
  var approval=false;
  var sizes={
    "ioss":[]
  };

  var retrieveSizes = function(callback, callbackarg){
    $.getJSON(path+channeldb+"/_view/recent1"+options,function(result1){
      sizes.ioss[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent2"+options,function(result2){
        sizes.ioss[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent3"+options,function(result3){
          sizes.ioss[2]=result3.rows[0].value;
          $.getJSON(path+channeldb+"/_view/recent4"+options,function(result4){
            sizes.ioss[3]=result4.rows[0].value;
            presentThresholdData=sizes.ioss;
            if(callback){
              if(callbackarg){
                callback(callbackarg);
              }
              else{
                callback();
              }
            }
          });
        });
      });
    });
  };

  var fillThresholds = function(thresholdData){
    filledThresholdData=thresholdData;
    $("#statustext").text("Filling thresholds...");
    approved=true;
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; channel<sizes.ioss[ios].cards[card].channels.length; channel++){
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
          if (thresholdData[ios].cards[card]
          .channels[channel].isEnabled!=null){ //if proprety exists
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .attr("checked", thresholdData[ios].cards[card]
            .channels[channel].isEnabled);
          }
        }
      }
      approved = approved && thresholdData[ios].approved;
    }
    if (approved){
      $("#approved").attr("checked",true);
    }
    else {
      $("#approved").attr("checked",false);
    }
    $("#statustext").text("Done.");
    formatAll();
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
        channel<sizes.ioss[ios].cards[card].channels.length; channel++){
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
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardA.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardB){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardB.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardC){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardC.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
      if (presentData[ios].cardD){
        for (var channel=0; channel<sizes.ioss[ios].cards[cardCount].channels.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+channel).text(
          Math.round(parseFloat(presentData[ios].cardD.voltages[channel])*10000)/10000);
        }
        cardCount++;
      }
    }
    $("#statustext").text("Done.");
  };
 
  var retrievePresentThresholds = function(fill){
    $("#statustext").text("Getting Thresholds...");
/*    $.getJSON(path+channeldb+"/_view/recent1"+options,function(result1){
      presentThresholdData[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent2"+options,function(result2){ 
        presentThresholdData[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent3"+options,function(result3){
          presentThresholdData[2]=result3.rows[0].value;
          $.getJSON(path+channeldb+"/_view/recent4"+options,function(result4){
            presentThresholdData[3]=result4.rows[0].value;
*/
      retrieveSizes(function(){
            $("#statustext").text("Done.");
            if (fill==null){
              fillThresholds(presentThresholdData);
            }
            else if (fill){
              fillThresholds(presentThresholdData);
            }
            else{
              showThresholds(presentThresholdData, true);
            }

          });
/*        });
      });
    });
*/
  };

  var retrieveApprovedThresholds = function(fill){
    $("#statustext").text("Getting Thresholds...");
    $.getJSON(path+channeldb+"/_view/recent_approved1"+options,function(result1){
      approvedThresholdData[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent_approved2"+options,function(result2){ 
        approvedThresholdData[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent_approved3"+options,function(result3){
          approvedThresholdData[2]=result3.rows[0].value;
          $.getJSON(path+channeldb+"/_view/recent_approved4"+options,function(result4){
            approvedThresholdData[3]=result4.rows[0].value;
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
          $.getJSON(path+datadb+"/_view/recent4"+options,function(result4){
            presentData[3]=result4.rows[0].value;
            $("#statustext").text("Done.");
            fillValues(presentData);
            formatAll();
          });
        });
      });
    });
  }


  var formatAll = function(){
    $("#statustext").text("Formatting...");
  
    $("#statustext").text("Getting Alarms...");
    $.getJSON(path+alarmdb+"/_view/recent1"+options,function(result1){
      alarmData[0]=result1.rows[0].value;
      $.getJSON(path+alarmdb+"/_view/recent2"+options,function(result2){ 
        alarmData[1]=result2.rows[0].value;
        $.getJSON(path+alarmdb+"/_view/recent3"+options,function(result3){
          alarmData[2]=result3.rows[0].value;
          $.getJSON(path+alarmdb+"/_view/recent4"+options,function(result4){
            alarmData[3]=result4.rows[0].value;
            $(".realvalue").css({"color":"black"});
            for (var ios=0; ios<sizes.ioss.length; ios++){
              for (var card=0; card<sizes.ioss[ios].cards.length; card++){
                for (var channel=0; 
                channel<sizes.ioss[ios].cards[card].channels.length; channel++){
                  if (presentThresholdData[ios].cards[card].channels[channel].isEnabled==0){
                    $("#present_ios"+ios+"card"+card+"channel"+channel).css({"color":"yellow"});
                  }
                }
              }
            }
            var cardCount;
            for (var ios=0; ios<alarmData.length; ios++){
              cardCount=0;
              if (alarmData[ios].cardA){
                for (var channel=0; channel<alarmData[ios].cardA.length; channel++){
                  $("#present_ios"+ios+"card"+cardCount+"channel"+alarmData[ios].cardA[channel].channel).css({"color":"red"});
                }
                cardCount++;
              }
              if (alarmData[ios].cardB){
                for (var channel=0; channel<alarmData[ios].cardB.length; channel++){
                  $("#present_ios"+ios+"card"+cardCount+"channel"+alarmData[ios].cardB[channel].channel).css({"color":"red"});
                }
                cardCount++;
              }
              if (alarmData[ios].cardC){
                for (var channel=0; channel<alarmData[ios].cardC.length; channel++){
                  $("#present_ios"+ios+"card"+cardCount+"channel"+alarmData[ios].cardC[channel].channel).css({"color":"red"});
                }
                cardCount++;
              }
              if (alarmData[ios].cardD){
                for (var channel=0; channel<alarmData[ios].cardD.length; channel++){
                  $("#present_ios"+ios+"card"+cardCount+"channel"+alarmData[ios].cardD[channel].channel).css({"color":"red"});
                }
                cardCount++;
              }
            }
            $("#statustext").text("Done.");
          });
        });
      });
    });
    $("#statustext").text("Done.");
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
  $("#format").click(function(){
    formatAll();
  });

  $("#saveThresholds").click(function(){
    $("#statustext").text("Saving.");
    $(".present").css({"display":"none"});
    $(".approved").css({"display":"none"});
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; channel<sizes.ioss[ios].cards[card].channels.length; 
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
      filledThresholdData[ios].approved=$("#approved").attr("checked");
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

  $("#everything").keydown(function(){
    approval=false;
    $("#approved").attr("checked",false);
  });
  
  var waitCheck = function(amChecking){
    if (amChecking){
      setTimeout(function(){
      retrievePresentValues();
      waitCheck(amChecking);
      },15000);
    }
  } 

  retrieveSizes(retrievePresentValues);
//  setTimeout(function(){retrievePresentThresholds();},5000); // on pageload
  waitCheck(checking);
});
