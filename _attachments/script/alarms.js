$.couch.app(function(app) {
  var alarms=[];
  var sizes={
    "ioss":[]
  };
  var path="http://couch.snopl.us";
  var alarmdb="/slowcontrol-alarms/_design/slowcontrol-alarms";
  var channeldb="/slowcontrol-channeldb/_design/slowcontrol";
  var options="?descending=true&limit=1";
  var alarmIndex=0;
  var polling=true;
  var sequence=1;

  var retrieveSizes = function(callback){
    $.getJSON(path+channeldb+"/_view/recent1"+options,function(result1){
      sizes.ioss[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent2"+options,function(result2){
        sizes.ioss[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent3"+options,function(result3){
          sizes.ioss[2]=result3.rows[0].value;
          $.getJSON(path+channeldb+"/_view/recent4"+options,function(result4){
            sizes.ioss[3]=result4.rows[0].value;
            if(callback){
              callback();
            }
          });
        });
      });
    });
  };


  var poll=function(polling, seq){
    if (polling){
      if (seq){
        $.getJSON(path+"/slowcontrol-alarms/_changes?feed=longpoll&since="+seq,function(result){
          if (result.last_seq[0]){
            sequence=result.last_seq[1];
            setAlarms();
            poll(polling,sequence);
          } else {
            poll(polling,seq);
          }
        });
      } else {
        $.getJSON(path+"/slowcontrol-alarms/_changes",function(result){
          sequence=result.last_seq[1];
          setAlarms();
          poll(polling,sequence);
        });
      }
    }
  }


  $(function(app){
    retrieveSizes();
    setTimeout(function(){
      poll(polling);
    },2000);
  });


  var setAlarms=function(){
//    $("#wheretext").text("setAlarms");
    $.getJSON(path+alarmdb+"/_view/recent1?descending=true&limit=1",function(result1){
      alarms[0]=result1.rows[0].value;
      $.getJSON(path+alarmdb+"/_view/recent2?descending=true&limit=1",function(result2){
        alarms[1]=result2.rows[0].value;
        $.getJSON(path+alarmdb+"/_view/recent3?descending=true&limit=1",function(result3){
          alarms[2]=result3.rows[0].value;
          $.getJSON(path+alarmdb+"/_view/recent4?descending=true&limit=1",function(result4){
            alarms[3]=result4.rows[0].value;
            $(".racks").css({"background-color":"green"});
            $(".crates").css({"background-color":"green"});
            $(".box").css({"background-color":"green"});
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
  }
});
