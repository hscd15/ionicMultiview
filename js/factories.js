angular.module('starter.factories', [])

.factory('LocalFactory', function ($window, GetFactory) {
    var service = {};

    service.addItem = function (storageName, val, infoOrigin) {
        var newVal;
        switch (infoOrigin) {
        case "fromUser":
            dataToLocal = GetFactory.localJson(storageName);
            newVal = dataToLocal.concat(val);
            break;
        case "fromDelete":
            newVal = val;
            break;
        case "fromServer":
            newVal = val.data[storageName];
            break;
        }
        toJson = angular.toJson(newVal);
        return $window.localStorage && $window.localStorage.setItem(storageName, toJson);
    };
    
    service.removeLocal = function ($window, storageName) {
        $window.localStorage && $window.localStorage.removeItem(storageName);
    }
    service.deleteItem = function ($index, storageName, $window) {
        localJson = GetFactory.localJson(storageName);
        console.log(localJson);
        
        val = localJson.splice($index, 1);
        window = $window;
        service.removeLocal(window, storageName);
        service.addItem(storageName, localJson, "fromDelete");
    };

    service.ifEmpty = function ($scope, storageName) {
        if (GetFactory.localJson(storageName) === null) {
            var promise = GetFactory.serverJson('data', 'savedLists');

            promise.then(function (payload) {
                $scope.items = payload.data[storageName];
                service.addItem(storageName, payload, 'fromServer');
            });
        } else {
            $scope.items = GetFactory.localJson(storageName);
        }
    };
    return service;
})

.factory('GetFactory', function ($http, $window) {
    var service = {};
    service.serverJson = function (fileLocation, fileName) {
        return $http.get('../www/' + fileLocation + '/' + fileName + '.json')
    };

    service.localJson = function (storageName) {
        jsonInfo = $window.localStorage && $window.localStorage.getItem(storageName);
        return angular.fromJson(jsonInfo);
    };
    return service;
})