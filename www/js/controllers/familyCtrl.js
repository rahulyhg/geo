angular.module('starter')

.controller('FamilyCtrl', function ($scope, $stateParams, $firebaseArray, $state, User, UserFamily) {

    $scope.User = User;

    var familyMembersPromise = UserFamily.get($scope.User.uid);
    familyMembersPromise.then(function (members) {
        $scope.FamilyMembers = members;
    });

});