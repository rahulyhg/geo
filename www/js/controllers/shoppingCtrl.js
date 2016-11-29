angular.module('starter')

.controller('ShoppingCtrl', function ($scope, $stateParams, $firebaseArray, $state, $ionicModal, UserFamily, $firebase, User) {

    $scope.initData = function () {
        $scope.shoppings = [];
        $scope.newItem = {
            item: null,
            addedBy: User.profileImage
        };

        $scope.getShoppings();
    };

    $scope.getShoppings = function () {
        
        $scope.shoppings = [];
        var shoppingRef = new Firebase("https://geofamily.firebaseio.com/shoppingLists/"+ User.familyNick + "/items");
    
        shoppingRef.once('value', function (snapshot) {
            angular.forEach(snapshot.val(), function(shoppingItem, shoppingItemIndex) {
                shoppingItem.itemIndex = shoppingItemIndex;
                $scope.shoppings.push(shoppingItem);
            });
            console.log($scope.shoppings);
        });
    };

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('/templates/new-task.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Open our new task modal
    $scope.newTask = function () {
        $scope.taskModal.show();
    };

    // Close the new task modal
    $scope.closeNewTask = function () {
        $scope.taskModal.hide();

    };

    $scope.deleteItem = function (item, index) {
        var firebaseUrl = "https://geofamily.firebaseio.com/shoppingLists/"+ User.familyNick + "/items/" + item.itemIndex;
        var itemRef = new Firebase(firebaseUrl);
        itemRef.remove();
        $scope.shoppings.splice(index, 1);
    };

    $scope.saveNewItem = function () {
        var shoppingRef = new Firebase("https://geofamily.firebaseio.com/shoppingLists/"+ User.familyNick + "/items");
        shoppingRef.push($scope.newItem);
        $scope.taskModal.hide();
        $scope.initData();

    };

});