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

var createUUID = function (len) {
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
};
var authFunc = function (username, password) {
    console.log("User authenticating");
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {
                console.log("Connected to db");
                getFunc(username).then((doc) => {
                    console.log("Got user" + doc);
                    var dbpass = doc[0].password;
                    if (bcrypt.compareSync(password, dbpass)) {
                        console.log("Correct credentials");
                        resolve({
                            username: username,
                            password: password
                        });
                    } else {
                        console.log("Incorrect credentials");
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
};
var createFunc = function (username, password) {
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
};
var getFunc = function (username) {
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
};
var updateFunc = function (username, options) {
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
};
var deleteFunc = function (username) {
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
};

module.exports = {
    createUUID: createUUID,
    authUser: authFunc,
    createUser: createFunc,
    getUser: getFunc,
    updateUser: updateFunc,
    deleteUser: deleteFunc,
    UserModel: UserModel
};