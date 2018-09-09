const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const UserModel = mongoose.model("User", mongoose.Schema({
    UUID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}));
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

var postCtl = {
    createUPID: function (len) { // unique post identifier
        var load = new Promise((resolve, reject) => {
            var UserModel = require("/home/ubuntu/gthub.us/scripts/userCtl.js").UserModel;
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
    },
    createFunc: function (username, data) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    createUPID(6)
                        .then((UPID) => {
                            var post = new PostModel({
                                UPID: UPID,
                                username: username,
                                data: data
                            });
                            post.save();
                            resolve(post);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    getFunc: function (UPID) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    PostModel.findOne({
                        UPID: UPID
                    }, (err, doc) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(doc);
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    updateFunc: function (UPID, data) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    UserModel.findOne({
                        UPID: UPID
                    }, (err, doc) => {
                        if (err) throw err;
                        if (options.data) {
                            doc.data = options.data;
                            doc.save();
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    deleteFunc: function (UPID) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    PostModel.findOneAndRemove({
                            UPID: UPID
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    }
};
var userCtl = {
    createUUID: function (len) {
        var load = new Promise((resolve, reject) => {
            var UUID = "";
            var alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < len; i++) {
                var char = alphanumeric[Math.round(Math.random() * alphanumeric.length)];
                UUID = UUID.concat(char);
            }
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    UserModel.find({
                        "UUID": UUID
                    }, (err, docs) => {
                        if (err) reject(err); // if err reject
                        if (typeof docs[0] != "undefined") {
                            createUUID(len); // if not unique, regenerate uuid
                        } else {
                            resolve(UUID);
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    authFunc: function (username, password) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    getFunc(username).then((doc) => {
                        var dbpass = doc.password;
                        if (bcrypt.compareSync(password, dbpass)) {
                            resolve({
                                username: username,
                                password: password
                            });
                        } else {
                            reject();
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                    throw err;
                });
        });
        return load;
    },
    createFunc: function (username, password) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    createUUID(6)
                        .then((UUID) => {
                            var usr = new UserModel({
                                username: username,
                                password: bcrypt.hashSync(password, 10),
                                UUID: UUID
                            });
                            usr.save();
                            resolve(usr);
                        });
                })
                .catch((err) => {
                    reject(err);
                    throw err;
                });
        });
        return load;
    },
    getFunc: function (username) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    UserModel.findOne({
                        username: username
                    }, (err, doc) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(doc);
                        }
                    })
                })
                .catch((err) => {
                    reject(err);
                    throw err;
                });
        });
        return load;
    },
    updateFunc: function (username, options) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    UserModel.findOne({
                        username: username
                    }, (err, doc) => {
                        if (err) throw err;
                        if (options.username) {
                            doc.username = options.username;
                            doc.save();
                            resolve();
                        } else if (options.password) {
                            doc.password = bcrypt.hashSync(options.password, 10);
                            doc.save();
                            resolve();
                        } else {
                            reject();
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                    throw err;
                });
        });
        return load;
    },
    deleteFunc: function (username) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/gthub", null)
                .then(() => {
                    UserModel.findOneAndRemove({
                            username: username
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                    throw err;
                });
        });
        return load;
    }
};

module.exports = {
    user: userCtl,
    post: postCtl,
    PostModel: PostModel,
    UserModel: UserModel
};