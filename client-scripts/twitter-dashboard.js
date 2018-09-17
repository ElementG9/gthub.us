var socket = io();
var app = angular.module("App", []);
app.controller("AppCtl", function ($scope, $http) {
    socket.on("create post", () => {
        $scope.getPosts();
    });
    // definitions
    $scope.content = "";
    $scope.sendPost = () => {
        if ($scope.content != "") {
            $http({
                method: "post",
                url: "/twitter-clone/post",
                data: JSON.stringify({
                    content: $scope.content
                }),
            }).then(() => {
                socket.emit("create post", null);
                $scope.content = "";
            }).catch(() => {
                console.log("Post error");
            });
        }
    };
    $scope.getPosts = () => {
        $http.get("/twitter-clone/feed").then((data) => {
            $scope.posts = data.data;
        });
    };

    // load the posts
    $scope.getPosts();
});