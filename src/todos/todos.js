//todos
export default function($scope, todoFactory, socket){

	let params = {
		createHasInput: false
	};

	// $scope.todos = [
	// 	{
	// 		task: 'do dishes',
	// 		isCompleted: false
	// 	},
	// 	{
	// 		task: 'walk the dog',
	// 		isCompleted: true
	// 	}
	// ];

	todoFactory.getTask($scope);
	 //console.log('Привет Мир!!!');

	socket.on('message', function(data){
    	console.log(data);
    	console.log($scope);
    	$scope.todos = JSON.parse(data);
	});


	
	$scope.onCompletedClick = todo => {
		todo.isCompleted = !todo.isCompleted;
	};

	$scope.createTask = () => {
		params.createHasInput = false;
		$scope.createTaskInput = '';
	} 

	$scope.$watch('createTaskInput', val => {
		if (!val && params.createHasInput) {
			$scope.todos.pop();
			params.createHasInput = false;
		} else if (val && !params.createHasInput) {
			$scope.todos.push({ task: val, isCompleted: false });
			params.createHasInput = true;
		} else if (val && params.createHasInput) { 
			$scope.todos[$scope.todos.length - 1].task = val;
		}
	});
}