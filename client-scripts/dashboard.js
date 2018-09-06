var app = angular.module("OtherPosts", []);
app.controller("OtherPostsCtl", function ($scope) {
    $scope.posts = [{
        poster: "user1",
        postdata: "post1"
    }, {
        poster: "user2",
        postdata: "post2"
    }];
});