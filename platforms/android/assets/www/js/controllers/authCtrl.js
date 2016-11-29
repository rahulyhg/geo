angular.module('starter')

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

                    // pobieranie wszystkich innych danych wprowadzonych przez uzytkownika
                    
                    $scope.User = User;
                    var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);
                    userRef.once('value', function (snapshot) {
                        $scope.User.email = snapshot.val().email;
                        $scope.User.tel = snapshot.val().tel;
                        $scope.User.familyNick = snapshot.val().familyNick;
                    });

                    $state.go('app.shopping');

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


});