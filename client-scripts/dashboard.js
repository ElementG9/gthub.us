var app = angular.module("App", []);
app.controller("AppCtl", function ($scope, $http) {
    // definitions
    $scope.content = "";
    $scope.sendPost = () => {
        console.log("Sending post: " + $scope.content);
        $http({
            method: "post",
            url: "/post",
            data: {
                content: $scope.content
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(() => {
            console.log("Post success");
            $scope.getPosts();
        }).catch(() => {
            console.log("Post error");
        });
    };
    $scope.getPosts = () => {
        console.log("Getting posts");
        $http.get("/feed").then((data) => {
            $scope.posts = data.data;
        });
    };

    // load the posts
    $scope.getPosts();
});