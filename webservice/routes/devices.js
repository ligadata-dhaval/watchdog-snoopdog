

var client_cas = require('../conf/cassandra-conf');
var fc = require('../utility/functions');
var healthData = require('../data/critical-health-data');
var coefficient = require('../data/coefficient');
var cassandra =  require('cassandra-driver');
var async = require('async');
var jsonfile = require('jsonfile');
var mysql = require('../conf/mysql-db');


exports.getOverallUsage = function(req, res) {
    //var payload = req.body;
    //var start_date = payload.start_date;
    //var end_date = payload.end_date
    //var diff = payload.diff;
    var device_type = req.params.deviceType;
    var device_id = req.params.deviceId;

    async.waterfall([
        function(callback){
            var con = mysql.getConnection();
            console.log(device_id);
            con.query("SELECT avg(averagevalues) as avg FROM watchdog.dailystatisticsdata where device_id =?",[device_id],function(err,rows) {
                if(err)
                    console.log("Error Selecting123 : %s ",err );
                else {
                    console.log(rows[0].avg + '******************');
                    callback(null, rows[0].avg, device_type, con);
                }
            });
        },
        function(urdevice, device_type, con){
            con.query("select avg(averagevalues) as avg from dailystatisticsalldevice where device_type =?",[device_type], function(err, result) {
                if(err)
                    console.log("Error Selecting456 : %s ",err );
                else {
                    console.log(result[0].avg + '%%%%%%%%%%%%%%%%');

                    var data = {
                        "columns": [
                            ['Your Device(Average Usage)', urdevice],
                            ['All '+device_type+'(Average Usage)', result[0].avg]
                        ],
                            type: 'pie'
                    }
                    console.log(JSON.stringify(data) + '############');
                    res.send(data);
                    con.end();

                }
            })
        }
    ], function(err, data){
        if(err) console.log(err);
        console.log(data);
    });
}

exports.getDeviceHealth = function(req, res){
    var payload = req.body;
    var start_date = payload.start_date;
    var end_date = payload.end_date
    var diff = payload.diff;
    var device_type = payload.device_type;
    var device_id = payload.device_id;


  async.waterfall([
            function(callback){
                
                //switch(device_type){
                //  //select * from dailystatisticsdata where date >= '2013-04-03' and date <='2013-04-04' ALLOW FILTERING ;
                //  case "tv" : cquery = "select dailyusage from dailystatisticstelevisiondata where date >= '"+start_date+"' and date <='"+end_date+"' ALLOW FILTERING "; break;
                //  case "refrigerator" : cquery = "select dailyaverage from dailystatisticsrefrigeratordata where date >= '"+start_date+"' and date <='"+end_date+"' ALLOW FILTERING "; break;
                //  case "washing_machine" : cquery = "select dailyaverage from dailystatisticswashingmachinedata where date >= '"+start_date+"' and date <='"+end_date+"' ALLOW FILTERING "; break;
                //  case "mobile" : cquery = "select dailyaverage from dailystatisticsmobiledata where date >= '"+start_date+"' and date <='"+end_date+"' ALLOW FILTERING "; break;
                //}

                ////testing purpose
                cquery = "select * from dailystatisticsrefrigeratordata";

                client_cas.execute(cquery, function (err, result) {
                  if(err) {
                    console.log("Error : "+err)
                  }
                  if (typeof result === 'undefined')
                    console.log("No Data1");
                  else {
                    // if (result.rows.length === 0) {
                    //   console.log("No Data2");
                    //   res.send("No Data for this channel3");
                    // }
                    // else {
                      //console.log("********************** RESULT *****************"+result);
                      //var data = healthData.deveiceCriticalHealth();
                      //console.log(result);
                      //callback(null, result/5);
                      callback(null, 225, device_type);
                    //}
                  }
                })
            },

            function(deviceData, device_type, callback) {
                var cquery = "";
                
                //cquery = "select SUM(dailyaverageall) from dailystatisticsrefrigeratoralldevice where date >= '"+start_date+"' and date <='"+end_date+"' ALLOW FILTERING "; break; 
                cquery = "select * from dailystatisticsrefrigeratoralldevice";
                client_cas.execute(cquery, function(err, result) {
                  if(err) {
                    console.log("Error : "+err);
                  }
                  if (typeof result === 'undefined')
                    console.log("No Data3");
                  else {
                      // if (result.rows.length === 0) {
                      //     console.log("No Data4");
                      //     res.send("No Data for this channel4");
                      // }
                      // else {
                          //console.log("********************** RESULT2 *****************" + result);
                          //var data = healthData.deveiceCriticalHealth();
                         // console.log(result);
                          //callback(null, result/5);
                          callback(null, deviceData, device_type, 225);
                      //}
                  }

                })

                
            },

            function(deviceData, device_type, overAllData) {
              var data = healthData.deveiceCriticalHealth();
              var coef = coefficient.deviceCoefficient()[device_type];


                var data = {
                    "data" : {
                        "columns": [
                            ["data1", deviceData],
                            ["data2", overAllData],
                            ["data3", data.refrigerator]
                        ],
                        "type": "bar"
                    },
                    "message" : "Based on the your usage the patters and the coefficient, the shelf life of your device is "+(coef/deviceData)
                };

                console.log(data);
                res.send(data);
            }
        ], function(err, data){
                if(err) console.log(err);
                console.log(data);
            }
        )

}


