var charts=[];
var names=[];
var voltages = {"ioss":[]};

/* Might not need these ultimately */
var detailVoltages = [];
var masterChart = {"ioss":[]};
var detailChart = {"ioss":[]};
var channelparameter = [];
/* End claim */

//var path="http://localhost:5984";
var path="http://172.25.100.70:5984";
var channeldb="/slowcontrol-channeldb/_design/slowcontrol";
var datadb="/slowcontrol-data-5sec/_design/slowcontrol-data-5sec";
var options="?descending=true&limit=1";
var sizes={"ioss":[]};
                                
$(document).ready(function() {

  var retrieveSizes = function(callback){
    $.getJSON(path+channeldb+"/_view/recent1"+options,function(result1){
      sizes.ioss[0]=result1.rows[0].value;
      $.getJSON(path+channeldb+"/_view/recent2"+options,function(result2){
        sizes.ioss[1]=result2.rows[0].value;
        $.getJSON(path+channeldb+"/_view/recent3"+options,function(result3){
          sizes.ioss[2]=result3.rows[0].value;
          $.getJSON(path+channeldb+"/_view/recent4"+options,function(result4){
            sizes.ioss[3]=result4.rows[0].value;
            jsonstr=sizes;
            if(callback){
              callback();
            }
          });
        });
      });
    });
  };

/*   var jsonstr=$.parseJSON($.ajax({type:'GET',url:"http://couch.ug.snopl.us/slow_control/_design/hwinfo/_list/hwmap/mapgen?include_docs=true",dataType:'json',async:false}).responseText);
   for(var i=0;i<channelparameter.length;++i){
      channelparameter[i]="Not connected";
   }
*/
/*  Make titles  */

   //fill in chart titles
/*   for(var i=0;i<jsonstr.rows.length;++i){
      if(jsonstr.rows[i].value[1]=="ios"+GetParam("ios")){
         if(jsonstr.rows[i].value[2]==GetParam("card")){
            if(channelparameter[jsonstr.rows[i].value[3]]=="Not connected"){
               channelparameter[jsonstr.rows[i].value[3]]=jsonstr.rows[i].value[0];
*/
/*  Above just sees what's in what channel -> do in slowloader  */

/*	    }else if (channelparameter[jsonstr.rows[i].value[3]]!="Not connected"){
               channelparameter[jsonstr.rows[i].value[3]]+=" and ";
	       channelparameter[jsonstr.rows[i].value[3]]+=jsonstr.rows[i].value[0];
	    }                                      
            //console.log(channelparameter[jsonstr.rows[i].value[3]]);
         }
      }
   }
*/
/*  So channelparameter is the titles - could be repeat of "name"  */
			        
   // create the master chart
  function createMaster(chartindex,ios_num,card_num,channel_num) {
//    masterChart.ioss[ios_num].cards[card_num].channels[channel_num]= new Highcharts.Chart({
    charts[chartindex].masterChart = new Highcharts.Chart({
      chart: {
        renderTo: "master-container"+chartindex,
        reflow: false,
        borderWidth: 0,
        backgroundColor: null,
        marginLeft: 50,
        marginRight: 20,
        animation: false,
        zoomType: 'x',
        events: {                                                  
          // listen to the selection event on the master chart to update the 
          // extremes of the detail chart
          selection: function(event) {
            var extremesObject = event.xAxis[0],
            min = extremesObject.min,
            max = extremesObject.max,
            xAxis = this.xAxis[0];
            var starttime=Math.floor(min/1000.);
            var endtime=Math.floor(max/1000.);
            detailVoltages[chartindex] = [];
//            var selectedview = selectView(starttime,endtime);
            var str="";
            $.getJSON(path+datadb+"/_view/recent1?startkey="+starttime+"&endkey="+endtime,function(result1){
              str=result1;
// FIXME cardA
              for (var irow=0;irow<str.rows.length;++irow){
                if (str.rows[irow].value.cardA.voltages[channel_num]!="NA"){
                  detailVoltages[chartindex].push([str.rows[irow].key*1000,str.rows[irow].value.cardA.voltages[channel_num]]);
                }
              }

              // move the plot bands to reflect the new detail span
              xAxis.removePlotBand('mask-before');
              xAxis.addPlotBand({
                id: 'mask-before',
                from: Date.UTC(2006, 0, 1),
	        //from: event.xAxis[0].min,
                to: min,
                color: 'rgba(0, 0, 0, 0.2)'
              });
                                                                        
              xAxis.removePlotBand('mask-after');
              xAxis.addPlotBand({
                id: 'mask-after',
                from: max,
                to: event.xAxis[0].max,
                to: Date.UTC(2020, 11, 31),
                color: 'rgba(0, 0, 0, 0.2)'
              });
//              detailChart.ioss[ios_num].cards[card_num].channels[channel_num].series[0].setData(detailVoltages.ioss[ios_num].cards[card_num].channels[channel_num]);
              charts[chartindex].detailChart.series[0].setData(detailVoltages[chartindex]);
              //detailChart[ichart].xAxis.update();
            });
            return false;
          }
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%e%b %H:%M'
        },
        showLastTickLabel: true,
        //maxZoom: 14 * 24 * 3600000, // fourteen days
        //plotBands: [{
        //        id: 'mask-before',
        //        from: Date.UTC(2006, 0, 1),
        //        to: Date.UTC(2008, 7, 1),
        //        color: 'rgba(0, 0, 0, 0.2)'
        //}],
        title: {
          text: null
        }
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          enabled: true
        },
        title: {
          text: null
        },
        //max: 5
        //min: 0.6,
        //showFirstLabel: false
      },
      tooltip: {
        formatter: function() {
          return false;
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          animation: false,
          fillColor: {
            linearGradient: [0, 0, 0, 70],
            stops: [
              [0, '#4572A7'],
              [1, 'rgba(0,0,0,0)']
            ]
          },
          lineWidth: 1,
          marker: {
            enabled: false
          },
          shadow: false,
          states: {
            hover: {
              lineWidth: 1                                            
            }
          },
          enableMouseTracking: false
        }
      },
                                         
      series: [{
        type: 'area',
        name: 'Voltage', 
        //pointInterval: 24 * 3600 * 1000,
        //pointStart: Date.UTC(2006, 0, 01),
        data: voltages.ioss[ios_num].cards[card_num].channels[channel_num]
      }],
                                              
      exporting: {
        enabled: false
      }
    }, 
    function() {
      createDetail(chartindex, ios_num,card_num,channel_num)
    });
  }
                                
  // create the detail chart
  function createDetail(chartindex, ios_num,card_num,channel_num) {
    //console.log(ichart);
    // prepare the detail chart

//    var detailData = [];
//    jQuery.each(masterChart.series[0].data, function(i, point) {
      //if (point.x >= detailStart) {
//      detailData.push([point.x,point.y]);
      //}
//    });

    // create a detail chart referenced by a global variable
//    detailChart.ioss[ios_num].cards[card_num].channels[channel_num]= new Highcharts.Chart({
    charts[chartindex].detailChart = new Highcharts.Chart({
      chart: {
        renderTo: 'detail-container'+chartindex,
        marginBottom: 120,
        animation: false,
        reflow: false,
        marginLeft: 50,
        marginRight: 20,
        style: {
          position: 'absolute'
        },
        zoomType: 'x',
        events: {                                                  
          // listen to the selection event on the detail chart to update the 
          // extremes of the detail chart
          selection: function(event) {
            var extremesObject = event.xAxis[0],
            min = extremesObject.min,
            max = extremesObject.max,
            xAxis = charts[chartindex].masterChart.xAxis[0];
            var starttime=Math.floor(min/1000.);
            var endtime=Math.floor(max/1000.);
            detailVoltages[chartindex] = [];
//            var selectedview = selectView(starttime,endtime);
            var str="";
            $.getJSON(path+datadb+"/_view/recent1?startkey="+starttime+"&endkey="+endtime,function(result1){
              str=result1;

              for (var irow=0;irow<str.rows.length;++irow){
// FIXME cardA
                if (str.rows[irow].value.cardA.voltages[channel_num]!="NA"){
                  detailVoltages[chartindex].push([str.rows[irow].key*1000,str.rows[irow].value.cardA.voltages[channel_num]]);
                }
              }

              // move the plot bands to reflect the new detail span
              xAxis.removePlotBand('mask-before');
              xAxis.addPlotBand({
                id: 'mask-before',
                from: Date.UTC(2006, 0, 1),
	        //from: event.xAxis[0].min,
                to: min,
                color: 'rgba(0, 0, 0, 0.2)'
              });
                                                                        
              xAxis.removePlotBand('mask-after');
              xAxis.addPlotBand({
                id: 'mask-after',
                from: max,
                to: event.xAxis[0].max,
                to: Date.UTC(2020, 11, 31),
                color: 'rgba(0, 0, 0, 0.2)'
              });
              charts[chartindex].detailChart.series[0].setData(detailVoltages[chartindex]);
            });
            return false;
          }
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%e%b %H:%M'
        },
        showLastTickLabel: true,
        //maxZoom: 14 * 24 * 3600000, // fourteen days
      },
      credits: {
        enabled: false
      },
      title: {
        text: charts[chartindex].name 
      },
      subtitle: {
        text: 'Zoom in by dragging across the lower chart. X-axis is Sudbury time.'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: null,
        //maxZoom: 0.1
      },
      tooltip: {
        formatter: function() {
          var point = this.points[0];
          return '<b>'+ point.series.name +'</b><br/>'+Highcharts.dateFormat('%A %B %e %H:%M:%S', this.x) + ':<br/>'+Highcharts.numberFormat(point.y, 3) +' V';
        },
        shared: true
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          animation: false,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 3
              }
            }
          }
        }
      },
      series: [{
        name: 'Voltage',
        // pointStart: detailStart,
        // pointInterval: 15 * 1000,
        data: voltages.ioss[ios_num].cards[card_num].channels[channel_num]
      }],
                                                
      exporting: {
        enabled: true
      }
    });
  }

