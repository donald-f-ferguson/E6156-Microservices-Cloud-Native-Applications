var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope, $http) {

    console.log("Controller loaded.");

    $scope.inputFirstName = null;
    $scope.inputLastName = null;
    $scope.inputPlayerId = null;
    $scope.inputMode = null;

    $scope.buttonStates = {
        lookUp: { code: 0, msg: "Look it up dude!"},
        resetIt: { code: 1, msg: "Reset it dude."}
    };
    $scope.searchStates = {
        byId: 0,
        byName: 1
    };
    $scope.havePaging = false;
    $scope.havePrev = false;
    $scope.haveNext = false;

    var urlBase = "http://127.0.0.1:5000";


    $scope.search_type = null;
    $scope.currentPeople = null;
    $scope.currentButtonState = $scope.buttonStates.lookUp;
    $scope.currentPage = null;
    $scope.battingInfo = null;
    $scope.showDetails = false;

    $scope.canLookup = function() {
        if ($scope.inputPlayerId && $scope.inputPlayerId.length > 0) {
            return true;
        }
        if ($scope.inputLastName && $scope.inputLastName.length > 0) {
            return true;
        }
        return false;
    };

    $scope.showPeople = function() {
        var result;

        if ($scope.currentPeople) {
            result = ($scope.currentPeople.length>0)&&$scope.showList;
        }
        else {
            result = false;
        }
        return result;
    };

    $scope.doCloseDetails = function() {
        $scope.showDetails = false;
        $scope.showList = true;
    };


    $scope.details = function(index) {
        console.log("Index = " + index);
        console.log("Name = " + $scope.currentPeople[index].nameFirst);
        doGetBatting($scope.currentPeople[index].playerID);
    };

    var doGetBatting = function(playerId) {
        var url = urlBase + "/api/people/" + playerId + "/batting";
        $http.get(url).then(
            function (data) {
                result = data.data;
                console.log("Data = " + JSON.stringify(result, null, 4));
                processBatting(result);
            },
            function (error) {
                console.log("Error = " + JSON.stringify(error, null, 4));
            }
        );
    };
    var doGetPeople = function(url) {
        $http.get(url).then(
            function (data) {
                result = data.data;
                console.log("Data = " + JSON.stringify(result, null, 4));
                processPage(result);
            },
            function (error) {
                console.log("Error = " + JSON.stringify(error, null, 4));
            }
        );
    };
    $scope.doNext = function() {
        console.log("Next URL would be " + $scope.haveNext);
        doGetPeople(urlBase + $scope.haveNext);
    };
     $scope.doPrev = function() {
        console.log("Prev URL would be " + $scope.havePrev);
        doGetPeople(urlBase + $scope.havePrev);
    };

    var monthNoToStr = function(n) {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        var i = parseInt(n);
        if (i>=0 && i<=11) {
            return months[i];
        }
        else {
            return "???"
        }
    };
    var getDate = function(y, m, d) {
        var tmp = "";

        if (y && y.length>0) {
            tmp += "-" + y;
        }
        else {
            return "UNKNOWN";
        }
        if (m && m.length>0) {
            tmp = "-" + monthNoToStr(m) + tmp
        }
        else {
            return "UNKNOWN";
        }
        if (d && d.length>0) {
            tmp = d + tmp
        }
        else {
            return "UNKNOWN";
        }
        return tmp;
    };

    var safeFieldGet = function(f) {
        if (f && f.length>0) {
            return f
        }
        else {
            return "UNKNOW";
        }
    };

    var processBatting = function(result) {

        if (result.player_info.nameGiven &&
            result.player_info.nameGiven.length > 0){
            result.player_info.fullName = result.player_info.nameGiven + " " + result.player_info.nameLast;
        }
        else {
            result.player_info.fullName = result.player_info.nameFirst + " " + result.player_info.nameLast;
        }
        result.player_info.DOB = getDate(result.player_info.birthYear, result.player_info.birthMonth, result.player_info.birthDay);
        result.player_info.DOD = getDate(result.player_info.deathYear, result.player_info.deathMonth, result.player_info.deathDay);
        result.player_info.throws = safeFieldGet(result.player_info.throws);
        result.player_info.bats = safeFieldGet(result.player_info.bats);
        result.player_info.height = safeFieldGet(result.player_info.height);
        result.player_info.weight = safeFieldGet(result.player_info.weight);

        result.batting = result.batting.sort(
            function(a,b) {
                return a.yearID > b.yearID
            });

        console.log("BattingInfo = " + JSON.stringify(result, null, 4));
        $scope.battingInfo = result;
        $scope.showDetails = true;
        $scope.showList = false;
    };

    var processPage = function(result) {
        if (!result) {
            $("#exampleModal").modal();
        }
        else {
            if (result.data) {
                if (result.data.length > 0) {
                    $scope.currentPeople = result.data;
                    $scope.showList = true;
                    if (result.links.length > 0) {
                        $scope.havePaging = true;
                        $scope.haveNext = false;
                        $scope.havePrev = false;
                        for (var i = 0; i < result.links.length; i++) {
                            if (result.links[i].next) {
                                $scope.haveNext = result.links[i].next;
                            }
                            if (result.links[i].previous) {
                                $scope.havePrev = result.links[i].previous;
                            }
                        }
                    }
                }
                else {
                    $("#exampleModal").modal();
                }
            }
            else {
                $scope.currentPeople.push(result);
            };
            $scope.currentButtonState = $scope.buttonStates.resetIt;
            $scope.buttonmsg = $scope.currentButtonState.msg;
            $scope.showList = true;
            $scope.currentPage = result
        };
    };

    $scope.doButton = function() {
        if ($scope.currentButtonState === $scope.buttonStates.lookUp) {
            console.log("Looking it up!");
            var searchUrl = null;
            $scope.currentPeople = [];
            if ($scope.search_type == $scope.searchStates.byId) {
                console.log("playerid = " + $scope.inputPlayerId);
                searchUrl = urlBase + "/api/people/" + $scope.inputPlayerId;
            }
            else {
                console.log("nameLast = " + $scope.inputLastName);
                console.log("nameFirst = " + $scope.inputFirstName);
                searchUrl = urlBase + "/api/people?nameLast=" + $scope.inputLastName;
                if ($scope.inputFirstName != null) {
                    searchUrl += "&nameFirst=" + $scope.inputFirstName;
                };
            };


            doGetPeople(searchUrl)


        }
        else {
            $scope.currentPeople = [];
            $scope.battingInfo = null;
            $scope.showDetails = false;
            //$scope.showList = false;
            $scope.currentButtonState = $scope.buttonStates.lookUp
            $scope.inputFirstName = null;
            $scope.inputLastName = null;
            $scope.inputPlayerId = null;
        }
    };

    $scope.click = function() {
        console.log("Clicked.")
        console.log("Search type = " + $scope.search_type)
    }
});

