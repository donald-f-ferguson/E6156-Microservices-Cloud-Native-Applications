var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope, $http, $location, $window) {

    $scope.lemail = null;
    $scope.password = null;
    $scope.password2 = null;
    $scope.firstName = null;
    $scope.lastName = null;
    $scope.register = false;
    $scope.loginRegisterResult = false;
    $scope.menuSelection = 'home';

    console.log("Controller loaded.");
    console.log("Base URL = " + $location.absUrl());
    console.log("Host = " + $location.host());
    console.log("Port = " + $location.port());
    console.log("Protocol = " + $location.protocol());

    $scope.navMenu = function(selection) {
        console.log("Selection = " + selection);
        $scope.menuSelection = selection;
    };

    $scope.getNavClass = function(selection) {
        if (selection == $scope.menuSelection) {
            return "nav-item active";
        }
        else {
            return "nav-item";
        }
    };

    let getApiURL = function() {
        let host = $location.host();
        let port = $location.port();
        let protocol = $location.protocol();
        let apiUrl = protocol + "://" + host + ":" + port;
        return apiUrl;
    };

    console.log("API URL = " + getApiURL());

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
    $scope.doAddressModal = function() {
        $("#addressModal").modal("show");
    };

    let getCustomerInfo=function(data) {
        let url = getApiURL() + data.links[0].href;
        $http.get(url).then(
            function(result) {
                console.log("Result = " + JSON.stringify(result));
                $scope.customerInfo = result.data;
            },
            function(error) {
                console.log("Result = " + JSON.stringify(result));
            });
    }


    $scope.driveLogin = function() {
        let req = null;
        let url = null;
        let op = null;

        if ($scope.register) {
            req = {
                lastName: $scope.lastName,
                firstName: $scope.firstName,
                email: $scope.lemail,
                pw: $scope.password
            };
            op = "register";
            url = getApiURL() + "/register";
        }
        else {
            req = {
                email: $scope.lemail,
                pw: $scope.password
            };
            op = "login";
            url = getApiURL() + "/login";
        };

        $http.post(url, req).then(
            function(result) {
                console.log("Result = " + JSON.stringify(result));
                let authorization = result.headers('authorization');
                $window.sessionStorage.setItem("credentials", JSON.stringify(authorization));
                $scope.loginRegisterResult = true;
                $scope.loginRegisterMessage = "Success. Registered/Logged on. Click close";
                getCustomerInfo(result.data)
            },
            function(error) {
                console.log("Result = " + JSON.stringify(result));
                $scope.loginRegisterMessage = "Failed. Close and try again."
                $scope.loginRegisterResult = true;
            }
        );

    };


});

