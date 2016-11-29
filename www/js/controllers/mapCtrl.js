angular.module('starter')

.controller('MapCtrl', function ($scope, $stateParams, $cordovaGeolocation, $ionicLoading, $state, $firebaseArray, User, UserFamily) {

    // wyswietlanie zdjec
    $scope.User = User;

    var familyMembersPromise = UserFamily.get($scope.User.uid);
    familyMembersPromise.then(function (members) {
        $scope.Family = members;
    });

    setInterval(function () {
        $scope.Family = UserFamily.get($scope.User.uid);
    }, 3000);

    //--pobranie koordynatow przy pierwszym logowaniu i ich update   

    ionic.Platform.ready(function () {

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var watchOptions = {
            timeout: 3000,
            maximumAge: 1000
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function (err) {
                $ionicLoading.hide();
                console.log(err);
            },
            function (position) {

                var lat = position.coords.latitude;
                var long = position.coords.longitude;

                var myLatlng = new google.maps.LatLng(lat, long);

                var mapOptions = {
                    center: myLatlng,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: $scope.User.profileImage

                });

                $scope.map = map;
                $ionicLoading.hide();

                //  dodanie danych geolokalizacyjnych do bazy

                $scope.User = User;

                var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);

                userRef.update({

                    location: {
                        lat: lat,
                        long: long
                    }
                });

            });

        $cordovaGeolocation.clearWatch(watch.watchId);

        //--------------- wyswietlanie current location    

        $scope.showLocation = function (familyMemberIndex) {

            //alert($scope.Family[familyMemberIndex].displayName);

            var watchOptions = {
                timeout: 3000,
                maximumAge: 3600000, // pojawił się Alert code:3 message: Timeout expired
                enableHighAccuracy: true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
                null,
                function (err) {
                    $ionicLoading.hide();
                    console.log(err);
                },
                function (position) {

                    var lat = $scope.Family[familyMemberIndex].lat;
                    var long = $scope.Family[familyMemberIndex].long;

                    var myLatlng = new google.maps.LatLng(lat, long);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: $scope.Family[familyMemberIndex].profileImage

                    });

                    $scope.map = map;
                    $ionicLoading.hide();

                });

        };

    });

});