var app = angular.module("App", []);
app.controller("AppCtl", function ($scope, $http) {
    // definitions
    $scope.content = "";
    $scope.sendPost = () => {
        $http({
            method: 'POST',
            url: '/post',
            data: {
                content: $scope.content
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        $scope.getPosts();
    };
    $scope.getPosts = () => {
        $http({
            method: 'GET',
            url: '/feed',
        }).then((data) => {
            $scope.posts = data.data;
        });
    };

    // load the posts
    $scope.getPosts();
});