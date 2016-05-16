'use strict';
angular.module('watchdog')
    .constant("baseURL","http://localhost:4000")
    .factory('appFactory',['$http','baseURL',function($http,baseURL) {
        var appfac={};
        /*var appliances=
             [
                    {
                        "device_id": 1,
                        "device_name": "My iphone",
                        "status": "active",
                        "channel_name": "ch1",
                        "alt": "iphone",
                        "image": "glyph stroked app-window",
                        "checked": false

                    },
                 {
                     "device_id": 2,
                     "device_name": "My iphone",
                     "status": "active",
                     "channel_name": "ch1",
                     "alt": "iphone",
                     "image": "glyph stroked app-window",
                     "checked": false

                 },
                 {
                     "device_id": 3,
                     "device_name": "My iphone",
                     "status": "active",
                     "channel_name": "ch1",
                     "alt": "iphone",
                     "image": "glyph stroked app-window",
                     "checked": false
                 }
                ]
            ;
*/
        var appliance_usage=[
            {
                "device_id": 1,
                "device_name": "My iphone",
                "last_usage" : 6
            },
            {
                "device_id": 2,
                "device_name": "Refrigerator",
                "last_usage" : 23
            },
            {
                "device_id": 3,
                "device_name": "Television",
                "last_usage" : 9
            }
        ];

        appfac.updateAppliance=function(app){
            var userid=sessionStorage.getItem("userid")
            return $http.put(baseURL+"/appliances/"+userid+"/"+app.device_id,app);
        }
        appfac.addAppliance=function(app){
            return $http.post(baseURL+"/appliances/",app);
        }

        appfac.getUsageHistory=function(){
            return appliance_usage;
        };

       /*appfac.getAppliances=function(){
            console.log($http.get(baseURL+"/appliances"))
            return $http.get(baseURL+"/appliances")
        };*/

        appfac.getAppliances=function(){
            console.log($http.get(baseURL+"/appliances/"+sessionStorage.getItem("userid")));
            return $http.get(baseURL+"/appliances/"+sessionStorage.getItem("userid"));
        };


        appfac.deleteAppliance=function(id,userid){
            console.log("service delete: "+id+" for username "+userid);
            $http.delete(baseURL+"/appliances/"+userid+"/"+id);
        }

        appfac.overallUsage = function(device_id, device_type){
            return $http.get(baseURL+"/devices/getOverallUsage/"+device_type+"/"+device_id);
        }

        appfac.dateRangeData = function(device_id, device_type) {
            return $http.get(baseURL+"/devices/getRangeDataUsage/"+device_type+"/"+device_id);
        }

        appfac.weekRangeData = function(device_id, device_type) {
            return $http.get(baseURL+"/devices/weeklyUsage/"+device_type+"/"+device_id);
        }
        return appfac;
    }]);


