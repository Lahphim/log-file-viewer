var express = require('express');
var router = express.Router();
var path = require('path');
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  //var path = "";
  var page = 1;
  var string = os.homedir();
  var fs = require("fs");
  // Asynchronous read
  fs.readFile(path.join(__dirname, 'file.log'), function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("Asynchronous read: " + data.toString());
  });
  
  res.render('index', {
    title: 'Log File Viewer',
    asdasd: 'asd',
    items: [
      {
        name: "AAA",
        age: 18
      },
      {
        name: "BBB",
        age: 12
      },
      {
        name: "CCC",
        age: 24
      }
    ]
  });
});

module.exports = router;
