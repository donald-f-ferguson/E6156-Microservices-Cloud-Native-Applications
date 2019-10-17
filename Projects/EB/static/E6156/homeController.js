

/*
    This is the way that old, obsolete guys build services and controllers.
 */
CustomerApp.controller("homeController", function($scope, $http, $location, $window, CustomerService) {

    console.log("Loaded.")

    $scope.register = false;
    $scope.loginRegisterResult = false;
    $scope.useEmailLogin = false;
    $scope.menuSelection = 'home';

    $scope.lemai = null;
    $scope.password = null;
    $scope.password2 = null;
    $scope.lastName = null;
    $scope.firstName = null;

    $scope.customerInfo = null;

    console.log("Controller loaded.");
    console.log("Base URL = " + $location.absUrl());
    console.log("Host = " + $location.host());
    console.log("Port = " + $location.port());
    console.log("Protocol = " + $location.protocol());

    baseUrl = "http://127.0.0.1:5033/api";

    console.log("CustomerService version = " + CustomerService.get_version());

    // This should be a separately injected service.
    // I am lazy and for got how to do this.
    sStorage = $window.sessionStorage;

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

    $scope.doLogin = function() {
        console.log("doing login")
        $("#loginModal").modal();
    };

    $scope.driveLogin = function() {
        CustomerService.driveLogin(
            $scope.lemail, $scope.password
        ).then(function (result) {
            console.log("Resolved!")
            $scope.loginRegisterResult = true;
            CustomerService.getCustomer($scope.lemail)
                .then(function(c) {
                    $scope.customerInfo = c;
                    $scope.$apply();
                })
                .catch(function(error) {
                    console.log("Boom!")
                });
        }).
            catch(function(error) {
            console.log("Error");
        })
    };



    $scope.loginOK = function() {
        if (!$scope.register) {
            if (($scope.lemail && $scope.password) &&
                ($scope.lemail.length > 0) &&
                ($scope.password.length > 0)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (($scope.lemail && $scope.password && $scope.password2) &&
                ($scope.lastName && $scope.firstName) &&
                ($scope.lemail.length > 0) &&
                ($scope.password.length > 0) &&
                ($scope.password2.length > 0) &&
                ($scope.lastName.length > 0) &&
                ($scope.firstName.length > 0)) {
                return true;
            }
            else {
                return false;
            }

        }
    };


    var urlBase = "http://127.0.0.1:5000"




});

