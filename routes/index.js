var express = require('express');
var router = express.Router();

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
  // var path = req.body.path !== undefined ? req.body.path : "/Users/Lahphim/IdeaProjects/log-file-viewer/routes/file.log";
  var path = req.body.path !== undefined ? req.body.path : "";
  var page = req.body.page !== undefined ? (parseInt(req.body.page) > 0 ? parseInt(req.body.page) : 0) : 1;
  var totail = req.body.totail !== undefined ? req.body.totail : false;
  var limit = 10;

  if (req.xhr) {
    sluffer(path, { page: page, limit: limit, totail: totail }, function(response, page) {
      console.log(response.data);
      console.log(page);
      res.render("loglinepartial", {
        page: page,
        limit: limit,
        response: response
      });
    });
  }
});

module.exports = router;
