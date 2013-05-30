$.couch.app(function(app) {
  var approvedThresholdData=[];
  var filledThresholdData=[];
  var presentData=[];
  var alarms=[];
  var path="http://172.25.100.70:5984";
//  var path="http://localhost:5984";
  var channeldb="/slowcontrol-channeldb/_design/slowcontrol";
  var datadb="/slowcontrol-data-5sec/_design/slowcontrol-data-5sec";
  var alarmdb="/slowcontrol-alarms/_design/slowcontrol-alarms";
  var options="?descending=true&limit=1";
  var checking = true;
  var approval=false;
  var alarmIndex=0;
  var polling=true;
  var sequence=1;
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
          .channels[channel].isEnabled!=null){ //if property exists
            if (thresholdData[ios].cards[card]
            .channels[channel].isEnabled!=1){ //if disabled
              $("#isEnabled_ios"+ios+"card"+card+"channel"+channel).prop("checked",thresholdData[ios].cards[card].channels[channel].isEnabled);
            }
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .prop("checked", thresholdData[ios].cards[card].channels[channel].isEnabled);
          }
        }
      }
      approved = approved && thresholdData[ios].approved;
    }
    if (approved){
      $("#approved").prop("checked",true);
    }
    else {
      $("#approved").prop("checked",false);
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
    retrieveSizes(function(){
      $("#statustext").text("Done.");
      if (fill==null){
        fillThresholds(sizes.ioss);
      }
      else if (fill){
        fillThresholds(sizes.ioss);
      }
      else{
        showThresholds(sizes.ioss, true);
      }
    });
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
    $.getJSON(path+datadb+"/_view/recent1"+options,function(result1){
      presentData[0]=result1.rows[0].value;
      $.getJSON(path+datadb+"/_view/recent2"+options,function(result2){ 
        presentData[1]=result2.rows[0].value;
        $.getJSON(path+datadb+"/_view/recent3"+options,function(result3){
          presentData[2]=result3.rows[0].value;
          $.getJSON(path+datadb+"/_view/recent4"+options,function(result4){
            presentData[3]=result4.rows[0].value;
            fillValues(presentData);
            formatAll();
          });
        });
      });
    });
  }


  var formatAll = function(){
    $("#statustext").text("Formatting...");
    $(".realvalue").css({"color":"black"});
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; 
        channel<sizes.ioss[ios].cards[card].channels.length; channel++){
          if (sizes.ioss[ios].cards[card].channels[channel].isEnabled==0){
            $("#present_ios"+ios+"card"+card+"channel"+channel).css({"color":"yellow"});
            if (sizes.ioss[ios].cards[card].channels[channel].type=="xl3"){
              $("#xl3s").css({"background-color":"yellow"});
              $("#crate"+sizes.ioss[ios].cards[card].channels[channel].id+"channelXL3_"+sizes.ioss[ios].cards[card].channels[channel].signal.charAt(0)).css({"background-color":"yellow"});
            }
           if (sizes.ioss[ios].cards[card].channels[channel].type=="rack voltage"){
              $("#rack"+sizes.ioss[ios].cards[card].channels[channel].id)
              .css({"background-color":"yellow"});
              $("#rack"+sizes.ioss[ios].cards[card].channels[channel].id+"channel"+sizes.ioss[ios].cards[card].channels[channel].signal).css({"background-color":"yellow"});
            }
            if (sizes.ioss[ios].cards[card].channels[channel].type=="timing rack"){
              $("#timing").css({"background-color":"yellow"});
              $("#rackTimingchannel"+sizes.ioss[ios].cards[card].channels[channel].signal).css({"background-color":"yellow"});
            }
            if (sizes.ioss[ios].cards[card].channels[channel].type=="crate current"){
              $("#crate"+sizes.ioss[ios].cards[card].channels[channel].id)
              .css({"background-color":"yellow"});
              $("#crate"+sizes.ioss[ios].cards[card].channels[channel].id+"channel"+sizes.ioss[ios].cards[card].channels[channel].signal).css({"background-color":"yellow"});
            }
            if (sizes.ioss[ios].cards[card].channels[channel].type=="Comp Coil"){
              $("#coils").css({"background-color":"yellow"});
              $("#coil"+sizes.ioss[ios].cards[card].channels[channel].id+"channel"+sizes.ioss[ios].cards[card].channels[channel].signal.charAt(0)).css({"background-color":"yellow"});
            }
            if (sizes.ioss[ios].cards[card].channels[channel].type=="HV Panic"){
              $("#otherE-Stop").css({"background-color":"yellow"});
            }
            if (sizes.ioss[ios].cards[card].channels[channel].type=="UPS"){
              $("#otherMine").css({"background-color":"yellow"});
            }
          }
        }
      }
    }
    var cardCount;
    for (var ios=0; ios<alarms.length; ios++){
      cardCount=0;
      if (alarms[ios].cardA){
        for (var channel=0; channel<alarms[ios].cardA.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+alarms[ios].cardA[channel].channel).css({"color":"red"});
        }
        cardCount++;
      }
      if (alarms[ios].cardB){
        for (var channel=0; channel<alarms[ios].cardB.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+alarms[ios].cardB[channel].channel).css({"color":"red"});
        }
        cardCount++;
      }
      if (alarms[ios].cardC){
        for (var channel=0; channel<alarms[ios].cardC.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+alarms[ios].cardC[channel].channel).css({"color":"red"});
        }
        cardCount++;
      }
      if (alarms[ios].cardD){
        for (var channel=0; channel<alarms[ios].cardD.length; channel++){
          $("#present_ios"+ios+"card"+cardCount+"channel"+alarms[ios].cardD[channel].channel).css({"color":"red"});
        }
        cardCount++;
      }
    }
    $("#statustext").text("Done.");
  }

  var poll=function(polling, seq){
    if (polling){
      if (seq){
        $.getJSON(path+"/slowcontrol-alarms/_changes?feed=longpoll&since="+seq,function(result){
          if (result.last_seq==seq){ //last_seq[0] on couch >1.0
            poll(polling,seq);
          } else {
            sequence=result.last_seq;
            setAlarms();
            poll(polling,sequence);
          }
        });
      } else {
        $.getJSON(path+"/slowcontrol-alarms/_changes",function(result){
          sequence=result.last_seq;
          setAlarms();
          poll(polling,sequence);
        });
      }
    }
  }

  var setAlarms=function(){
    $.getJSON(path+alarmdb+"/_view/recent1"+options,function(result1){
      alarms[0]=result1.rows[0].value;
      $.getJSON(path+alarmdb+"/_view/recent2"+options,function(result2){
        alarms[1]=result2.rows[0].value;
        $.getJSON(path+alarmdb+"/_view/recent3"+options,function(result3){
          alarms[2]=result3.rows[0].value;
          $.getJSON(path+alarmdb+"/_view/recent4"+options,function(result4){
            alarms[3]=result4.rows[0].value;
            $(".racks").css({"background-color":"green"});
            $(".crates").css({"background-color":"green"});
            $(".box").css({"background-color":"green"});
            formatAll();
            $("#alarmlist").empty();
            for (var ios=0; ios<sizes.ioss.length; ios++){
              if (alarms[ios].cardA){
                for (channel in alarms[ios].cardA){
                  if (alarms[ios].cardA[channel].type=="xl3"){
                    $("#xl3s").css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardA[channel].id+"channelXL3_"+alarms[ios].cardA[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="rack voltage"){
                    $("#rack"+alarms[ios].cardA[channel].id)
                    .css({"background-color":"red"});
                    $("#rack"+alarms[ios].cardA[channel].id+"channel"+alarms[ios].cardA[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="timing rack"){
                    $("#timing").css({"background-color":"red"});
                    $("#rackTimingchannel"+alarms[ios].cardA[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="crate current"){
                    $("#crate"+alarms[ios].cardA[channel].id)
                    .css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardA[channel].id+"channel"+alarms[ios].cardA[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="Comp Coil"){
                    $("#coils").css({"background-color":"red"});
                    $("#coil"+alarms[ios].cardA[channel].id+"channel"+alarms[ios].cardA[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="HV Panic"){
                    $("#otherE-Stop").css({"background-color":"red"});
                  }
                  if (alarms[ios].cardA[channel].type=="UPS"){
                    $("#otherMine").css({"background-color":"red"});
                  }
                  $("#alarmlist").append('<div id="'+ alarmIndex++ +'">'+
                  alarms[ios].cardA[channel].type + ' ' +
                  alarms[ios].cardA[channel].id + ' ' +
                  alarms[ios].cardA[channel].signal + ' ' +
                  alarms[ios].cardA[channel].voltage + '</div>');
                }
              }
              if (alarms[ios].cardB){
                for (channel in alarms[ios].cardB){
                  if (alarms[ios].cardB[channel].type=="xl3"){
                    $("#xl3s").css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardB[channel].id+"channelXL3_"+alarms[ios].cardB[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="rack voltage"){
                    $("#rack"+alarms[ios].cardB[channel].id)
                    .css({"background-color":"red"});
                    $("#rack"+alarms[ios].cardB[channel].id+"channel"+alarms[ios].cardB[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="timing rack"){
                    $("#timing").css({"background-color":"red"});
                    $("#rackTimingchannel"+alarms[ios].cardB[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="crate current"){
                    $("#crate"+alarms[ios].cardB[channel].id)
                    .css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardB[channel].id+"channel"+alarms[ios].cardB[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="Comp Coil"){
                    $("#coils").css({"background-color":"red"});
                    $("#coil"+alarms[ios].cardB[channel].id+"channel"+alarms[ios].cardB[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="HV Panic"){
                    $("#otherE-Stop").css({"background-color":"red"});
                  }
                  if (alarms[ios].cardB[channel].type=="UPS"){
                    $("#otherMine").css({"background-color":"red"});
                  }
                  $("#alarmlist").append('<div id="'+ alarmIndex++ +'">'+
                  alarms[ios].cardB[channel].type + ' ' +
                  alarms[ios].cardB[channel].id + ' ' +
                  alarms[ios].cardB[channel].signal + ' ' +
                  alarms[ios].cardB[channel].voltage + '</div>');
                }
              }
              if (alarms[ios].cardC){
                for (channel in alarms[ios].cardC){
                  if (alarms[ios].cardC[channel].type=="xl3"){
                    $("#xl3s").css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardC[channel].id+"channelXL3_"+alarms[ios].cardC[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="rack voltage"){
                    $("#rack"+alarms[ios].cardC[channel].id)
                    .css({"background-color":"red"});
                    $("#rack"+alarms[ios].cardC[channel].id+"channel"+alarms[ios].cardC[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="timing rack"){
                    $("#timing").css({"background-color":"red"});
                    $("#rackTimingchannel"+alarms[ios].cardC[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="crate current"){
                    $("#crate"+alarms[ios].cardC[channel].id)
                    .css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardC[channel].id+"channel"+alarms[ios].cardC[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="Comp Coil"){
                    $("#coils").css({"background-color":"red"});
                    $("#coil"+alarms[ios].cardC[channel].id+"channel"+alarms[ios].cardC[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="HV Panic"){
                    $("#otherE-Stop").css({"background-color":"red"});
                  }
                  if (alarms[ios].cardC[channel].type=="UPS"){
                    $("#otherMine").css({"background-color":"red"});
                  }
                  $("#alarmlist").append('<div id="'+ alarmIndex++ +'">'+
                  alarms[ios].cardC[channel].type + ' ' +
                  alarms[ios].cardC[channel].id + ' ' +
                  alarms[ios].cardC[channel].signal + ' ' +
                  alarms[ios].cardC[channel].voltage + '</div>');
                }
              }
              if (alarms[ios].cardD){
                for (channel in alarms[ios].cardD){
                  if (alarms[ios].cardD[channel].type=="xl3"){
                    $("#xl3s").css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardD[channel].id+"channelXL3_"+alarms[ios].cardD[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="rack voltage"){
                    $("#rack"+alarms[ios].cardD[channel].id)
                    .css({"background-color":"red"});
                    $("#rack"+alarms[ios].cardD[channel].id+"channel"+alarms[ios].cardD[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="timing rack"){
                    $("#timing").css({"background-color":"red"});
                    $("#rackTimingchannel"+alarms[ios].cardD[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="crate current"){
                    $("#crate"+alarms[ios].cardD[channel].id)
                    .css({"background-color":"red"});
                    $("#crate"+alarms[ios].cardD[channel].id+"channel"+alarms[ios].cardD[channel].signal).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="Comp Coil"){
                    $("#coils").css({"background-color":"red"});
                    $("#coil"+alarms[ios].cardD[channel].id+"channel"+alarms[ios].cardD[channel].signal.charAt(0)).css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="HV Panic"){
                    $("#otherE-Stop").css({"background-color":"red"});
                  }
                  if (alarms[ios].cardD[channel].type=="UPS"){
                    $("#otherMine").css({"background-color":"red"});
                  }
                  $("#alarmlist").append('<div id="'+ alarmIndex++ +'">'+
                  alarms[ios].cardD[channel].type + ' ' +
                  alarms[ios].cardD[channel].id + ' ' +
                  alarms[ios].cardD[channel].signal + ' ' +
                  alarms[ios].cardD[channel].voltage + '</div>');
                }
              }
            }
          });
        });
      });
    });
  };
  
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
//  $("#format").click(function(){
//    formatAll();
//  });

  $("#saveThresholds").click(function(){
    $("#statustext").text("Saving.");
    $(".present").css({"display":"none"});
    $(".approved").css({"display":"none"});
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; channel<sizes.ioss[ios].cards[card].channels.length; 
        channel++){
          if (sizes.ioss[ios].cards[card].channels[channel].lolo!=null){
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
          if (sizes.ioss[ios].cards[card].channels[channel]
          .isEnabled!=null){
            if ($("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .prop("checked")){
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
      filledThresholdData[ios].approved=$("#approved").prop("checked");
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
            formatAll();
          }
        });
      }
    });
  });

  $("#everything").keydown(function(){
    approval=false;
    $("#approved").prop("checked",false);
  });
  $("#everything").click(function(){
    approval=false;
    $("#approved").prop("checked",false);
  });
  
  var waitCheck = function(amChecking){
    if (amChecking){
      setTimeout(function(){
        retrievePresentValues();
        waitCheck(amChecking);
      },5000);
    }
  } 

  retrieveSizes(retrievePresentValues);
  waitCheck(checking);
  retrievePresentThresholds(true);
  poll(polling);
});
