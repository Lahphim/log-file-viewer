/**
 * Created by Somsak Arnon on 3/30/2017 AD.
 */

/**
 * File System module.
 */
var fs = require("fs");

/**
 * Cloning this object for using as responsd package.
 * This object including status, data and message.
 * @param {boolean} status - represent the status of package that successfull or not.
 * @param {object} data - use for package any type of datas.
 * @param {string} message - use for keep some human read able message. 
 */
var responseTemplate = {
  status: false,
  data: null,
  message: "Initial message."
};

/**
 * This is main function of this module.
 * Use for initialize some nessessary parameters.
 */
module.exports = function (path, opts, callback) {
  if (!opts) opts = {};
  if (opts.flags === undefined) opts.flags = "r";
  if (opts.mode === undefined) opts.mode = 666;
  if (opts.buffersize === undefined) opts.buffersize = 1*1024;
  if (opts.page === undefined) opts.page = 1;
  if (opts.totail === undefined) opts.totail = false;
  if (opts.limit === undefined) opts.limit = 10;

  // clone object from object template
  var response = JSON.parse(JSON.stringify(responseTemplate));

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
            processBuffer(fd, buffer, 0, 1, opts.page, 0, [], opts.limit, opts.totail, function(err, lines, page) {
              response.status = true;
              response.message = "Successfully.";
              response.data = lines;
              callback(response, page);
            });
          }
        });
      } else {
        response.message = "File not exist.";
        callback(response);
      }
    }
  });
};

/**
 * Using checkFileExist() to check for the existence of file before callback another function.
 * For example, use this function before open file.
 * This function just only check if a file exists without changing the file.
 * @param {string} file - An absolute path to file.
 * @param {Function} callback - The function that use for responding next process.
 */
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

/**
 * Using openFile() to open the file for reading its data.
 * Before call this function, you have to check exist file first.
 * This function not only open but also manipulate that depends on flags parameter.
 * @param {string} path - An absolute path to file.
 * @param {Object} opts - Set of option such as flags and mode.
 * @param {Function} callback - The function that use for responding next process.
 */
function openFile (path, opts, callback) {
  fs.open(path, opts.flags, opts.mode, function(err, fd) {
    callback(err, fd);
  });
}

/**
 * Using processBuffer() as a recursive function.
 * This function use for slicing buffer array as a tiny chunk and process that array to recognize the new line character.
 * If meet limit of records, the process will stop.
 * @param {integer} fd
 * @param {Array} buffer - The buffer that the data will be written to.
 * @param {integer} offset - The offet in the buffer to start writing at
 * @param {integer} fromPage - An current page pointer.
 * @param {integer} toPage - An expect page to get data.
 * @param {integer} pointer - An interger represent current cursor of lines array.
 * @param {Array} lines - Store records and send to another recursive function.
 * @param {integer} limit - An integer use for limit record in each page.
 * @param {boolean} totail - A flag represent the process go to the end of file or not.
 * @param {Function} callback - The function that use for responding next process.
 */
function processBuffer (fd, buffer, offset, fromPage, toPage, pointer, lines, limit, totail, callback) {
  fs.read(fd, buffer, 0, buffer.length, offset, function (err, bytesRead, buff) {
    if (err) {
      callback("Cannot process file.", []);
    } else {
      for (var i=0; i<bytesRead; i++) {
        if(fromPage <= toPage || totail) {
          if(pointer < limit) {
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
            fromPage++;
            pointer = 0;
            i--;
          }
        } else {
          break;
        }
      }

      if(bytesRead < buff.length) {
        var atPage = toPage;

        if(totail) {
            lines.splice(pointer);
            atPage = fromPage;
        } else {
          if (pointer < limit && (fromPage <= toPage)) {
            if (fromPage === toPage) {
              lines.splice(pointer);
              atPage = fromPage;
            } else {
              lines = [];
              atPage = fromPage + 1;
            }
          } else if(fromPage < toPage) {
            lines = [];
            atPage = fromPage + 1;
          }
        }

        callback(null, lines, atPage);
      } else {
        processBuffer(fd, buffer, offset + bytesRead, fromPage, toPage, pointer, lines, limit, totail, callback);
      }
    }
  });
}