CustomerApp = angular.module('CustomerApp', [
    'ngRoute'
]);

angular.
module('CustomerApp').
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        console.log("In route setup.")

        $routeProvider.
        when('/', {
            templateUrl: 'templates/home.template.html'
        }).
        when('/profile', {
            templateUrl: 'templates/profile.template.html'
        }).
        when('/baseball', {
            templateUrl: 'templates/app.template.html'
        }).
            otherwise({
            templateUrl: 'templates/home.template.html'
        })
        //when('/phones/:phoneId', {
        //   template: '<phone-detail></phone-detail>'
        // })//.
        //otherwise('/home');
    }
]);