var app = angular.module("myApp", ["config"]);

app.controller("myCtrl", function ($scope, ENV, $location, $http) {
    var vm = this;
    if (localStorage.user != undefined || localStorage.user != null) {
        vm.loginfr = false;
        vm.home = true;
        vm.username = localStorage.user;
        vm.statesdd = null;
    } else {
        vm.loginfr = true;
        vm.home = false;
    }

    vm.login = function () {
        doLogin(vm.data, $http, ENV.apiBaseUrl_Local, function (data) {
            if (data.data.result) {
                vm.home = true;
                vm.loginfr = false;
                localStorage.user = vm.data.user;
                vm.username = vm.data.user;
            }
        });
    }

    vm.logout = function () {
        doLogout($http, ENV.apiBaseUrl_Local, function (data) {
            vm.home = false;
            vm.loginfr = true;
            localStorage.clear();
            vm.username = "";
        });
    }

    bindStates(50, $http, ENV.apiBaseUrl_Local, function (data) {
        vm.states = data.data;
    });

    vm.getSingleStateData = function () {
        getSingleState(vm.statesdd, $http, ENV.apiBaseUrl_Local, function (data) {
            vm.items = data.data;
            var stateD = [];
            for (d in data.data) {
                stateD.push({ name: d, value: data.data[d] });
            }
            vm.stateDD = stateD;
        });
    }

    vm.getMessages = function () {
        bindMessages($http, ENV.apiBaseUrl_Local, function (data) {
            vm.msgData = true;
            vm.writemsg = false;
            vm.messagesDD = data.data;
        });
    }

    vm.writeMessage = function () {
        vm.writemsg = true;
        vm.msgData = false;
    }

    vm.saveMessage = function () {
        writeMsg(vm.msg, $http, ENV.apiBaseUrl_Local, function (data) {
            bindMessages($http, ENV.apiBaseUrl_Local, function (dd) {
                vm.msg = [];

                vm.msgData = true;
                vm.writemsg = false;
                vm.messagesDD = dd.data;
            });
        });
    }

});

function doLogin(data, $http, apiBaseUrl, callback) {
    $http.post(apiBaseUrl + 'login', data)
    .then(function (data) {
        callback(data);
    });
}

function doLogout($http, apiBaseUrl, callback) {
    $http.get(apiBaseUrl + 'logout')
    .then(function (data) {
        callback(data);
    });
}

function bindStates(limit, $http, apiBaseUrl, callback) {
    $http.get(apiBaseUrl + 'states?limit=' + limit)
    .then(function (data) {
        callback(data);
    });
}

function getSingleState(abbr, $http, apiBaseUrl, callback) {
    $http.get(apiBaseUrl + 'states/' + abbr)
    .then(function (data) {
        callback(data);
    });
}

function bindMessages($http, apiBaseUrl, callback) {
    $http.get(apiBaseUrl + 'read')
    .then(function (data) {
        callback(data);
    });
}

function writeMsg(data, $http, apiBaseUrl, callback) {
    $http.post(apiBaseUrl + 'write', data)
    .then(function (data) {
        callback(data);
    });
}
