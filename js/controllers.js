'use strict';
angular.module('watchdog')
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
            }
        );


        $scope.add=function(appliance){
           var app=angular.copy(appliance);
            if(app.device_type=="mobile"){
                app.image="images/mobile.png"
                app.timeline="mobiletimeline.html"
            }else if(app.device_type=="tv"){
                app.image="images/tv.png"
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
        console.log($scope.appliance)
    }])

;