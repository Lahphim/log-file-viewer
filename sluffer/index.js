/**
 * Created by Somsak Arnon on 3/30/2017 AD.
 */

var fs = require("fs");

var responseTemplate = {
  status: false,
  data: null,
  message: "Initial message."
};

module.exports = function (path, opts, callback) {
  if (!opts) opts = {};
  if (opts.flags === undefined) opts.flags = "r";
  if (opts.mode === undefined) opts.mode = 0666;
  if (opts.buffersize === undefined) opts.buffersize = 1*1024;
  if (opts.page === undefined) opts.page = 1;
  if (opts.totail === undefined) opts.totail = false;
  if (opts.limit === undefined) opts.limit = 10;

  // clone object from object template
  var response = JSON.parse(JSON.stringify(responseTemplate));

  if (isAbsolutePath(path)) {
    checkFileExist(path, function (err, isFile) {
      if (err) {
        response.message = "File error.";
        callback(response);
      } else {
        if (isFile) {
          response.message = "File exist.";
          openFile(path, opts, function(err, fd) {
            if (err) {
              response.message = "Cannot open file.";
              callback(response);
            } else {
              var buffer = new Buffer(opts.buffersize);
              processBuffer(fd, buffer, 0, opts.page, 0, [], opts.totail, function(err, lines) {
                response.status = true;
                response.message = "Successfully.";
                response.data = lines;
                callback(response);
              });
            }
          });
        } else {
          response.message = "File not exist.";
          callback(response);
        }
      }
    });
  } else {
    response.message = "Invalid input path.";
    callback(response);
  }
};

function isAbsolutePath (path){
  // return /^\/.*(.log)$/.test(path);
  return /^\/.*/.test(path);
}

function checkFileExist (file, callback) {
  fs.stat(file, function fsStat(err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(null, false);
      } else {
        return callback(err, false);
      }
    }
    return callback(null, stats.isFile());
  });
}

function openFile (path, opts, callback) {
  fs.open(path, opts.flags, opts.mode, function(err, fd) {
    callback(err, fd);
  });
}

function processBuffer (fd, buffer, offset, page, pointer, lines, totail, callback) {
  fs.read(fd, buffer, 0, buffer.length, offset, function (err, bytesRead, buff) {
    if (err) {
      callback("Cannot process file.", []);
    } else {
      for (var i=0; i<bytesRead; i++) {
        if(page > 0) {
          if(pointer < 10) {
            // 0x0a = New Line
            if (buff[i] === 0x0a) {
              lines[pointer] = Buffer(lines[pointer]).toString();
              pointer++;
            } else {
              if (typeof lines[pointer] === "undefined" || typeof lines[pointer] === "string") {
                lines[pointer] = [];
              }
              lines[pointer].push(buff[i]);
            }
          } else {
            page--;
            pointer = 0;
            i--;
          }
        } else {
          break;
        }
      }

      if(bytesRead < buff.length) {
        if(pointer < 10 && page > 0) {
          if(page-1 === 0) {
            lines.splice(pointer);
          } else {
            lines = [];
          }
        }

        callback(null, lines);
      } else {
        processBuffer(fd, buffer, offset + bytesRead, page, pointer, lines, totail, callback);
      }
    }
  });
}