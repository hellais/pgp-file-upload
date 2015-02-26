'use strict';

/**
 * @ngdoc overview
 * @name pgpFileUploadApp
 * @description
 * # pgpFileUploadApp
 *
 * Main module of the application.
 */
angular
  .module('pgpFileUploadApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'flow'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