exports.getDeviceData = function(req, res) {
  console.log("************************channel******************"+req.params.channel);

  var cquery = "";
  //var cquery = "select * from dailystatisticsdata where date >= '"+req.params.start_date+"' and date <='"+req.params.end_date+"' ALLOW FILTERING";

  cquery = "select * from refrigerator where channel='"+req.params.channel+"'";

  console.log("*****************************cquery********************************"+cquery);
  client_cas.execute(cquery, function (err, result) {
    if (typeof result === 'undefined')
      console.log("No Data");
    else {
      if (result.rows.length === 0) {
        console.log("No Data");
        res.send("No Data for this channel");
      }
      else {
        console.log("********************** RESULT*****************"+result);

        var data = healthData.deveiceCriticalHealth();
        console.log(data);


        res.send(result);
        // AlljsonServices='[';

        // for (var i = 0; i < result.rows.length; i++) {

        //   service = result.rows[i];

        //   jsonService = '{ '
        //   + '"service_id" : "'+ service.service_id + '", '
        //   + '"title" : "'+ service.title + '", '
        //   + '"description" : "'+ service.description + '", '
        //   + '"date_creation" : "'+ service.date_creation + '", '
        //   + '"duration" : "'+ service.duration + '", '
        //   + '"type" : "'+ service.type + '", '
        //   + '"usage_date" : "'+ service.usage_date + '", '
        //   + '"username" : "'+ service.username + '"},';

        //   AlljsonServices=AlljsonServices+jsonService;
        // }

        // AlljsonServices=AlljsonServices.slice(0, - 1)+']';

        // return reply(AlljsonServices);
      }
    }

  });
}


exports.addDeviceData = function(req, res) {
    var payload = req.body;
    var device_id = payload.device_id;
    var device_type = payload.device_type;
    var channel = payload.channel;
    var date = payload.date;
    var time = '2013-04-03 07:01:00';
    var value = payload.value;
    var cquery = "";
    //console.log("********TS******"+new Date());
    console.log("*****************************payload********************************"+payload);
    console.log("##############device_type###########"+device_type);
    switch(device_type){
      case "tv" : cquery = "insert into tv (device_id,device_type,channel,date,time,usage) values (?,?,?,?,?,?)"; break;
      case "refrigerator" : cquery = "insert into refrigerator (device_id,device_type,channel,date,time,temperature) values (?,?,?,?,?,?)"; break;
      case "washing_machine" : cquery = "insert into washing_machine (device_id,device_type,channel,date,time,usage) values (?,?,?,?,?,?)"; break;
      case "mobile" : cquery = "insert into mobile (device_id,device_type,channel,date,time,cpu_utilization) values (?,?,?,?,?,?)"; break;
    }

    console.log("*****************************cquery********************************"+cquery);

    //cquery = "insert into services (service_id,title,description, date_creation, duration,type) values (?,?,?,?,?,?)";

    client_cas.execute(cquery,[device_id, device_type, channel, date, new Date(), value], function (result) {
      console.log(result);
      res.send("Device data received");

    });

       // fc.afterExecution('Error: ', 'Service ' + device_id + ' created with id '+device_id, res)
    //);
}