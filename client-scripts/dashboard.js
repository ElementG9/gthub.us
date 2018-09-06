var app = angular.module("OtherPosts", []);
app.controller("OtherPostsCtl", function ($scope, $http) {
    $http.get("/feed/" + $scope.user).then((data) => {
        console.log(data);
        $scope.posts = data.data;
    });
});