/*  For now, let's just set the view to be data-5sec  */
/*
   function selectView(starttime,endtime){
      var interval=(endtime-starttime)/1000.; 
      var selectedview=";
   
//      if (interval<=1){

         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card");
*/
/*      }else if (interval>1 && interval <= 15){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"15sec";
      }else if (interval >15 && interval <=30){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"30sec";
      }else if (interval >30 && interval <=60){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"60sec";
      }else if (interval >60 && interval <=900){
         selectedview="getDataIos"+GetParam("ios")+"Card"+GetParam("card")+"900sec";
      }
*/
/*         return selectedview;
   }
*/
/*  Here begins the stuff that runs when the page loads  */

  $("#deleteplot").click(function(){
    detailChart.ioss[0].cards[0].channels.splice(0,1);
    masterChart.ioss[0].cards[0].channels.splice(0,1);
    $("#chart_ios0card0channel0").remove();
  });

  $("#addplot").click(function(){
    chartindex=charts.length;
    selected_num=$("#name_dropdown :selected").val();
    $("#plots").append(
        "<div class='chartcontainer' id='chart" + chartindex + "'>"
      +   "<div class='detailchart' id='detail-container" + chartindex 
      +     "'><\/div>"
      +   "<div class='masterchart' id='master-container" + chartindex
      +     "'><\/div>"
      + "<\/div>"
    );

    charts.push(
      {
        "ios":names[selected_num].ios,
        "card":names[selected_num].card,
        "channel":names[selected_num].channel,
        "name":names[selected_num].name,
        "masterChart":{},
        "detailChart":{}
      }
    );
    createMaster(chartindex, names[selected_num].ios,names[selected_num].card,names[selected_num].channel);
    $("#graphstatus").text("ios: "+names[selected_num].ios+"\ncard: "+names[selected_num].card+"\nchannel: "+names[selected_num].channel + "\nTitle: "+names[selected_num].name);
  });

  retrieveSizes(function(){
/*  Clear voltages in the callback */
    for (var ios_num = 0; ios_num<sizes.ioss.length; ios_num++){
      voltages.ioss[ios_num]={"cards":[]};
      masterChart.ioss[ios_num]={"cards":[]};
      detailChart.ioss[ios_num]={"cards":[]};
      for (var card_num = 0; card_num<sizes.ioss[ios_num].cards.length; card_num++){
        voltages.ioss[ios_num].cards[card_num]={"channels":[]};
        masterChart.ioss[ios_num].cards[card_num]={"channels":[]};
        detailChart.ioss[ios_num].cards[card_num]={"channels":[]};
        for (var channel_num = 0; channel_num<sizes.ioss[ios_num].cards[card_num].channels.length; channel_num++){
          voltages.ioss[ios_num].cards[card_num].channels[channel_num]=[];
          masterChart.ioss[ios_num].cards[card_num].channels[channel_num]=[];
          detailChart.ioss[ios_num].cards[card_num].channels[channel_num]=[];
        }
      }
    }

// Make list of channel names for drop-down

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
          nameindex++;
        }
      }
    }

