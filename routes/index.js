var express = require('express');
var router = express.Router();

var setting = require("../setting");
var reqpath = require('path');

/* Initial library */
var sluffer = require("../sluffer");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Log File Viewer",
    response: { message: "Insert log path." }
  });
});

router.post("/getloglines", function(req, res, next) {
  var path = req.body.path !== undefined ? req.body.path : "";
  var page = req.body.page !== undefined ? (parseInt(req.body.page) > 0 ? parseInt(req.body.page) : 0) : 1;
  var totail = req.body.totail !== undefined ? req.body.totail : false;
  var limit = 10;

  sluffer(
    isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path, // check absolute path or not ?
    { page: page, limit: limit, totail: totail },
    function(response, page) {
      res.render("loglinepartial", {
        page: page,
        limit: limit,
        response: response
      });
    }
  );
});

function isAbsolutePath (path) {
  return /^(\.){0,2}(\\|\/).*/.test(path);
}

module.exports = router;
