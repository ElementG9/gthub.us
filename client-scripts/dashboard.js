var app = angular.module("App", []);
app.controller("AppCtl", function ($scope, $http) {
    // definitions
    $scope.content = "";
    $scope.sendPost = () => {
        console.log("Sending post");
        $http.post("/post", {
            content: $scope.content
        }).then(() => {
            console.log("Post success");
        }).catch(() => {
            console.log("Post error");
        });
        $scope.getPosts();
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