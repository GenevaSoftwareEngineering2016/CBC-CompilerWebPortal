var birdCompilerApp = angular.module("birdCompilerApp", ["ngRoute"]);

birdCompilerApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/views/login.html"
    })
    .when("/home", {
        resolve: {
            "check": function($location, $rootScope) {
                if(!$rootScope.loggedIn){
                    $location.path('/');
                }
            }
        },
        templateUrl : "/views/main.html"
    })
    .otherwise({
        redirectTo: '/'
    });
});

birdCompilerApp.controller('iconController', function($scope, $location, $rootScope){
    $scope.home = function(){
        $location.path('/home');
    };
});

birdCompilerApp.controller('recordsCtrl', function($scope, $http, $timeout){
    
   $http.get("http://localhost:8012/Bird-Compiler/birds.php").then(function(response) {
        $scope.birds = response.data.records;
        console.log(Object.keys($scope.birds).length);
       
        function chunk(arr, size) {
          var newArr = [];
          for (var i=0; i<arr.length; i+=size) {
            newArr.push(arr.slice(i, i+size));
          }
          return newArr;
        }

        $scope.chunkedData = chunk($scope.birds, Object.keys($scope.birds).length);
       
    });
    
    $scope.AlertBird = function (obj){
        //alert(obj.item.name);
        obj.item.count++;
        
        var birddata = {
            'birdname': obj.item.name,
            'count': obj.item.count
        };
        
        $http({
            method: "POST",
            url: "http://localhost:8012/Bird-Compiler/updateList.php",
            params: birddata,
            headers:{
             'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) { // Success time
                console.log(response.data);
           }, function(response) { // Faulure time
                console.log("error!");
          });
    }

});

birdCompilerApp.controller('loginCtrl', function($scope, $location, $rootScope, $http){
    $scope.message = "";
    $rootScope.logoutContainer = { show : false };
    $scope.MsgContainer = { show : false };
    
    //http://localhost:8012/Bird-Compiler/login.php
    
    //$scope.loginNames = [
    //                        {username:'Lagatchell', password:'password'},
    //                        {username:'Zfisher', password:'password'},
    //                        {username:'Jmason', password:'password'}
    //                    ];
    
    $scope.login = function() {
        
        //for(var i=0; i<$scope.loginNames.length; i++)
        //{
        //    if($scope.username == $scope.loginNames[i].username && $scope.password == $scope.loginNames[i].password)
        //    {
        //        $rootScope.loggedIn = true;
        //    }
        //}
        
        var data = {
            'username': $scope.username,
            'password': $scope.password
        };
        
        $http({
            method: "POST",
            url: "http://localhost:8012/Bird-Compiler/login.php",
            params: data,
            headers:{
             'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) { // Success time
                console.log(response.data);
                if(response.data == $scope.username)
                {
                    $rootScope.loggedIn = true;
                    $rootScope.name = $scope.username;
                    $rootScope.logoutContainer.show = true;
                    $location.path('/home');
                }
                else 
                {
                    $scope.message = "ERROR: Invalid Username or Password!";
                    $scope.MsgContainer.show = true; 
                }
           }, function(response) { // Faulure time
             $scope.message = "ERROR: Unable to proccess your request. Please try again later.";
             $scope.MsgContainer.show = true;
          });
        
        /*if ($rootScope.loggedIn)
        {
            $rootScope.name = $scope.username;
            $rootScope.logoutContainer.show = true;
            $location.path('/home');
        }
        else {
            $scope.message = "Invalid Username or Password!";
            $scope.MsgContainer.show = true;
        }*/
    };
    
     $scope.signup = function() {
        
        var data = {
            'username': $scope.username,
            'password': $scope.password
        };
        
        $http({
            method: "POST",
            url: "http://localhost:8012/Bird-Compiler/signup.php",
            params: data,
            headers:{
             'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) { // Success time
                if(response.data == "success")
                {
                    $rootScope.loggedIn = true;
                    $rootScope.name = $scope.username;
                    $rootScope.logoutContainer.show = true;
                    $location.path('/home');
                }
                else 
                {
                    $scope.message = response.data;
                    $scope.MsgContainer.show = true; 
                }
           }, function(response) { // Faulure time
             $scope.message = "Error: Unable to proccess your request. Please try again later.";
             $scope.MsgContainer.show = true;
          });
    };
    
    $scope.hideMessage = function () {
      $scope.MsgContainer.show = false;
    };
    
    
});

birdCompilerApp.controller('logoutController', function($scope, $location, $rootScope){
    
    $scope.logout = function() {
        $rootScope.loggedIn = false;
        $rootScope.logoutContainer.show = false;
        $location.path('/');
    }
});