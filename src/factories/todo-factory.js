import angular from 'angular';
//import io from 'socket.io';

const todoFactory = angular.module('app.todoFactory', [])

.factory('todoFactory', ($http) => {
	
	function getTask($scope) {
		$http.get('/todos').success(response => {
			console.log(response);
			$scope.todos = JSON.parse(response);
		});
	}

	return {
		getTask
	};
})

// .factory('socket', function ($rootScope) {
//   var socket = io.connect();
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {  
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     }
//   };
// });

export default todoFactory;