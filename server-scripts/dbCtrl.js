const db = JSON.parse(require("fs").readFileSync("../config.json", "utf8")).db;
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
    },
    posts: [String],
    following: [String],
    followers: [String]
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
            var UPID = "";
            var alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < len; i++) {
                var char = alphanumeric[Math.round(Math.random() * alphanumeric.length)];
                UPID = UPID.concat(char);
            }
            mongoose.connect(db, null)
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
    createPost: function (username, data) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
                .then(() => {
                    postCtl.createUPID(6)
                        .then((UPID) => {
                            var post = new PostModel({
                                UPID: UPID,
                                username: username,
                                data: data
                            });
                            userCtl.updateUser(username, {
                                addPost: post.UPID
                            }); // add post to user
                            post.save();
                            resolve(post);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    getPost: function (UPID) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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
    getAllPosts: function () {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
                .then(() => {
                    PostModel.find({}, (err, docs) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(docs);
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
        return load;
    },
    updatePost: function (UPID, data) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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
    deletePost: function (UPID) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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
            mongoose.connect(db, null)
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
    authUser: function (username, password) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
                .then(() => {
                    userCtl.getUser(username).then((doc) => {
                        var dbpass = doc.password;
                        if (bcrypt.compareSync(password, dbpass)) {
                            userCtl.getUser(username)
                                .then((user) => {
                                    resolve(user);
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
    createUser: function (username, password) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
                .then(() => {
                    userCtl.createUUID(6)
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
    getUser: function (username) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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
    updateUser: function (username, options) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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
                        } else if (options.addPost) {
                            doc.posts.push(options.addPost);
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
    deleteUser: function (username) {
        var load = new Promise((resolve, reject) => {
            mongoose.connect(db, null)
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