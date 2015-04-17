var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {


    $scope.formDataServer = {};

    // when landing on the page, get all todos and show them
    $scope.getStatus = function() {
        $http.get('/api/server.json')
            .success(function(data) {
                $scope.servers = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.getStatus();
    setInterval(function(){
        // use mongoose to get all todos in the database
        $scope.getStatus();
    }, 1000);



    // when submitting the add form, send the text to the node API
    $scope.createServer = function() {
        $http.post('/api/server.json', $scope.formDataServer)
            .success(function(data) {
                $scope.formDataServer = {}; // clear the form so our user is ready to enter another
                $scope.servers = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a Server after checking it
    $scope.deleteServer = function(id) {
        $http.delete('/api/server/' + id+".json")
            .success(function(data) {
                $scope.servers = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    $scope.getStatusClass = function(status) {
        if(status==200) return "label-success";
        else return "label-danger";
    }






	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
/**
 * Created by lrollus on 05/05/14.
 */
angular.module("scotchTodo")
    .filter("dateToFuzzyTime", function () {
        return function (date) {
            date = new Date(Date.parse(date));
            console.log(date);
            if(angular.isDefined(date)) {
                /*
                 * JavaScript Pretty Date
                 * Copyright (c) 2011 John Resig (ejohn.org)
                 * Licensed under the MIT and GPL licenses.
                 * 20140506: updated by lrollus
                 */

                // Takes an ISO time and returns a string representing how
                // long ago the date represents.
                function prettyDate(date){
                    diff = (((new Date()).getTime() - date.getTime()) / 1000),
                        day_diff = Math.floor(diff / 86400);

                    if ( isNaN(day_diff) || day_diff < 0) {
                        return;
                    }

//                    if(day_diff>100) {
//
//                    }


                    var result = day_diff == 0 && (
                        diff < 60 && Math.floor(diff) + " secondes ago" ||
                        diff < 120 && "1 minute ago" ||
                        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                        diff < 7200 && "1 hour ago" ||
                        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
                        day_diff == 1 && "Yesterday" ||
                        day_diff < 7 && day_diff + " days ago" ||
                        day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";

                    if(!result) {
                        var printFullDate = function (longDate) {
                            var createdDate = new Date();
                            createdDate.setTime(longDate);

                            //date format
                            var year = createdDate.getFullYear();
                            var month = (createdDate.getMonth() + 1) < 10 ? "0" + (createdDate.getMonth() + 1) : (createdDate.getMonth() + 1);
                            var day = (createdDate.getDate()) < 10 ? "0" + (createdDate.getDate()) : (createdDate.getDate());
                            return year + "-" + month + "-" + day;
                        }
                        result = printFullDate(date);
                    }
                    return result;
                }
                console.log(prettyDate(date));
                return prettyDate(date)
            } else {
                return date;
            }


        };
    })


;