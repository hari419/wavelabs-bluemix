var app= angular.module("wavelabs",['ui.router','ngLodash','ngSanitize']);
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider, $urlRouterProvider){
 $urlRouterProvider.otherwise("/console");
 
 $stateProvider.
 state('console',{
  url : '/console',
  templateUrl : 'console.html'
})
.state('content', {             
  url: '/content/:creativeId',            
  templateUrl: 'content/content.html',
  params: { creativeId : null }                 
})
 .state('documents',{
  url : '/documents',
  templateUrl : 'documents/documents.html'
})
 .state('docs',{
  url : '/docs',
  templateUrl : 'documents/docs-content.html'
})
 .state('catalog',{
  url : '/catalog',
  templateUrl : 'console.html'
})
 .state('docs-starters',{
  url : '/docs-starters',
  templateUrl : 'docs-starters.html'
})
 .state('login',{
  url : '/login',
  templateUrl : 'login/console-login.html'
})
 .state('register',{
  url : '/register',
  templateUrl : 'login/console-register.html'
}); 
}]);

app.controller("myctrl", ['$scope','$http','$state','lodash',"$sce", function($scope,$http,$state,lodash,$sce){
  $http.get('http://10.9.9.92:9090/bluemix/js/datas.json')
  .then(function(response){
     $scope.categories = response.data.categori;
     $scope.starters = [];
     $scope.products = response.data.producted;
     $scope.display = [];
     $scope.filtered = [];
     $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
    }
    $scope.movie = {src:"http://calendarapp-muggier-electromagnetist.cfapps.io/swagger-ui.html"};
    $scope.myvalue = false;
    $scope.run = function(){
      $scope.myvalue = true;  
    }
      $scope.getProductsList = function(){
        $scope.display = [];
        angular.forEach($scope.categories,function(value,index){
          var category = {
            "id":value.categoryId,
            "name": value.CategoryName,
            "description": value.description,
            "subCategories": []
          };
          angular.forEach(value.subCategories,function(value,index){
            var subCategory = {
              "id":value.categoryId,
              "name": value.CategoryName,
              "products": []
            };
            angular.forEach($scope.products,function(value,index){
              if(value.categoryId === subCategory.id) {
                subCategory.products.push(value);
              }  
            });
            category.subCategories.push(subCategory);
          });
          $scope.display.push(category);
          $scope.filtered = $scope.display;
        });
      }

    $scope.startered = function(starter){
      $scope.startercont = starter;
    }

    $scope.filterProductsByCategory =function(categoryId){
      console.log('filterProductsByCategory');
      console.log('categoryId'+categoryId);
      $scope.filtered =  lodash.filter($scope.display, function(category){ console.log("category.id"+category.id);return category.id == categoryId;});
       console.log('$scope.display'+$scope.display.length);
    };
    $scope.filterProductsBySubCategory =function(subCategoryId){
        console.log('filterProductsBySubCategory');
         console.log('subCategoryId'+subCategoryId);
         $scope.filtered = [];
         lodash.filter($scope.display, function(category){ 
              for(i = 0; i < category.subCategories.length; i++) {
                var subCategory = category.subCategories[i];
                if(subCategory.id == subCategoryId){
                  $scope.filtered.push({
                     "id":category.id,
                    "name": category.name,
                    "description": category.description,
                    "subCategories": [subCategory]
                  });
                  return subCategory.id == subCategoryId
                }
              }
          });
    };

  
$scope.contented = function(prod){
        $scope.arrayX = [];
        $scope.features = [];
        $scope.carosalimages = [];
        $state.go('content', {
          creativeId: prod.productId            
        });        
        $scope.productObj = prod;
        $scope.arrayX.push(prod); 
        $scope.features = $scope.arrayX[0].features;
        $scope.caroselimg = $scope.arrayX[0].images;
}; 
   
  $scope.welcomeUser = null;
  $scope.user = {};
  $scope.reg_user={};
        $scope.register = function() {

        $http({
          method  : 'POST',
          url     : 'http://api.qa1.nbos.in/api/identity/v0/users/signup',
          data    : $scope.reg_user,
          headers : {'Authorization': 'Bearer 899ebd18-da5d-499e-9034-9d98ad370ced'} 
         })
          .then(function myFunction() {
            console.log($scope.reg_user);
            $state.go("login");
          });
        };
  $scope.loginclass = true;
$scope.login = function(){
  
  $http({
          method  : 'POST',
          url     : 'http://api.qa1.nbos.in/api/identity/v0/auth/login',
          data    : $scope.user,
          headers : {'Authorization': 'Bearer 899ebd18-da5d-499e-9034-9d98ad370ced'} 
         })
          .then(function myFunction(response) {
            $scope.welcomeUser = "Hi.." + (response.data.member.firstName + response.data.member.lastName);
            $scope.loginclass = false;
            $state.go("console");
          });
} ;



$scope.init = function(){
    $scope.getProductsList();
    for (var i = $scope.products.length - 1; i >= 0; i--) {
      if ($scope.products[i].categoryId == 8) {
        $scope.starters.push($scope.products[i]);
      };
    };
};
$scope.init();

})
}]);


