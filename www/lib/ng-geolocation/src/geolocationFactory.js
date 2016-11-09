(function () {
    "use strict";

    angular.module("jw.geolocation").factory("geolocationFactory", geolocationFactory);

    // @ngInject
    function geolocationFactory($q, $rootScope, $window, geolocationConstants) {

        return {

            getLocation: function (opts) {
                var deferred = $q.defer();

                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function (position) {
                        $rootScope.$apply(function () {
                            deferred.resolve(position);
                        });
                    }, function (error) {
                        switch (error.code) {

                            case 1:
                                $rootScope.$broadcast("error", geolocationConstants["errors.location.permissionDenied"]);
                                $rootScope.$apply(function () {
                                    deferred.reject(geolocationConstants["errors.location.permissionDenied"]);
                                });
                                break;

                            case 2:
                                $rootScope.$broadcast("error", geolocationConstants["errors.location.positionUnavailable"]);
                                $rootScope.$apply(function () {
                                    deferred.reject(geolocationConstants["errors.location.positionUnavailable"]);
                                });
                                break;

                            case 3:
                                $rootScope.$broadcast("error", geolocationConstants["errors.location.timeout"]);
                                $rootScope.$apply(function () {
                                    deferred.reject(geolocationConstants["errors.location.timeout"]);
                                });
                                break;
                        }
                    }, opts);
                } else {
                    $rootScope.$broadcast("error", geolocationConstants["errors.location.unsupportedBrowser"]);
                    $rootScope.$apply(function () {
                        deferred.reject(geolocationConstants["errors.location.unsupportedBrowser"]);
                    });
                }
                return deferred.promise;
            }
        };
    }
})();
