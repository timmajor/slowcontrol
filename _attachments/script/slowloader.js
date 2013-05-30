$.couch.app(function(app) {
  var thresholdData=[];
  var path="http://172.25.100.70:5984";
//  var path="http://localhost:5984";
  var channeldb="/slowcontrol-channeldb/_design/slowcontrol";
  var options="?descending=true&limit=1";
  var channelNames;
  var sizes={
    "ioss":[]
  };
  var fields=[];
/*
  var getfields = function(){
    for (var ios_num = 0; ios_num<sizes.ioss.length; ios_num++){
      for (var card_num = 0; card_num<sizes.ioss[ios_num].cards.length; card_num++){
        for (var channel_num = 0; channel_num<sizes.ioss[ios_num].cards[card_num].channels.length; channel_num++){
          if (fields.indexOf(sizes.ioss[ios_num].cards[card_num].channels[channel_num].type)<0){
            fields.push(sizes.ioss[ios_num].cards[card_num].channels[channel_num].type);
            $("#test").text(JSON.stringify(fields));  
          }
        }
      }
    }
  };
*/
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

  var makehtml = function(){
    var channelid="";
    for (var ios_num = 0; ios_num<sizes.ioss.length; ios_num++){
      for (var card_num = 0; card_num<sizes.ioss[ios_num].cards.length; card_num++){
        for (var channel_num = 0; channel_num<sizes.ioss[ios_num].cards[card_num].channels.length; channel_num++){
          channelid = "_ios"+ios_num+"card"+card_num+"channel"+channel_num;
          $("#everything").append("<div class='channel' id='all"
            + channelid + "'>");

          $("#all"+channelid)
            .append(
              "<div class='widecolumn'>"
            +   "<div class='wide'>" 
            +     "<div class='wide set' id='name"
            +       channelid + "'><\/div>"
            +     "<div class='wide present'>Present Thresholds<\/div>"
            +     "<div class='wide approved'>Approved Thresholds<\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<input class='narrow set' id='lolo"
            +       channelid + "' data-role='none' \/>"
            +     "<div class='narrow present' id='lolo_present"
            +       channelid + "'><\/div>"
            +     "<div class='narrow approved' id='lolo_approved"
            +       channelid + "'><\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<input class='narrow set' id='lo"
            +       channelid + "' data-role='none' \/>"
            +     "<div class='narrow present' id='lo_present"
            +       channelid + "'><\/div>"
            +     "<div class='narrow approved' id='lo_approved"
            +       channelid + "'><\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<div class='narrow set realvalue' id='present"
            +       channelid + "'><\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<input class='narrow set' id='hi"
            +       channelid + "' data-role='none' \/>"
            +     "<div class='narrow present' id='hi_present"
            +       channelid + "'><\/div>"
            +     "<div class='narrow approved' id='hi_approved"
            +       channelid + "'><\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<input class='narrow set' id='hihi"
            +       channelid + "' data-role='none' \/>"
            +     "<div class='narrow present' id='hihi_present"
            +       channelid + "'><\/div>"
            +     "<div class='narrow approved' id='hihi_approved"
            +       channelid + "'><\/div>"
            +   "<\/div>"
            + "<\/div>"
            + "<div class='narrowcolumn'>"
            +   "<div class='narrow'>"
            +     "<input type='checkbox' id='isEnabled"
            +       channelid + "' data-role='none' \/>"
            +   "<\/div>"
            + "<\/div>"
          );
/* This stuff makes way too many charts.
          $("#plots").append(
              "<div class='chartcontainer' id='chart" + channelid + "'>"
            +   "<div class='detailchart' id='detail-container" + channelid 
            +     "'><\/div>"
            +   "<div class='masterchart' id='master-container" + channelid 
            +     "'><\/div>"
            + "<\/div>"
          );
*/
        }
      }
    }
  };

  names=[];

  var fillNames = function(){
    var nameindex=0;
    for (var ios_num = 0; ios_num<sizes.ioss.length; ios_num++){
      for (var card_num = 0; card_num<sizes.ioss[ios_num].cards.length; card_num++){
        for (var channel_num = 0; channel_num<sizes.ioss[ios_num].cards[card_num].channels.length; channel_num++){
          names[nameindex]={
            "name": ""+sizes.ioss[ios_num].cards[card_num].channels[channel_num].id
              + " " + sizes.ioss[ios_num].cards[card_num].channels[channel_num].signal
              + " " + sizes.ioss[ios_num].cards[card_num].channels[channel_num].type,
            "ios": ios_num,
            "card": card_num,
            "channel": channel_num
          };
          $("#name_dropdown").append("<option data-role='none' value="+nameindex +">" + names[nameindex].name + "<\/option>");
          nameindex++;
        }
      }
    }
    for (var ios=0; ios<sizes.ioss.length; ios++){
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        for (var channel=0; channel<sizes.ioss[ios].cards[card].channels.length; channel++){
          $("#name_ios"+ios+"card"+card+"channel"+channel).text("" +
            sizes.ioss[ios].cards[card].channels[channel].id + " " +
            sizes.ioss[ios].cards[card].channels[channel].signal + " " +
            sizes.ioss[ios].cards[card].channels[channel].type);
          if (sizes.ioss[ios].cards[card].channels[channel].lolo!=null){
            $("#lolo_ios"+ios+"card"+card+"channel"+channel).val(
            sizes.ioss[ios].cards[card].channels[channel].lolo);
            $("#lo_ios"+ios+"card"+card+"channel"+channel).val(
            sizes.ioss[ios].cards[card].channels[channel].lo);
            $("#hi_ios"+ios+"card"+card+"channel"+channel).val(
            sizes.ioss[ios].cards[card].channels[channel].hi);
            $("#hihi_ios"+ios+"card"+card+"channel"+channel).val(
            sizes.ioss[ios].cards[card].channels[channel].hihi);
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
          if (sizes.ioss[ios].cards[card]
          .channels[channel].isEnabled!=null){ //if proprety exists
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .prop("checked", sizes.ioss[ios].cards[card]
            .channels[channel].isEnabled);
          }
          else {
            $("#isEnabled_ios"+ios+"card"+card+"channel"+channel)
            .attr("disabled", true);
          }
          if (sizes.ioss[ios].cards[card].channels[channel].type=="spare"){
            $("#all_ios"+ios+"card"+card+"channel"+channel).css({"display":"none"});
          }
          if (sizes.ioss[ios].cards[card].channels[channel].signal=="reset"){
            $("#all_ios"+ios+"card"+card+"channel"+channel).css({"display":"none"});
          }
          if (sizes.ioss[ios].cards[card].channels[channel].signal=="disable"){
            $("#all_ios"+ios+"card"+card+"channel"+channel).css({"display":"none"});
          }
          if (sizes.ioss[ios].cards[card].channels[channel].signal=="enable"){
            $("#all_ios"+ios+"card"+card+"channel"+channel).css({"display":"none"});
          }
 
        }
      }
    }
  };

  retrieveSizes(function(){
    makehtml();
    fillNames();
  });
});
