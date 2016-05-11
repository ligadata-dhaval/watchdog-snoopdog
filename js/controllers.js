'use strict';
angular.module('watchdog',[])
    .
    controller('DeviceController',['$scope','appFactory' , function($scope,appFactory) {

        $scope.appliances= [];

        $scope.storeAppId=function(channel_id){
            console.log("channel id is: "+channel_id)
            sessionStorage.setItem("channel_id",channel_id)
        }

        $scope.findByUserId=appFactory.getAppliances()
                .then(
                function(response) {
                    console.log("Retrieving appliances");
                    $scope.appliances = response.data;
                }
        );

        appFactory.getAppliances()
            .then(
            function(response) {
                console.log("Retrieving appliances");
                $scope.appliances = response.data;
                //new data

                for(var i =0;i<response.data.length;i++){

                    if(response.data[i].device_type=="mobile"){
                        console.log(""+response.data[i].device_type);

                    }
                }
            }
        );

        $scope.add=function(appliance){
           var app=angular.copy(appliance);
            if(app.device_type=="mobile"){
                app.image="images/mobile.jpg"
                app.timeline="mobiletimeline.html"
            }else if(app.device_type=="tv"){
                app.image="images/tv.jpg"
                app.timeline="appliancetimeline.html"
            }
            app.checked=false;
            app.userid=sessionStorage.getItem("userid");

            console.log("Adding appliance!"+JSON.stringify(app));
            appFactory.addAppliance(app);
            location.reload();
        }

        // remove an appliance
        $scope.remove = function() {
            console.log("Remove function called");
            $scope.appliances.forEach(function(appliance) {

                if(appliance.checked){
                    console.log("Removing "+appliance.device_id)
                    appFactory.deleteAppliance(appliance.device_id,appliance.userid)
                }

            });
        };

        $scope.isActive=function(status){
            if(status==="active")
                return true;
            else
                return false;
        }

        $scope.deactivate=function(appliance){
            appliance.status="inactive"
            appFactory.updateAppliance(appliance);

        }
        $scope.activate=function(appliance){
            appliance.status="active"
            appFactory.updateAppliance(appliance);
        }

    }])
    .
    controller('HomePageController',['$scope','appFactory' , function($scope,appFactory) {
        $scope.applianceHistory= appFactory.getUsageHistory();
        console.log($scope.appliance)
    }])
    .
    controller('HealthController',['$scope' , function($scope) {
        console.log("Health prediction");
        $scope.prediction=function(){
            console.log("Health prediction");
            window.location="Prediction.html";
        }
    }])
    .
    controller('DashboardController',['$scope','appFactory' , function($scope,appFactory) {
        $scope.appliances= appFactory.getAppliances();
        console.log("Hi bro"+$scope.appliance)

    }])
    .
    controller('AnalyticsController',['$scope','appFactory' , function($scope,appFactory) {

        $scope.overallUsage = null;
        $scope.chart = null;

        $scope.showGraph = function(device_id,device_type) {
            appFactory.overallUsage(device_id,device_type)
                .then(
                function(response) {
                    console.log("Retrieving appliance usage");
                    $scope.overallUsage = response.data;
                    console.log("Appliance Usage"+JSON.stringify($scope.overallUsage));

                    c3.generate({
                        bindto:'#chart',
                        data: {
                            columns: [
                                ['Your Device(Average Usage)', $scope.overallUsage.columns[0][1]]
                            ],
                            type: 'gauge'
                        },
                        pie: {
                            label: {
                                format: function (value, ratio, id) {
                                    return d3.format('$')(value);
                                }
                            }
                        }
                    });


                    c3.generate({
                        bindto:'#chart1',
                        data: {
                            columns: [
                                ['All '+device_type+' (Average Usage)', $scope.overallUsage.columns[1][1]]
                            ],
                            type: 'gauge',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        gauge: {
                            label: {
                                format: function (value, ratio, id) {
                                    return d3.format('$')(value);
                                }
                            }
                        }
                        //gauge: {
                        //
                        //},
                        //color: {
                        //    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                        //    threshold: {
                        //        values: [30, 60, 90, 100]
                        //    }
                        //},
                        //size: {
                        //    height: 180
                        //}
                    });

                    c3.generate({
                        bindto:'#chart2',
                        data: {
                            columns: [
                                ['Your Device(Average Usage)', $scope.overallUsage.columns[0][1]],
                                ['All '+device_type+' (Average Usage)', $scope.overallUsage.columns[1][1]]
                            ],
                            type: 'bar',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        bar: {
                            label: {
                                format: function (value, ratio, id) {
                                    return d3.format('$')(value);
                                }
                            }
                        }

                    });


                    c3.generate({
                        bindto:'#chart3',
                        data: {
                            columns: [
                                ['Your Device', $scope.overallUsage.columns[0][1]],
                                ['All '+device_type, $scope.overallUsage.columns[1][1]]
                            ],
                            type: 'bar',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        bar: {
                            label: {
                                format: function (value, ratio, id) {
                                    return d3.format('$')(value);
                                }
                            }
                        }

                    });


                    c3.generate({
                        bindto:'#chart4',
                        data: {
                            columns: [
                                ['Your Device', $scope.overallUsage.columns[0][1]],
                                ['All '+device_type, $scope.overallUsage.columns[1][1]]
                            ],
                            type: 'bar',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        bar: {
                            label: {
                                format: function (value, ratio, id) {
                                    return d3.format('$')(value);
                                }
                            }
                        }

                    });





                }
            );
        }




        //$scope.overallUsage = appFactory.overallUsage();

        //console.log("In AController");

        //$scope.showGraph = function() {
        //    console.log("In AController122");
        //    $scope.chart = c3.generate({
        //        bindto: '#chart',
        //        data: {
        //            columns: [
        //                ['data1', 30, 200, 100, 400, 150, 250],
        //                ['data2', 50, 20, 10, 40, 15, 25]
        //            ]
        //        }
        //    });
        //}


    }])

;