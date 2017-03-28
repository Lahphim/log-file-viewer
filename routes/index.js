var express = require('express');
var router = express.Router();
// var path = require('path');
// var os = require('os');

var helper = require("../helper");

/* GET home page. */
router.get('/', function(req, res, next) {
  //var path = "";
  // var page = 1;
  // var string = os.homedir();
  // var fs = require("fs");
  // // Asynchronous read
  // // fs.readFile(path.join(__dirname, 'file.log'), function (err, data) {
  // fs.readFile('/Users/Lahphim/IdeaProjects/log-file-viewer/routes/file.log', function (err, data) {
  //   if (err) {
  //       return console.error(err);
  //   }
  //   console.log("Asynchronous read: " + data.toString());
  // });

  // clone object from object template
  var response = JSON.parse(JSON.stringify(helper.responseTemplate));
  var path = "/Users/Lahphim/IdeaProjects/log-file-viewer/routes/file.log";

  if(helper.isAbsolutePath(path)) {
    helper.checkFileExist(path, function(error, isFile) {
      if(isFile) {
        response.message = "File exist.";

        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream(path)
        });

        lineReader.on('line', function (line) {
          console.log('Line from file:', line);
        });
      } else {
        response.message = "File not exist.";
      }

      res.render("index", {
        title: "Log File Viewer",
        response: response
      });
    });
  } else {
    response.message = "Invalid input path.";

    res.render("index", {
      title: "Log File Viewer",
      response: response
    });
  }
});

module.exports = router;
