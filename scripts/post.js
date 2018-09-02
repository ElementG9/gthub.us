const mongoose = require("mongoose");
const PostModel = mongoose.model("Post", mongoose.Schema({
    UPID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
}));
var createUPID = function (len) { // unique post identifier
    var load = new Promise((resolve, reject) => {
        var UPID = "";
        var alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < len; i++) {
            var char = alphanumeric[Math.round(Math.random() * alphanumeric.length)];
            UPID = UPID.concat(char);
        }
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {
                UserModel.find({
                    "UPID": UPID
                }, (err, docs) => {
                    if (err) reject(err); // if err reject
                    if (typeof docs[0] != "undefined") {
                        createUPID(len); // if not unique, regenerate UPID
                    } else {
                        resolve(UPID);
                    }
                });
            }).catch((err) => {
                reject(err);
            });
    });
    return load;
};
var createFunc = function (username, data) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {

            }).catch((err) => {
                reject(err);
            });
    });
    return load;
};
var getFunc = function (UPID) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {

            }).catch((err) => {
                reject(err);
            });
    });
    return load;
};
var updateFunc = function (data) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {

            }).catch((err) => {
                reject(err);
            });
    });
    return load;
};
var deleteFunc = function (UPID) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {

            }).catch((err) => {
                reject(err);
            });
    });
    return load;
};

module.exports = {
    createUPID: createUPID,
    createPost: createFunc,
    getPost: getFunc,
    updatePost: updateFunc,
    deletePost: deleteFunc
};