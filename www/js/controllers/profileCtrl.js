angular.module('starter')

.controller('ProfileCtrl', function ($scope, $stateParams, $firebaseArray, $state, User, $cordovaToast) {

    $scope.User = User;

    $scope.saveProfile = function (form) {

        if (form.$valid) {
            var userRef = new Firebase("https://geofamily.firebaseio.com/users/" + $scope.User.uid);

            userRef.update({
                email: $scope.User.email,
                tel: $scope.User.tel,
                familyNick: $scope.User.familyNick
            });

            $state.go('app.map');
        } else {

            Toast.show("I'm a toast", '5000', 'center').subscribe(
                toast => {
                    console.log(toast);
                }
            );
        }


    }


});