/*  Get data, put it in str  */

    var str=[];
    $.getJSON(path+datadb+"/_view/recent1?descending=true&limit=1000",function(result1){
      str[0]=result1;
      $.getJSON(path+datadb+"/_view/recent2?descending=true&limit=1000",function(result2){
        str[1]=result2;
        $.getJSON(path+datadb+"/_view/recent3?descending=true&limit=1000",function(result3){
          str[2]=result3;
          $.getJSON(path+datadb+"/_view/recent4?descending=true&limit=1000",function(result4){
            str[3]=result4;
  


// Loops over all the charts!!
//  setTimeout(function(){
    for (var ios_num = 0; ios_num<sizes.ioss.length; ios_num++){
      card_num=0;
      if (str[ios_num].rows[0].value.cardA){
        for (var channel_num = 0; channel_num<sizes.ioss[ios_num].cards[card_num].channels.length; channel_num++){
          for(var irow=0;irow<str[ios_num].rows.length;++irow){
            if (str[ios_num].rows[irow].value.cardA.voltages[channel_num]!="NA"){
              voltages.ioss[ios_num].cards[card_num].channels[channel_num].push([str[ios_num].rows[irow].key*1000,str[ios_num].rows[irow].value.cardA.voltages[channel_num]]);
            }
          }
//        createMaster(ios_num,card_num,channel_num);
//        $("#graphstatus").text("ios"+ios_num+"card"+card_num+"channel"+channel_num);
        }
      }
    }
          });
        });
      });
    });
/*
      var divname = "#chart"+ichart;
      // make the container smaller and add a second container for the master chart
      var $container = $(divname)
         .css('position', 'relative');

      var $detailContainer = $('<div id="detail-container'+ichart+'">')
         .appendTo($container);

      var $masterContainer = $('<div id="master-container'+ichart+'">')
         .css({ position: 'absolute', top: 300, height: 80, width: '100%' })
         .appendTo($container);
*/
/*    
        },10000);
*/
});
      });
//    });

