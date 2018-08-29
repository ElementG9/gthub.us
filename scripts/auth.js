const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var UserModel = mongoose.model("User", mongoose.Schema({
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

var authFunc = function (username, password) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/authapp", null)
            .then(() => {
                getFunc(username).then((doc) => {
                    var dbpass = doc[0].password;
                    if (bcrypt.compareSync(password, dbpass)) {
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
var createFunc = function (username, password) {
    var load = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/authapp", null)
            .then(() => {
                var usr = new UserModel({
                    username: username,
                    password: bcrypt.hashSync(password, 10)
                });
                usr.save();
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
        mongoose.connect("mongodb://localhost/authapp", null)
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
        mongoose.connect("mongodb://localhost/authapp", null)
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
        mongoose.connect("mongodb://localhost/authapp", null)
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