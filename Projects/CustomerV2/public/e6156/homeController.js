var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope, $http) {

    $scope.lemail = null;
    $scope.password = null;
    $scope.password2 = null;
    $scope.firstName = null;
    $scope.lastName = null;
    $scope.register = false;

    console.log("Controller loaded.");

    $scope.loginOK = function() {
        let result = false;
        if ($scope.register) {
            result =
                ($scope.lemail && $scope.password && $scope.password2 && $scope.firstName && $scope.lastName) &&
                ($scope.password == $scope.password2);
        }
        else {
            result = ($scope.lemail && $scope.password);
        }
        return result;
    };

    $scope.doLogin = function() {
        $("#loginModal").modal("show");
    };

    $scope.driveLogin = function() {
        console.log("Driving login, first name = " + $scope.firstName + " and lastName = " + $scope.lastName);
        console.log("Driving login, email = " + $scope.lemail + " and password = " + $scope.password + " and pw2 = " + $scope.password2);
    };


});

