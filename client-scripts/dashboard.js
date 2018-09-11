var app = angular.module("App", []);
app.controller("AppCtl", function ($scope, $http) {
    // definitions
    $scope.content = "";
    $scope.sendPost = () => {
        if ($scope.content != "") {
            $http({
                method: "post",
                url: "/post",
                data: JSON.stringify({
                    content: $scope.content
                }),
            }).then(() => {
                $scope.content = "";
                $scope.getPosts();
            }).catch(() => {
                console.log("Post error");
            });
        }
    };
    $scope.getPosts = () => {
        $http.get("/feed").then((data) => {
            $scope.posts = data.data;
        });
    };

    // load the posts
    $scope.getPosts();
});