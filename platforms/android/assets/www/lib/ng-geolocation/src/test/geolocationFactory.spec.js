(function () {
    "use strict";

describe("jw.geolocation", function () {

    // load the service"s module
    beforeEach(module("jw.geolocation"));

    // instantiate service
    var geolocation,
        $rootScope,
        $window,
        geolocation_msgs,
        successCallback,
        errorCallback,
        optionsObj;

    beforeEach(inject(function (_geolocationFactory_,_$rootScope_,_$window_,_geolocationConstants_) {
        geolocation = _geolocationFactory_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        geolocation_msgs = _geolocationConstants_;
    }));

    beforeEach(function() {
        $window.navigator.geolocation = {
            getCurrentPosition: function() {}
        };
    });

    describe("on location success", function () {

        beforeEach(function() {
            $window.navigator.geolocation = {
                getCurrentPosition: function() {}
            };

            spyOn($window.navigator.geolocation, "getCurrentPosition").and.callFake(function(success, error, options) {
                successCallback = success;
                errorCallback = error;
                optionsObj = options;

                var position = {
                    coords: {
                        latitude: 100,
                        longitude: 200
                    }
                };

                arguments[0](position);});
        });

        afterEach(function() {
            $window.navigator.geolocation.getCurrentPosition.calls.reset();
        });

        it("should obtain user location", function () {
            var results = {};

            geolocation.getLocation().then(function(data){
                results = data;
            });

            $rootScope.$digest();

            expect($window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();

            expect(results).toEqual({
                coords : {
                    latitude : 100,
                    longitude : 200
                }
            });

            $window.navigator.geolocation.getCurrentPosition.calls.reset();
        });
    });

    describe("on location fail", function () {

        var results,
            old_navigator;

        beforeEach(function() {

            spyOn($rootScope, "$broadcast");
            old_navigator = $window.navigator;

        });

        afterEach(function() {
            $rootScope.$broadcast.calls.reset();
        });

        it("should not obtain user location due to missing geolocation", function () {

            $window.navigator = {
                geolocation:false
            };

            geolocation.getLocation().then(function(){},function(error) {
                results = error;
            });

            $rootScope.$digest();

            expect($rootScope.$broadcast).toHaveBeenCalledWith("error",geolocation_msgs["errors.location.unsupportedBrowser"]);
            expect(results).toEqual(geolocation_msgs["errors.location.unsupportedBrowser"]);

            //$window.navigator = old_navigator;
        });

        it("should not obtain user location due to rejected permission", function () {

            spyOn($window.navigator.geolocation,"getCurrentPosition").and.callFake(function() {
                var error = {
                    code: 1
                };

                arguments[1](error);
            });

            geolocation.getLocation().then(function(){},function(error) {
                results = error;
            });
            $rootScope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith("error",geolocation_msgs["errors.location.permissionDenied"]);
            expect(results).toEqual(geolocation_msgs["errors.location.permissionDenied"]);
        });

        it("should not obtain user location if the network is down or the positioning satellites can’t be contacted", function () {

            spyOn($window.navigator.geolocation,"getCurrentPosition").and.callFake(function() {
                var error = {
                    code: 2
                };

                arguments[1](error);
            });

            geolocation.getLocation().then(function(){},function(error) {
                results = error;
            });

            $rootScope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith("error",geolocation_msgs["errors.location.positionUnavailable"]);
            expect(results).toEqual(geolocation_msgs["errors.location.positionUnavailable"]);
        });

        it("should not obtain user location if it takes too long to calculate the user’s position", function () {

            spyOn($window.navigator.geolocation,"getCurrentPosition").and.callFake(function() {
                var error = {
                    code: 3
                };

                arguments[1](error);
            });

            geolocation.getLocation().then(function(){},function(error) {
                results = error;
            });

            $rootScope.$digest();

            expect($rootScope.$broadcast).toHaveBeenCalledWith("error",geolocation_msgs["errors.location.timeout"]);
            expect(results).toEqual(geolocation_msgs["errors.location.timeout"]);

        });
    });
});
})();
