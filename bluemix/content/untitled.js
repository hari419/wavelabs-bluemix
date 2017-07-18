

$scope.filterProductsByCategory =function(categoryId){
       $scope.display =  _.filter($scope.display, function(category){ return category.id == categoryId;});
      };