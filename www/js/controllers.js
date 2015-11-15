angular.module('starter.controllers', [])

.controller('ListCtrl', function ($scope, $stateParams, LocalFactory, GetFactory) {
    var listId = $stateParams.listId,
        list = this,
        storageName = 'work';

    //if localStorage is empty fetch Json through Ajax and place
    LocalFactory.ifEmpty($scope, listId);

    $scope.addItem = function () {
        val = {
            string: $scope.itemInput,
            done: "false"
        };

        LocalFactory.addItem(listId, val, 'fromUser');
        items = $scope.items;
        items.push(val);
        $scope.itemInput = '';
    }

    $scope.deleteItem = function ($index) {
        items = $scope.items;
        items.splice($index, 1);
        LocalFactory.deleteItem($index, listId);
    }
});