const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var UserModel = mongoose.model("User", mongoose.Schema({
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
                    if (docs != []) {
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
createUUID(6);
var authFunc = function (username, password) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {
                getFunc(username).then((doc) => {
                    var dbpass = doc[0].password;
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
};
var createFunc = function (username, password) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/gthub", null)
            .then(() => {
                var usr = new UserModel({
                    username: username,
                    password: bcrypt.hashSync(password, 10)
                });
                usr.save();
                resolve(usr);
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
                UserModel
                    .find({
                        username: username
                    })
                    .then((doc) => {
                        resolve(doc);
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
    authUser: authFunc,
    createUser: createFunc,
    getUser: getFunc,
    updateUser: updateFunc,
    deleteUser: deleteFunc
};