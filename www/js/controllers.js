angular.module('starter.controllers', [])

.factory('User', function () {
    return {
        uid: '',
        displayName: '',
        profileImage: ''
    };
})

/*.factory('UserFamily', function () {

    return {
        get: function (userId) {

            var familyTel = new Firebase("https://geofamily.firebaseio.com/users/" + userId);
            var famtel = ['tel1', 'tel2', 'tel3'];

            var FamilyMembers = [];


            for (var telKey in famtel) {

                var telVal = famtel[telKey];

                familyTel.child("family/" + telVal).on("value", function (snapshot) {
                    var tel = snapshot.val();

                    var ref = new Firebase("https://geofamily.firebaseio.com/users");
                    var query = ref.orderByChild("tel").equalTo(tel);

                    query.on("child_added", function (telsnapshot) {

                        var displayName = telsnapshot.val().displayName;
                        var profileImage = telsnapshot.val().profileImage;
                        var long = telsnapshot.val().location.long;
                        var lat = telsnapshot.val().location.lat;

                        FamilyMembers.push({
                            displayName, profileImage, long, lat
                        });


                    });

                });
            }

            return FamilyMembers;
        }
    }
})*/

.factory('UserFamily', function ($q) {

    return {
//funkcja get tworzy deferer i zwraca promise        
        get: function (userId) {

//odroczenie dla obiektu def dopóki nie będzie resolve
            var def = $q.defer();

            var FamilyMembers = [];
            var ref = new Firebase("https://geofamily.firebaseio.com/users/" + userId + "/familyNick");
                
//funkcja asynchroniczna            
            ref.on("value", function (snapshot) {
                var familyNick = snapshot.val();

                var refAll = new Firebase("https://geofamily.firebaseio.com/users");
                var query = refAll.orderByChild("familyNick").equalTo(family);

                query.on("child_added", function (membersSnapshot) {

                    var displayName = membersSnapshot.val().displayName;
                    var profileImage = membersSnapshot.val().profileImage;
                    var long = membersSnapshot.val().location.long;
                    var lat = membersSnapshot.val().location.lat;

                    FamilyMembers.push({
                        displayName, profileImage, long, lat
                    });

                    def.resolve(FamilyMembers);

                });
            });
//zwracanie obietnicy odpowiedzi
            return def.promise;

        }
    }
})


.factory('Shoppings', function () {
    return {
        item: '',
        addedBy: ''
    };
})

.controller('AppCtrl', function ($scope, $ionicModal) {

    //-------------dane testowe

    /*    var usersRef = new Firebase("https://geofamily.firebaseio.com/users");
                        var userRef = usersRef.child("999999999");
                        userRef.set({
                            uid: "999999999",
                            displayName: "Penelope Cruz",
                            profileImage: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ9Twhvr8bt8ncC9dxRHHGJV7EldXHo4rrCw20dhDhyXSi2j-WueUqC2MI",
                            email: null,
                            tel: 999999999,
                            family: null,
                            location: {
                                lat:1,
                                long: 2
                            }
                        });*/
})

.controller('AuthCtrl', function ($scope, Auth, $state, User) {

    $scope.login = function () {

        Auth.$authWithOAuthPopup("facebook").then(function (authData) {

            console.log(authData);

            var fbUser = authData.facebook;

            $scope.User = User;
            $scope.User.uid = fbUser.id;
            $scope.User.displayName = fbUser.displayName;
            $scope.User.profileImage = fbUser.profileImageURL;

            var usersRef = new Firebase("https://geofamily.firebaseio.com/users");

            //sprawdzamy czy uid istnieje

            usersRef.once('value', function (snapshot) {

                if (snapshot.hasChild(fbUser.id)) {

                    $state.go('app.map');

                } else {
                    var userRef = usersRef.child(fbUser.id);
                    userRef.set({
                        uid: fbUser.id,
                        displayName: fbUser.displayName,
                        profileImage: fbUser.profileImageURL,
                        email: null,
                        tel: null,
                        familyNick: null,
                        family: null,
                        location: null
                    });

                    $state.go('app.profile');
                }
            });


        }).catch(function (error) {
            console.log(error);
        });

    }

    $scope.logout = function () {
        Auth.$unauth();
    }


})

.controller('ProfileCtrl', function ($scope, $stateParams, $firebaseArray, $state, User) {

    $scope.User = User;
    var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);
    userRef.once('value', function (snapshot) {
        $scope.User.email = snapshot.val().email;
        $scope.User.tel = snapshot.val().tel;
        $scope.User.familyNick = snapshot.val().familyNick;


    });

    $scope.saveProfile = function () {

        var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);

        userRef.update({
            email: $scope.User.email,
            tel: $scope.User.tel,
            familyNick: $scope.User.familyNick
        });

        $state.go('app.map');

    }


})

/*.controller('AddCtrl', function ($scope, $stateParams, $firebaseArray, $state, User) {

    $scope.User = User;

    $scope.addTel = function () {

        var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);

        userRef.update({

            family: {
                tel1: this.tel1,
                tel2: this.tel2,
                tel3: this.tel3
            }

        });


        $state.go('app.map');

    }

})*/

.controller('FamilyCtrl', function ($scope, $stateParams, $firebaseArray, $state, User, UserFamily) {

    $scope.User = User;

    $scope.Family = UserFamily.get($scope.User.uid);

})

.controller('TodoCtrl', function ($scope, $stateParams, $firebaseArray, $state, User) {



    $state.go('app.todo');



})

.controller('ShoppingCtrl', function ($scope, $stateParams, $firebaseArray, $state, Shoppings, $ionicModal) {

    $scope.tasks = [
        {
            title: 'Collect coins'
        },
        {
            title: 'Eat mushrooms'
        },
        {
            title: 'Get high enough to grab the flag'
        },
        {
            title: 'Find the Princess'
        }
  ];

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('/templates/new-task.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Called when the form is submitted
    $scope.createTask = function (task) {
        $scope.tasks.push({
            title: task.title
        });
        $scope.taskModal.hide();
        task.title = "";
    };

    // Open our new task modal
    $scope.newTask = function () {
        $scope.taskModal.show();
    };

    // Close the new task modal
    $scope.closeNewTask = function () {
        $scope.taskModal.hide();

    };

    $scope.deleteTask = function (index) {
        $scope.tasks.splice(index, 1);

    };



    $scope.addShoppingItem = function () {

        $scope.Shoppings = Shoppings;
        var shoppingItem = new Firebase("https://geofamily.firebaseio.com/shoppingList/" + $scope.Shoppings);

        shoppingItem.once('value', function (snapshot) {
            $scope.Shoppings.item = snapshot.val().item;
            $scope.Shoppings.addedBy = snapshot.val().addedBy;
        });

        $state.go('app.shopping');

    }



})



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