$.couch.app(function(app) {
  var charts=[];
  var names=[];
  var hardToReadData=[];
  var easyToReadData=[];
  var detailVoltages = [];
  var channelparameter = [];

  var path="";
  var channeldb="/slowcontrol-channeldb/_design/slowcontrol/_view/recent";
  var datadb="/slowcontrol-data-5sec/_design/slowcontrol-data-5sec";
  var onemindb="/slowcontrol-data-1min/_design/slowcontrol-data-1min";
  var fifteenmindb="/slowcontrol-data-15min/_design/slowcontrol-data-15min";  
  var options="?descending=true&limit=1";
  var recents=["/_view/recent1","/_view/recent2","/_view/recent3","/_view/recent4"];
  var sizes={"ioss":[]};

  var retrieveSizes = function(callback){
    $.getJSON(path+channeldb+options,function(result){
      sizes=result.rows[0].value;
      if(callback){
        callback();
      }
    });
  };


  var getData = function(){
    $("#graphstatus").text("Loading Data...Please wait.");
    var views=[];
    var iosresults=[];
    var deltavresult;
    for (var i=0; i<recents.length; i++){
      views.push(
        $.getJSON(path+datadb+recents[i]+options+"000",function(result){
          //collects the results but in whatever order they arrive
          iosresults.push(result.rows);
        })
      );
    }
    views.push(
      $.getJSON(path+onemindb+"/_view/pi_db"+options+"000",function(result){
        deltavresult=result.rows;
      })
    );
    //pulls all views simultaneously
    hardToReadData={
      "ioss":[],
      "deltav":[]
    };
    $.when.apply($, views)
    .then(function(){
      for (var i=0; i<sizes.ioss.length-1; i++){
        //arranges the results
        resultpos=$.grep(iosresults, function(e,f){return e[0].value.ios == i+1;});
        hardToReadData.ioss[i]=resultpos[0];
      }
      hardToReadData.deltav=deltavresult;
      makeDataEasyToRead(hardToReadData);
      $("#graphstatus").text("Ready to make plots!");
      $("#addplot").removeAttr("disabled");
      return true;
    });
  };


  var makeDataEasyToRead = function(hardToReadData){
    var arrangedData={"ioss":[],"deltav":[]};
    var cardName="";
    for (var ios=0; ios<sizes.ioss.length-1; ios++){
      arrangedData.ioss[ios]={"cards":[],"ios":sizes.ioss[ios].ios};
      for (var card=0; card<sizes.ioss[ios].cards.length; card++){
        cardName=sizes.ioss[ios].cards[card].card
        arrangedData.ioss[ios].cards[card]={
          "channels":[],
          "card":cardName
        };
        for (channel=0; channel<hardToReadData.ioss[ios][0].value[cardName].voltages.length; channel++){
          arrangedData.ioss[ios].cards[card].channels[channel]={
            "data":[]
          };
        }
        for (var row=0; row<hardToReadData.ioss[ios].length; row++){
          for (channel=0; channel<arrangedData.ioss[ios].cards[card].channels.length; channel++){
            arrangedData.ioss[ios].cards[card].channels[channel].data[row]=[hardToReadData.ioss[ios][row].key*1000,hardToReadData.ioss[ios][row].value[cardName].voltages[channel]];
          }
        }
      }
    }
    for (var channel=0; channel<sizes.deltav.length; channel++){
      arrangedData.deltav[channel]={"data":[]};
      cleanedtype=sizes.deltav[channel].type;
      deltavid=sizes.deltav[channel].id-1;
      if (hardToReadData.deltav[0].value[cleanedtype].values[deltavid]){
        for (var row=0; row<hardToReadData.deltav.length; row++){
          if (hardToReadData.deltav[row].value[cleanedtype].values[deltavid]!="N/A"){
	      arrangedData.deltav[channel].data.push([hardToReadData.deltav[row].key*1000,hardToReadData.deltav[row].value[cleanedtype].values[deltavid]]);
          }
        }
      }
    }
    easyToReadData=arrangedData;
  };

   // create the master chart
  function createMaster(chartindex) {
      Highcharts.setOptions({
          global: {
	      useUTC : false //puts timestamp axis in local time
          }
      });
      $('#master-container'+chartindex).highcharts('StockChart', {	
	  chart : {
              events : {
                  load : function () {
		      if (charts[chartindex].ios) {
			  var cardlist = ["cardA", "cardB","cardC", "cardD"];
			  var ios = charts[chartindex].ios;
			  var card = cardlist[charts[chartindex].card];
			  var channel = charts[chartindex].channel;
			  var series = this.series[0];
			  var iosresults=[];
			  setInterval(function() {
			      //var data = charts[chartindex].data;
			      //var last_time = data[data.length-1][0]+1
			      //alert(JSON.stringify(data[data.length-1][0]))
			      var getting = $.getJSON(path+datadb+recents[charts[chartindex].ios]+options,function(result){
				  iosresults = result.rows[0].value;
			      });
			      getting.done(function() {
				  var timestamp = iosresults.timestamp;
				  var value = iosresults[card]["voltages"][channel];
				  series.addPoint([timestamp*1000, value], true, true);
			      });
			  }, 5000);
		      } else {
			  var type = charts[chartindex].type
			  var channel = charts[chartindex].channel;
			  var series = this.series[0];
			  var deltavresults=[];
			  setInterval(function() {
			      var getting = $.getJSON(path+onemindb+"/_view/pi_db"+options,function(result){
				  deltavresults = result.rows[0].value;
			      });
			      getting.done(function() {
				  var timestamp = deltavresults.timestamp;
				  var value = deltavresults[type]["values"][channel];
				  if (value!=null) {
				      series.addPoint([timestamp*1000, value], true, true);
				  };
			      });
			  }, 5000);
                      }
		  }
              }
          },
	  rangeSelector: {
            buttons: [{
                count: 5,
                type: 'minute',
                text: '5m'
            }, {
                count: 30,
                type: 'minute',
                text: '30m'
	    }, {
                count: 1,
                type: 'hour',
                text: '1hr'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false, //prevents date range input 
            selected: 1 //selects which button should be automatically pressed when the chart loads
        },

        title : {
            text : charts[chartindex].name 
        },

        exporting: {
            enabled: true
        },

        series : [{
            name : 'Voltage',
	    data : charts[chartindex].data
        }]
    });
  };
							 


/*  For now, let's just set the view to be data-5sec  

   function selectView(starttime,endtime){
      var interval=(endtime-starttime)/1000.; 
      var selectedview=";
   
//      if (interval<=1){

         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card");

      }else if (interval>1 && interval <= 15){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"15sec";
      }else if (interval >15 && interval <=30){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"30sec";
      }else if (interval >30 && interval <=60){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"60sec";
      }else if (interval >60 && interval <=900){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"900sec";
      }

         return selectedview;
 }
*/
/*  Here begins the stuff that runs when the page loads  */

    $("#deleteplot").click(function(){
	var selected=$("#name_dropdown :selected").val();
	$("."+selected+"chart").css({"display":"none"});
//	$("#graphstatus").text(JSON.stringify(easyToReadData));
  });

  $("#addplot").click(function(){
      var chartindex=charts.length;
      var selected=$("#name_dropdown :selected").val();
      $("#plots").append(
	  "<div class='chartcontainer "+selected+"chart' id='chart" + chartindex + "'>"
              + "<div class='masterchart' id='master-container"+chartindex+"'></div>"
	      + "<\/div>"
      );
      if (names[selected].ios!=null) {
	  charts[chartindex]={
              "ios":names[selected].ios,
              "card":names[selected].card,
              "channel":names[selected].channel,
              "name":names[selected].name,
              "data":easyToReadData.ioss[names[selected].ios].cards[names[selected].card].channels[names[selected].channel].data.reverse()
	  };
	  createMaster(chartindex);
      } else {
	  charts[chartindex]={
              "name": names[selected].name,
              "type": names[selected].type,
              "id": names[selected].id,
              "signal": names[selected].signal,
              "channel": names[selected].channel,
              "data": easyToReadData.deltav[names[selected].channel].data.reverse()
	  };
	  createMaster(chartindex);
      }
  });

  retrieveSizes(function(){
    $("#addplot").attr("disabled","disabled");
//  Clear voltages and make names in the callback 
    var nameindex=0;
    for (var ios = 0; ios<sizes.ioss.length-1; ios++){
//      voltages.ioss.push({"cards":[]});
      for (var card = 0; card<sizes.ioss[ios].cards.length; card++){
//        voltages.ioss[ios].cards.push({"channels":[]});
        for (var channel = 0; channel<sizes.ioss[ios].cards[card].channels.length; channel++){
//          voltages.ioss[ios].cards[card].channels.push({});
          nameText="";
          if(sizes.ioss[ios].cards[card].channels[channel].type){
            nameText += " "+sizes.ioss[ios].cards[card].channels[channel].type;
          }
          if(sizes.ioss[ios].cards[card].channels[channel].id){
            nameText += sizes.ioss[ios].cards[card].channels[channel].id;
          }
          if(sizes.ioss[ios].cards[card].channels[channel].signal){
            nameText += " "+sizes.ioss[ios].cards[card].channels[channel].signal;
          }
          if(sizes.ioss[ios].cards[card].channels[channel].unit){
            nameText += " ("+sizes.ioss[ios].cards[card].channels[channel].unit+")";
          }
          names[nameindex]={
            "name": nameText,
            "ios": ios,
            "card": card,
            "channel": channel
          };
          nameindex++;
        }
      }
    }
    for (var channel = 0; channel<sizes.deltav.length; channel++){
      names[nameindex] = {
        "name": ""+sizes.deltav[channel].type+" "+sizes.deltav[channel].id+" "+sizes.deltav[channel].signal+ " ("+sizes.deltav[channel].unit+")",
        "type": sizes.deltav[channel].type,
        "id": sizes.deltav[channel].id,
        "signal": sizes.deltav[channel].signal, 
        "channel": channel
      };
      nameindex++;
    }

    getData();
      
  });
});

