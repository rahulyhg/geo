angular.module('starter')

.controller('TodoCtrl', function ($scope, $stateParams, $firebaseArray, $state, $ionicModal, UserFamily, $firebase, User) {

    
    
    $scope.initData = function () {
        $scope.todos = [];
        $scope.newItem = {
            item: null,
            addedBy: User.profileImage
        };

        $scope.getTodos();
    };

    $scope.getTodos = function () {
        
        $scope.todos = [];
        var todoRef = new Firebase("https://geofamily.firebaseio.com/todoLists/"+ User.familyNick + "/items");
    
       todoRef.once('value', function (snapshot) {
            angular.forEach(snapshot.val(), function(todoItem, todoItemIndex) {
                todoItem.itemIndex = todoItemIndex;
                $scope.todos.push(todoItem);
            });
            console.log($scope.todos);
        });
    };

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('/templates/new-todo.html', function (modal) {
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
        var firebaseUrl = "https://geofamily.firebaseio.com/todoLists/"+ User.familyNick + "/items/" + item.itemIndex;
        var itemRef = new Firebase(firebaseUrl);
        itemRef.remove();
        $scope.todos.splice(index, 1);
    };

    $scope.saveNewItem = function () {
        var todoRef = new Firebase("https://geofamily.firebaseio.com/todoLists/"+ User.familyNick + "/items");
        todoRef.push($scope.newItem);
        $scope.taskModal.hide();
        $scope.initData();

    };

});