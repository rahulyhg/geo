# jw-ng-geolocation

Angular wrapper around navigator geolocation object.

[![Build Status](https://travis-ci.org/jamesgfc/jw-ng-geolocation.svg?branch=master)](https://travis-ci.org/jamesgfc/jw-ng-geolocation)

## Build & development

Run `grunt test` for unit tests and `grunt` to build.

## Usage

Include 'node_modules/dist/jw-ng-geolocation.js' or 'node_modules/dist/jw-ng-geolocation.min.js'

Depend on "jw.geolocation" in your angular module and inject geolocationFactory

Example:

```
(function() {
  "use strict";

angular.module("sampleApp.main").controller("mainCtrl", MainCtrl);

  // @ngInject
  function MainCtrl(geolocationFactory) {
    var vm = this;

    vm.getLocation = getLocation;

      function getLocation() {
          geolocationFactory.getLocation().then(function(data){
              vm.geolocation.longitude = data.coords.longitude;
              vm.geolocation.latitude = data.coords.latitude;
          }, function(error){
              vm.geolocationError = true;
              vm.geolocationMessage = error;
          });
      }
  }
})();
```
