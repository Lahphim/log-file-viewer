/**
 * Created by Lahphim on 3/29/2017 AD.
 */

module.exports = {
    responseTemplate: {
        status: false,
        data: null,
        message: "Initial message."
    },

    isAbsolutePath: function(path){
        return /^\/.*(.log)$/.test(path);
    },

    checkFileExist: function(file, callback) {
        var fs = require("fs");

        fs.stat(file, function fsStat(err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return callback(null, false);
                } else {
                    return callback(err);
                }
            }
            return callback(null, stats.isFile());
        });
    }
};