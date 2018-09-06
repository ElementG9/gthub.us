var app = angular.module("OtherPosts", []);
app.controller("OtherPostsCtl", function ($scope, $http) {
    console.log($scope);
    $http.get("/feed").then((data) => {
        console.log(data);
        $scope.posts = data.data;
    });
});